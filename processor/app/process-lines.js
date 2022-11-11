const ftpFileReader = require("./get-ftp-file");
const readline = require("readline");
const WebSocket = require("ws");

module.exports = function (file, id, dbConnection) {
  const ws = new WebSocket(`ws://status:${process.env.WS_PORT || 3000}`);
  let inputRead = 0;

  ftpFileReader(`/ret/${file}`, function (err, stream, size) {
    const readInterface = readline.createInterface({
      input: stream,
      output: process.stdout,
      console: false,
    });

    new Promise(async (res) => {
      for await (const line of readInterface) {
        await new Promise((resolve) => {
          dbConnection.connect().then((client) => {
            client
              .query(
                `INSERT INTO ret_contents(ret_id, content) values ('${id}', $1)`,
                [line]
              )
              .then(() => {
                client.release();
                resolve();
              });
          });
        });

        inputRead += line.length + 1;

        ws.send(
          JSON.stringify({
            id,
            percent: Math.round((inputRead * 100) / size)
          })
        );
      }
      res();
    }).then(async () => {
      await new Promise(res=> {
        dbConnection.connect().then((client) => {
          client
            .query(
              `UPDATE rets set status = 'PROCESSADO' where id = ${id}`
            )
            .then(() => {
              client.release();
              res();
            });
        })
      });
      ws.send(
        JSON.stringify({
          id,
          percent: 100,
        })
      );
    });
  });
};
