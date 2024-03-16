const {
  captureFanGroup,
  updateFanGroupToMysql,
  updateAnimeToMysql,
  captureAnimeByGroup,
} = require("@/controllers/captureKisssub");

function startScheduler(callback, delay, timers) {
  setTimeout(() => {
    callback();

    setInterval(callback, timers);
  }, delay);
}

// 定时爬取更新番组信息
function captureFanGroupTimeTask() {
  const now = new Date();

  const timers = 24 * 60 * 60 * 1000;

  const delay =
    24 * 60 * 60 * 1000 -
    (now.getHours() * 60 * 60 * 1000 +
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000 +
      now.getMilliseconds());

  const callback = async () => {
    let data = await captureFanGroup();

    // 更新 sql 数据
    const { doneData: groupData } = await updateFanGroupToMysql(data);

    console.log(groupData);

    let gather = [];

    for (let team of groupData) {
      const result = await captureAnimeByGroup(team);

      gather = [...gather, ...result];
    }

    const { doneData: anime } = await updateAnimeToMysql(gather);

    console.log(anime);
  };

  startScheduler(callback, delay, timers);
}

module.exports = {
  captureFanGroupTimeTask,
};
