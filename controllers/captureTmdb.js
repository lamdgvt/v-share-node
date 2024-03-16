const tmdbRequest = require("@/utils/tmdbRequest");

// 搜索电影、电视节目和人物时，请使用多重搜索
const searchMultiByAlias = async (params) => {
  const {
    page,
    results,
    total_results: totalResults,
  } = await tmdbRequest.get("/search/multi", { params });

  return {
    page,
    results,
    totalResults,
  };
};

module.exports = {
  searchMultiByAlias,
};
