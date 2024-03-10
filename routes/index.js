const router = require("koa-router")();

const {
  captureAnimeByGroup,
  updateAnimeToMysql,
} = require("@/controllers/captureKisssub");

router.get("/", async (ctx, next) => {
  const data = await captureAnimeByGroup("2023q4");

  ctx.body = {
    data: await updateAnimeToMysql(data),
  };
});

router.get("/string", async (ctx, next) => {
  ctx.body = "koa2 string";
});

router.get("/json", async (ctx, next) => {
  ctx.body = {
    title: "koa2 json",
  };
});

module.exports = router;
