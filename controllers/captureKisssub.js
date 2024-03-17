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
  // 默认值
  const result = {
    tmdbId: null,
    backdropPath: "",
    posterPath: "",
    overview: "",
    mediaType: "",
    voteAverage: 0,
  };

  // 先后顺序 alias、name、name.split(" ")[0] 搜索
  let requestResult = null;
  requestResult = await searchMultiByAlias({ query: alias });

  if (!requestResult.results.length)
    requestResult = await searchMultiByAlias({ query: name });

  if (!requestResult.results.length)
    requestResult = await searchMultiByAlias({ query: name.split(" ")[0] });

  // 处理返回值
  if (requestResult.results.length >= 1) {
    let team = requestResult.results.find((list) => list.original_name);

    if (!team) team = requestResult.results[0];

    Object.assign(result, {
      tmdbId: team.id,
      backdropPath: team.backdrop_path,
      posterPath: team.poster_path,
      overview: team.overview,
      mediaType: team.media_type,
      voteAverage: team.vote_average,
    });
  }

  return result;
};

// 根据番组信息抓取动漫数据
const captureAnimeByGroup = async (bgmId) => {
  return new Promise((resolve, reject) => {
    try {
      const requestId = bgmId === "nowaday" ? "" : bgmId;

      crawler.queue([
        {
          uri: `https://www.kisssub.org/addon.php?r=bangumi/table&bgm_id=${requestId}`,
          callback: async (error, res, done) => {
            if (error) reject(error);

            const { $ } = res;

            const result = [];
            const reg = /\n\s{1,}/gi;

            const seasonReg =
              /(第(最终|[0-9一二三四五六七八九十])+(季|期|系列|作))|([壹贰叁肆伍陆柒捌玖拾]+之章)|(Part.[0-9])|([0-9]+nd)|(Season\s?[0-9]+)|(ⅡⅢⅣⅤⅥⅦⅧⅨⅩ)|(\S{1,}篇)/gi;
            const continueReg = /([0-9]+月新番)|(已配信→)|(即将配信→)/gi;
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

                if (!alias || alias.match(continueReg)) continue;

                console.log(alias);

                let season = alias.match(seasonReg);
                if (season) {
                  const extra = season[0].match(/[0-9]/gi);
                  if (extra) season = Number(extra[0]);
                  else season = 1;
                } else season = 1;

                const name = alias.replaceAll(seasonReg, "").trim();
                const updateWeek = week.replaceAll(updateWeekReg, "").trim();

                const {
                  tmdbId,
                  backdropPath,
                  posterPath,
                  overview,
                  mediaType,
                  voteAverage,
                } = await getSimpleInfoByName({ alias, name });

                result.push({
                  alias,
                  bgmId,
                  name,
                  season,
                  updateWeek,
                  tmdbId,
                  backdropPath,
                  posterPath,
                  overview,
                  mediaType,
                  voteAverage,
                });
              }
            }

            resolve(result);

            done();
          },
        },
      ]);
    } catch (err) {
      reject(err);
      // console.log(err);
    }
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

// 更新本季番信息至mysql 强制更新 先增后删
const updateForceNowaday = async (data) => {
  const doneData = [];
  const deleteData = [];

  const currentData = await Anime.findAll({
    where: { bgmId: "nowaday" },
  });

  for (let team of data) {
    await Anime.create(team);
    doneData.push(team);
  }

  for (let team of currentData) {
    await Anime.destroy({ where: { id: team.id } });
    deleteData.push(team.id);
  }

  return {
    doneData,
    deleteData,
  };
};

module.exports = {
  captureFanGroup,
  updateFanGroupToMysql,
  captureAnimeByGroup,
  updateAnimeToMysql,
  updateForceNowaday,
};
