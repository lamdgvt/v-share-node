const axios = require("axios");

// 默认开启 cookies
axios.defaults.withCredentials = true;

// 创建 axios 实例
const tmdbRequest = axios.create({
  // API 请求的默认前缀
  baseURL: "https://api.themoviedb.org/3",
  timeout: 30000, // 请求超时时间
  headers: {
    accept: "application/json",
    "Content-Type": "application/json;charset=utf-8",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmJkMWJmMDczY2I2ZTFjNGM2OTgxNzY2ZTAyNWIyZCIsInN1YiI6IjY1OWFiOTFkY2E0ZjY3MDI1YTU3NzRhZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h9Tvs1md5kbZ4uWjuY3LhlQvs58GdpdprMwfAQubp6A",
  },
  proxy: {
    protocol: "http",
    host: "127.0.0.1",
    port: 7890,
  },
});

// 异常拦截处理器
const errorHandler = (error) => Promise.reject(error);

// request interceptor
tmdbRequest.interceptors.request.use((config) => {
  // get 请求方式统一加上 时间戳
  if (config.method === "get") {
    config.params = {
      _t: new Date().getTime(),
      ...(config.params || {}),
    };
  }

  return config;
}, errorHandler);

// response interceptor
tmdbRequest.interceptors.response.use((response, config) => {
  const { data } = response;
  if (data?.code === 403) {
  }

  return data;
}, errorHandler);

module.exports = tmdbRequest;
