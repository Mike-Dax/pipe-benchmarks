const { BrowserWindow, ipcMain, app } = require("electron");

const browserWindowOptions = {
  webPreferences: {
    nodeIntegration: true
  }
};

app.once("ready", async () => {
  const server = new BrowserWindow(browserWindowOptions);
  const client = new BrowserWindow(browserWindowOptions);

  server.webContents.openDevTools();
  client.webContents.openDevTools();

  // setup MessageChannel method
  ipcMain.on("port", e => {
    client.webContents.postMessage("port", null, e.ports);

    for (const port of e.ports) {
      port.start();
    }
  });

  await client.loadFile("client.html");
  await server.loadFile("server.html");

  // Setup sendTo method
  server.webContents.send("client", client.webContents.id);
  client.webContents.send("server", server.webContents.id);
});
