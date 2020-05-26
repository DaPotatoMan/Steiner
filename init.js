const { app, shell, BrowserWindow } = require('electron');
const path = require('path');

class System {
  static Init() {
    app.whenReady().then(System.CreateWindow);
    app.on("activate", System.CreateWindow);
    app.on("window-all-closed", System.Quit);
  }

  static Quit() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }

  static CreateWindow() {
    if (BrowserWindow.getAllWindows().length === 0) {
      const start_time = new Date().getTime();
      const loader_window = new BrowserWindow({
        width: 800,
        height: 500,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        icon: path.join(__dirname, "res/drawable/icons/steiner.ico"),
      });
      loader_window.loadFile("res/pages/splash_screen.html");

      const main_window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        resizable: false,

        title: "Steiner",
        icon: path.join(__dirname, "res/drawable/icons/steiner.ico"),

        webPreferences: {
          nodeIntegration: false,
          enableRemoteModule: true,
          preload: path.join(__dirname, "preload.js")
        }
      });

      main_window.setMenu(null);
      main_window.loadFile("res/pages/main.html");
      main_window.once('ready-to-show', () => {
        let time_now = new Date().getTime();
        let time_load = start_time - time_now;

        // SLEEP FOR 2 SECONDS
        if (time_load < 2000) {
          var start = new Date().getTime(), expire = start + 2000;
          while (new Date().getTime() < expire) { }
        }

        loader_window.destroy();
        main_window.show();
      });
      main_window.webContents.on('new-window', function (event, url) {
        event.preventDefault();
        shell.openExternal(url);
      });
    }
  }
}

System.Init();