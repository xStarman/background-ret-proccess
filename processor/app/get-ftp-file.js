var Client = require("ftp");

module.exports = function (file, callback) {
  var c = new Client();
  c.on("ready", function () {
    c.size(file, function (err, size) {
      c.get(file, function (err, stream) {
        stream.once("close", function () {
          c.end();
        });
        callback(err, stream, size);
      });
    });
  });
  c.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER_NAME,
    password: process.env.FTP_USER_PASS,
  });
};
