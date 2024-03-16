const router = require("koa-router")();

const { captureAnimeByGroup } = require("@/controllers/captureKisssub");
const { searchMultiByAlias } = require("@/controllers/captureTmdb");

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

router.get("/test11", async (ctx, next) => {
  ctx.body = {
    data: await captureAnimeByGroup("2023q4"),
  };
});

router.get("/test22", async (ctx, next) => {
  const { query } = ctx.request;

  ctx.body = {
    data: await searchMultiByAlias(query),
  };
});

module.exports = router;
