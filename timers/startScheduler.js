function startScheduler(callback) {
  const now = new Date();
  const delay =
    24 * 60 * 60 * 1000 -
    (now.getHours() * 60 * 60 * 1000 +
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000 +
      now.getMilliseconds());

  setTimeout(() => {
    callback();
    setInterval(callback, 24 * 60 * 60 * 1000);
  }, delay);
}

module.exports = startScheduler;
