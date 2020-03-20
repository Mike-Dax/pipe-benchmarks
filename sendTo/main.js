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

  await client.loadFile("client.html");
  await server.loadFile("server.html");

  server.webContents.send("client", client.webContents.id);
  client.webContents.send("server", server.webContents.id);
});
