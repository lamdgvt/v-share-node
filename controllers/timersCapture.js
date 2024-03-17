const {
  captureFanGroup,
  updateFanGroupToMysql,
  updateAnimeToMysql,
  captureAnimeByGroup,
  updateForceNowaday,
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

    // 根据番季信息获取对应的数据
    for (let team of groupData) {
      const result = await captureAnimeByGroup(team);

      gather = [...gather, ...result];
    }

    const { doneData: anime } = await updateAnimeToMysql(gather);

    console.log(anime);

    // 获取当前季度信息
    const current = await captureAnimeByGroup("nowaday");

    const { doneData: currentData, deleteData: currentDelete } =
      await updateForceNowaday(current);

    console.log(currentData, currentDelete);
  };

  startScheduler(callback, 100, timers);
}

module.exports = {
  captureFanGroupTimeTask,
};
