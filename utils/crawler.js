const Crawler = require("crawler");

module.exports = new Crawler({
  maxConnections: 10,
  callback: (error, res, done) => {
    if (error) console.log(error);
    done();
  },
});
