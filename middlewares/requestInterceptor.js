async function requestInterceptor(ctx, next) {
  try {
    // 在这里编写你的请求拦截逻辑
    console.log("请求路径:", ctx.url);

    // 继续执行后续中间件和路由处理
    await next();
  } catch (error) {
    console.error("请求拦截器出错:", error);

    ctx.status = 500;

    ctx.body = {
      code: 500,
      data: null,
      msg: error,
    };
  }
}

module.exports = requestInterceptor;
