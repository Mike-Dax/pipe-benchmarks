const { ipcRenderer } = require("electron");

let serverWindowID = null;

ipcRenderer.once("server", (event, id) => {
  serverWindowID = id;
  console.log("received server id");
});

ipcRenderer.on("ping", (e, data) => {
  ipcRenderer.sendTo(serverWindowID, "pong", data);
});
