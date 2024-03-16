const dayjs = require("dayjs");
const crawler = require("@/utils/crawler");
const QuarterList = require("@/sequelize/quarterList");
const AnimeSchedule = require("@/sequelize/animeSchedule");
const Anime = require("@/sequelize/anime");
const { searchMultiByAlias } = require("./captureTmdb");

// 格式化 Kisssub 特殊名字日期
const formatKissName = (data, quarterList) => {
  const textReg = /\n\s{1,}/gi;

  // 处理多余字符串
  let [date, quarter] = data.trim().replaceAll(textReg, " ").split(" ");

  date = date.replaceAll(/年/gi, "-");
  date = date.replaceAll(/月/gi, "");
  const DATE = dayjs(date);
  date = dayjs(date).format("YYYY-MM-01");

  const team = quarterList.find((list) => list.name === quarter);

  return {
    date,
    bgmId: `${DATE.format("YYYY")}${team?.code}`,
    quarterCode: team?.code || "",
  };
};

// 抓取番组数据
const captureFanGroup = async () => {
  return new Promise((resolve, reject) => {
    crawler.queue([
      {
        uri: "https://www.kisssub.org/addon.php?r=bangumi/table",
        callback: async (error, res, done) => {
          if (error) reject(error);

          const { $ } = res;

          const bgmNav = $("#bgm-nav");
          const groupList = bgmNav.find(".module a");

          const arr = [];

          const quarterList = await QuarterList.findAll().catch((err) =>
            console.log(err)
          );

          for (let i = 0; i < groupList.length; i++) {
            const team = groupList[i];

            const { id } = team.attribs;
            const { data } = team.children[0];

            if (!id || data.includes("首页")) continue;

            arr.push(formatKissName(data, quarterList));
          }

          resolve(arr);

          done();
        },
      },
    ]);
  });
};

// 更新番组数据至mysql
const updateFanGroupToMysql = async (data) => {
  const doneData = [];
  const skipData = [];

  for (let i = 0; i < data.length; i++) {
    const team = data[i];
    const { bgmId } = team;

    const existingData = await AnimeSchedule.findOne({
      where: { bgm_id: bgmId },
    });

    if (!existingData) {
      await AnimeSchedule.create(team);
      doneData.push(team.bgmId);
    } else skipData.push(team.bgmId);
  }

  return {
    doneData,
    skipData,
  };
};

// 根据番名抓取 tmdb 对应的简短信息
const getSimpleInfoByName = async ({ name, alias }) => {
  const aliasResult = await searchMultiByAlias(alias);

  if (aliasResult.page > 0) {
    const team = aliasResult.find((list) => list.original_name);

    console.log(team);
  }
};

// 根据番组信息抓取动漫数据
const captureAnimeByGroup = async (bgmId) => {
  return new Promise((resolve, reject) => {
    crawler.queue([
      {
        uri: `https://www.kisssub.org/addon.php?r=bangumi/table&bgm_id=${bgmId}`,
        callback: async (error, res, done) => {
          if (error) reject(error);

          const { $ } = res;

          const result = [];
          const reg = /\n\s{1,}/gi;
          const seasonReg = /(第[0-9]季)|(Part.[0-9])|(\S{1,}篇)/gi;
          const continueReg = /[0-9]{1,2}月新番/gi;
          const updateWeekReg = /\（(金|木|水|火|土|日|月)\）/gi;

          const bgmTable = $("#bgm-table");
          const weekDl = bgmTable.find("dl");

          for (let i = 0; i < weekDl.length; i++) {
            const team = weekDl[i];

            const dt = $(team).find("dt");
            const animeDDA = $(team).find("dd a");

            const { data: week } = dt[0].children[0];

            for (let i = 0; i < animeDDA.length; i++) {
              const team = animeDDA[i];

              const alias = team.children[0].data.replaceAll(reg, "").trim();

              if (alias.match(continueReg)) continue;

              let season = alias.match(seasonReg);
              if (season) season = Number(season[0].match(/[0-9]/gi)[0]);
              else season = 1;

              const name = alias.replaceAll(seasonReg, "").trim();
              const updateWeek = week.replaceAll(updateWeekReg, "").trim();

              await getSimpleInfoByName({ alias, name });

              result.push({
                alias,
                bgmId,
                name,
                season,
                updateWeek,
              });
            }
          }

          resolve(result);

          done();
        },
      },
    ]);
  });
};

// 更新番组信息至mysql
const updateAnimeToMysql = async (animeList) => {
  const doneData = [];
  const skipData = [];

  for (let i = 0; i < animeList.length; i++) {
    const team = animeList[i];

    const { bgmId, season, alias, name } = team;

    const existingData = await Anime.findOne({
      where: { bgm_id: bgmId, season, alias, name },
    });

    if (!existingData) {
      await Anime.create(team);
      doneData.push(team);
    } else skipData.push(team);
  }

  return { doneData, skipData };
};

module.exports = {
  captureFanGroup,
  updateFanGroupToMysql,
  captureAnimeByGroup,
  updateAnimeToMysql,
};
