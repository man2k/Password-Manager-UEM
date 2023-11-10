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
    // Make sure to exit the extension process when WS extension is closed (when Neutralino app exits)
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
  function onmessage(e) {
    // the typical message sent from the neu application is a string in the form {"data": value, "event": "dispatchedEventName"} so we parse the data here
    if (typeof e.data === "string") {
      const message = JSON.parse(e.data);

      // Use extensions.dispatch or extensions.broadcast from the app,
      // to send an event here
      const eventName = message.event;
      if (eventName === "windowClose") {
        ws.close(0);
      } else if (eventName === "readPrivData") {
        const data = JSON.parse(message.data);
        console.log(data);

        const db = new sqlite3.Database(`${data.uuid}.db`);
        let dataArray = []; // Initialize an array to store the objects
        db.serialize(function () {
          db.run("PRAGMA cipher_compatibility = 4");

          db.run(`PRAGMA key = '${data.uuid}'`);
          // db.run(
          //   `CREATE TABLE IF NOT EXISTS "${data.uuid}" (website TEXT,username TEXT, email TEXT, password TEXT, notes TEXT)`
          // );
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
              // console.log("All rows fetched:", dataArray);
            }
          );
        });
        db.close();
      } else if (eventName === "newPassword") {
        const data = JSON.parse(message.data);
        const db = new sqlite3.Database(`${data.uuid}.db`);
        console.log(data);
        let dataArray = [];
        db.serialize(function () {
          db.run("PRAGMA cipher_compatibility = 4");
          db.run(`PRAGMA key = '${data.uuid}'`);
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
              // console.log("All rows fetched:", dataArray);
            }
          );
        });
        db.close();

        sendData(dataArray);
      }
      // Add else for the default case if needed
    }
  }
  const ws = new websocket(WS_URL);
  ws.onopen = onopen;
  ws.onmessage = onmessage;
  ws.onerror = onerror;
  ws.onclose = onclose;
};

dataFunction();
