const tmdbRequest = require("@/utils/tmdbRequest");

// 搜索电影、电视节目和人物时，请使用多重搜索
const searchMultiByAlias = async (params) => {
  Object.assign(params, { language: "zh-CN" });

  const result = await tmdbRequest
    .get("/search/multi", { params })
    .catch((err) => console.log(err));

  return {
    page: result?.page || 0,
    results: result?.results || [],
    totalResults: result?.total_results || 0,
  };  
};

module.exports = {
  searchMultiByAlias,
};
