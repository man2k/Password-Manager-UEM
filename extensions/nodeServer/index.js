const sqlite3 = require("@journeyapps/sqlcipher").verbose();
const fs = require("fs");
const websocket = require("websocket").w3cwebsocket;
const { v4: uuidv4 } = require("uuid");

// get authentication info from the file that is regenerated each time the app is launched
// let authInfo = fs.readFileSync("../../.tmp/auth_info.json");
let authInfo = fs.readFileSync(".tmp/auth_info.json");
authInfo = JSON.parse(authInfo);

const NL_PORT = authInfo.port;
const NL_TOKEN = authInfo.accessToken;
const NL_EXTID = "password.manager.uem.nodeServer";
const WS_URL = `ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`;

const dataFunction = () => {
  function onerror(e) {
    console.log("There is a connection error!");
  }

  function onopen() {
    console.log("Connected to application!");
  }

  function onclose() {
    console.log("Connection has been closed");
    process.exit();
  }

  function sendData(dataArray) {
    ws.send(
      JSON.stringify({
        id: uuidv4(),
        method: "app.broadcast",
        accessToken: NL_TOKEN,
        data: {
          event: "readPrivReply",
          data: JSON.stringify(dataArray),
        },
      })
    );
  }

  // function searchRow(db, uuid, searchColumn, searchValue, callback) {
  //   const query = `SELECT * FROM "${uuid}" WHERE "${searchColumn}" = ?`;
  //   db.get(query, [searchValue], function (err, row) {
  //     if (err) {
  //       callback(err);
  //       return;
  //     }
  //     callback(null, row);
  //   });
  // }

  function deleteRowById(db, uuid, rowId, callback) {
    const query = `DELETE FROM "${uuid}" WHERE rowid = ?`;
    db.run(query, [rowId], function (err) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, `Row with ID ${rowId} deleted successfully.`);
    });
  }

  function onmessage(e) {
    if (typeof e.data === "string") {
      const message = JSON.parse(e.data);

      const eventName = message.event;
      if (eventName === "windowClose") {
        ws.close(0);
      } else if (eventName === "initDB") {
        const data = JSON.parse(message.data);

        console.log("newdb", data);
        const db = new sqlite3.Database(`${data.uuid}.db`);
        db.serialize(function () {
          db.run("PRAGMA cipher_compatibility = 4");
          db.run(`PRAGMA key = '${data.password}'`);
          db.run(
            `CREATE TABLE IF NOT EXISTS "${data.uuid}" (website TEXT,username TEXT, email TEXT, password TEXT, notes TEXT)`
          );
        });
        db.close();
      } else if (eventName === "readPrivData") {
        const data = JSON.parse(message.data);
        console.log("read", data);
        // let db;
        console.log(fs.existsSync(`${data.uuid}.db`));
        if (fs.existsSync(`${data.uuid}.db`)) {
          const db = new sqlite3.Database(`${data.uuid}.db`);
          let dataArray = [];
          db.serialize(function () {
            db.run("PRAGMA cipher_compatibility = 4");

            db.run(`PRAGMA key = '${data.password}'`);

            db.each(
              `SELECT rowid AS id, website, username, email, password, notes FROM "${data.uuid}"`,
              function (err, row) {
                if (err) {
                  console.error(err);
                  return;
                }
                dataArray.push({
                  id: row.id,
                  website: row.website,
                  username: row.username,
                  email: row.email,
                  password: row.password,
                  notes: row.notes,
                });
              },
              function (err, count) {
                if (err) {
                  console.error(err);
                  return;
                }
                sendData(dataArray);
              }
            );
          });
          db.close();
        } else {
          console.log("DB don't exist");
          return;
        }
        // const db = new sqlite3.Database(`${data.uuid}.db`);
      } else if (eventName === "newPassword") {
        const data = JSON.parse(message.data);
        const db = new sqlite3.Database(`${data.uuid}.db`);
        // console.log(data);
        let dataArray = [];
        db.serialize(function () {
          db.run("PRAGMA cipher_compatibility = 4");
          db.run(`PRAGMA key = '${data.mpassword}'`);
          db.run(
            `CREATE TABLE IF NOT EXISTS "${data.uuid}" (website TEXT,username TEXT, email TEXT, password TEXT, notes TEXT)`
          );
          const stmt = db.prepare(
            `INSERT INTO "${data.uuid}" VALUES (?, ?, ?, ?, ?)`
          );
          stmt.run(
            data.website,
            data.username,
            data.email,
            data.password,
            data.notes
          );
          stmt.finalize();

          db.each(
            `SELECT rowid AS id, website, username, email, password, notes FROM "${data.uuid}"`,
            function (err, row) {
              if (err) {
                console.error(err);
                return;
              }
              dataArray.push({
                id: row.id,
                website: row.website,
                username: row.username,
                email: row.email,
                password: row.password,
                notes: row.notes,
              });
            },
            function (err, count) {
              if (err) {
                console.error(err);
                return;
              }
              console.log(dataArray);
              sendData(dataArray);
            }
          );
        });
        db.close();

        sendData(dataArray);
      } else if (eventName === "deletePassword") {
        const data = JSON.parse(message.data);
        const db = new sqlite3.Database(`${data.uuid}.db`);
        db.serialize(function () {
          db.run("PRAGMA cipher_compatibility = 4");
          db.run(`PRAGMA key = '${data.password}'`);
          deleteRowById(db, data.uuid, data.rowid, function (err, message) {
            if (err) {
              console.error("Error:", err);
              return;
            }
            console.log(message);
          });
        });
        db.close();
      }
    }
  }
  const ws = new websocket(WS_URL);
  ws.onopen = onopen;
  ws.onmessage = onmessage;
  ws.onerror = onerror;
  ws.onclose = onclose;
};

dataFunction();
