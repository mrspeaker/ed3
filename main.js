"use strict";

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 640,
    minWidth: 480
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => mainWindow = null);
}

app.on("ready", () => {
  ["--harmony_destructuring"]
    .forEach(f => app.commandLine.appendSwitch("js-flags", f));
  //--harmony_modules // doesn't work in current Node.
  //--harmony_array_includes
  //--harmony_rest_parameters
  createWindow();
});
app.on("activate", () => !mainWindow && createWindow());
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
