const remote = require("remote");
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = remote.dialog;

const isDarwin = process.platform == "darwin";

function initMenu (editor) {
  var menu = new Menu();
  menu.append(new MenuItem({ label: "MenuItem1", click: () => console.log("item 1 clicked") }));
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(new MenuItem({ label: "MenuItem2", type: "checkbox", checked: true }));

  window.addEventListener("contextmenu", e => {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  }, false);

  const template = [
    {
      label: "File",
      submenu: [
        { label: "Open", click: (item, win) => {
          dialog.showOpenDialog(
            win,
            { properties: [ "openFile"], filters: [{ name: "ED3 config", extensions: ["json"] }]},
            files => files.length === 1 && editor.loadProject(files[0])
          );
        }},
        { label: "Save", click: (item, win) => {
          dialog.showSaveDialog(
            win,
            { properties: [ "openDirectory", "createDirectory" ], defaultPath: "ed3.json", filters: [{ name: "ED3", extensions: ["json"] }]},
            file => editor.saveProject(file)
          );
        }}
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo"},
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo"},
        { type: "separator"},
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut"},
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy"},
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste"},
        { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall"},
      ]
    }, {
      label: "View",
      submenu: [
        { label: "Reload", accelerator: "CmdOrCtrl+R",
          click: (item, focusedWindow) => focusedWindow && focusedWindow.reload() },
        { label: "Toggle Full Screen", accelerator: isDarwin ? "Ctrl+Command+F" : "F11",
          click: (item, focusedWindow) => focusedWindow && focusedWindow.setFullScreen(!focusedWindow.isFullScreen()) },
        { label: "Toggle Developer Tools", accelerator: isDarwin ? "Alt+Command+I" : "Ctrl+Shift+I",
          click: (item, focusedWindow) => focusedWindow && focusedWindow.toggleDevTools() }
      ]
    }, {
      label: "Windowa",
      role: "window",
      submenu: [
        { label: "Minimize", accelerator: "CmdOrCtrl+M", role: "minimize" },
        { label: "Close", accelerator: "CmdOrCtrl+W", role: "close"}
      ]
    }, {
      label: "Help",
      role: "help",
      submenu: [
        { label: "Learn More", click: () => require("electron").shell.openExternal("http://electron.atom.io") }
      ]
    }];

  if (isDarwin) {
    const app = require("electron").remote.app;
    const appName = app.getName();
    template.unshift({
      label: appName,
      submenu: [
        { label: "About " + appName, role: "about" },
        { type: "separator" },
        { label: "Services", role: "services", submenu: [] },
        { type: "separator" },
        { label: "Hide " + appName, accelerator: "Command+H", role: "hide" },
        { label: "Hide Others", accelerator: "Command+Alt+H", role: "hideothers" },
        { label: "Show All", role: "unhide" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => app.quit() }
      ]
    });
    // Window menu.
    template[3].submenu.push(
      { type: "separator"},
      { label: "Bring All to Front", role: "front" });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

module.exports = initMenu;
