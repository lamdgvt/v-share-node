const AnimeSchedule = require("@/sequelize/animeSchedule");
const QuarterList = require("@/sequelize/quarterList");
const Anime = require("@/sequelize/anime");

const router = require("koa-router")();

router.prefix("/anime");

// router.get("/", async (ctx, next) => {
//   const data = await
// });

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
