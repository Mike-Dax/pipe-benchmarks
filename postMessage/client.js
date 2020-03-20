const { ipcRenderer } = require("electron");

ipcRenderer.on("port", e => {
  const [port] = e.ports;
  port.onmessage = e => {
    port.postMessage(e.data);
  };

  console.log("Received port", e.ports);
});
