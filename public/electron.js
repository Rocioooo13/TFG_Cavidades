const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const isWindows = process.platform === "win32";
let needsFocusFix = false;
let triggeringProgrammaticBlur = false;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.on("blur", () => {
    if (!triggeringProgrammaticBlur) {
      needsFocusFix = true;
    }
  });

  win.on("focus", () => {
    if (isWindows && needsFocusFix) {
      needsFocusFix = false;
      triggeringProgrammaticBlur = true;
      setTimeout(function () {
        win.blur();
        win.focus();
        setTimeout(function () {
          triggeringProgrammaticBlur = false;
        }, 100);
      }, 100);
    }
  });

  // Load app
  win.loadFile(path.join(__dirname, "../build/index.html"));

  // rest of code.. PARA QUE SE ABRA LA VENTANA DevTool
  win.webContents.openDevTools();
}

app.on("ready", createWindow);

// ipcMain.on("toMain", (event, args) => {
//   fs.readFile("path/to/file", (error, data) => {
//     // Do something with file contents

//     // Send result back to renderer process
//     win.webContents.send("fromMain", responseObj);
//   });
// });
