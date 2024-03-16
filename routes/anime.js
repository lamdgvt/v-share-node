const AnimeSchedule = require("@/sequelize/animeSchedule");
const QuarterList = require("@/sequelize/quarterList");
const Anime = require("@/sequelize/anime");

const router = require("koa-router")();

router.prefix("/anime");

// 获取动漫番信息 根据 bgmId
router.post("/animeByBgmId", async (ctx, next) => {
  const { body } = ctx.request;

  const data = await Anime.findAll({
    attributes: {
      exclude: ["bgmId"],
    },
    where: {
      bgmId: body.bgmId,
    },
  });

  const group = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };

  const keys = {
    星期一: "Mon",
    星期二: "Tue",
    星期三: "Wed",
    星期四: "Thu",
    星期五: "Fri",
    星期六: "Sat",
    星期日: "Sun",
  };

  for (let i = 0; i < data.length; i++) {
    const team = data[i];
    const key = keys[team.updateWeek];

    if (!key) continue;

    group[key].push(team);
  }

  ctx.body = {
    code: 0,
    data: group,
  };
});

// 获取动漫番信息列表
router.get("/schedule", async (ctx, next) => {
  const data = await AnimeSchedule.findAll();

  ctx.body = {
    code: 0,
    data,
  };
});

// 获取季度信息
router.get("/quarterList", async (ctx, next) => {
  const data = await QuarterList.findAll();

  ctx.body = {
    code: 0,
    data,
  };
});

module.exports = router;
