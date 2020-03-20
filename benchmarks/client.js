const { ipcRenderer } = require("electron");

// MessageChannel
ipcRenderer.on("port", e => {
  const [port] = e.ports;
  port.onmessage = e => {
    port.postMessage(e.data);
  };

  console.log("Received port", e.ports);
});

// sendTo
let serverWindowID = null;

ipcRenderer.once("server", (event, id) => {
  serverWindowID = id;
  console.log("received server id");
});

ipcRenderer.on("ping", (e, data) => {
  ipcRenderer.sendTo(serverWindowID, "pong", data);
});
