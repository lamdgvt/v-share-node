const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const { addAliases } = require("module-alias");
addAliases({ "@": __dirname });

const requestInterceptor = require("./middlewares/requestInterceptor");
const startScheduler = require("./timers/startScheduler");
const {
  captureFanGroup,
  updateFanGroupToMysql,
} = require("./controllers/captureKisssub");

app.use(requestInterceptor);

const index = require("./routes/index");
const users = require("./routes/users");
const kisssub = require("./routes/anime");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(kisssub.routes(), kisssub.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

startScheduler(async () => {
  const data = captureFanGroup();
  updateFanGroupToMysql(data);
});

module.exports = app;
