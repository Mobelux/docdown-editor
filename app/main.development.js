import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron';
import { newFile, saveFile, saveAsFile, closeFile, discardFile } from './actions/files';
import { openFolder } from './actions/folder';
import { findText, replaceText, replaceAllText, clearText } from './actions/replacer';
import {
  toggleSidebar, togglePane, toggleCount, increaseFontSize, decreaseFontSize, resetFontSize
} from './actions/ui';

let menu;
let template;
let mainWindow = null;
let dialogWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support'); // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path'); // eslint-disable-line
  const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
  require('module').globalPaths.push(p); // eslint-disable-line
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (dialogWindow) {
    dialogWindow.destroy();
  }
  if (mainWindow) {
    mainWindow.close();
  }
});


const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) { // eslint-disable-line
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

const launchApp = async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  dialogWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    width: 400,
    height: 172
  });
  dialogWindow.loadURL(`file://${__dirname}/replacer.html`);

  dialogWindow.on('close', (e) => {
    e.preventDefault();
    dialogWindow.hide();
    dialogWindow.webContents.send('clear');
    if (mainWindow) {
      mainWindow.webContents.send('redux', clearText());
    }
  });

  dialogWindow.on('closed', () => {
    dialogWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    // dialogWindow.openDevTools();
    dialogWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          dialogWindow.inspectElement(x, y);
        }
      }]).popup(dialogWindow);
    });
  }

  ipcMain.on('save-as', (e, id) => {
    dialog.showSaveDialog(mainWindow, {}, (filename) => {
      if (filename) {
        mainWindow.webContents.send('redux', saveAsFile(id, filename));
      }
    });
  });

  ipcMain.on('close-unsaved', (e, id, path) => {
    let file;
    if (path && path !== '') {
      const pieces = path.split('/');
      file = pieces[pieces.length - 1];
    } else {
      file = 'Unsaved File';
    }
    dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Don’t Save', 'Cancel', 'Save'],
      defaultId: 2,
      title: `'${file}' has changes, do you want to save them?`,
      message: 'Your changes will be lost if you close this item without saving.'
    }, (response) => {
      if (response === 2) {
        if (path && path !== '') {
          mainWindow.webContents.send('redux', saveFile(id));
          mainWindow.webContents.send('redux', closeFile(id));
        } else {
          dialog.showSaveDialog(mainWindow, {}, (filename) => {
            if (filename) {
              mainWindow.webContents.send('redux', saveAsFile(id, filename));
              mainWindow.webContents.send('redux', closeFile(id));
            }
          });
        }
      } else if (response === 0) {
        mainWindow.webContents.send('redux', discardFile(id));
      }
    });
  });

  ipcMain.on('find', (e, find) => {
    mainWindow.webContents.send('redux', findText(find));
  });

  ipcMain.on('replace', (e, find, replace) => {
    mainWindow.webContents.send('redux', replaceText(find, replace));
  });

  ipcMain.on('replace-all', (e, find, replace) => {
    mainWindow.webContents.send('redux', replaceAllText(find, replace));
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(x, y);
        }
      }]).popup(mainWindow);
    });
  }

  if (process.platform === 'darwin') {
    template = [{
      label: 'DocDown',
      submenu: [{
        label: 'About DocDown',
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide DocDown',
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit();
        }
      }]
    }, {
      label: 'File',
      submenu: [{
        label: 'New File',
        accelerator: 'Command+N',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', newFile());
          } else {
            launchApp();
          }
        }
      }, {
        label: 'Open',
        accelerator: 'Command+O',
        click() {
          if (!mainWindow) {
            launchApp();
          }
          dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, (filePaths) => {
            if (mainWindow && filePaths) {
              mainWindow.webContents.send('redux', openFolder(filePaths[0]));
            }
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'Command+S',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', saveFile());
          }
        }
      }, {
        label: 'Save As...',
        accelerator: 'Shift+Command+S',
        click() {
          dialog.showSaveDialog(mainWindow, {}, (filename) => {
            if (mainWindow) {
              mainWindow.webContents.send('redux', saveAsFile(filename));
            }
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'Command+W',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', closeFile());
          }
        }
      }, {
        label: 'Close Window',
        accelerator: 'Shift+Command+W',
        click() {
          if (mainWindow) {
            mainWindow.close();
          }
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        role: 'pasteandmatchstyle'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        role: 'selectall'
      }, {
        type: 'separator'
      }, {
        label: 'Find and Replace',
        accelerator: 'Command+F',
        click() {
          if (dialogWindow) {
            dialogWindow.show();
            dialogWindow.webContents.send('focus');
          }
        }
      }, {
        type: 'separator'
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Command+R',
        click() {
          if (mainWindow) {
            mainWindow.webContents.reload();
          }
        }
      }, {
        label: 'Toggle File Panel',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleSidebar());
          }
        }
      }, {
        label: 'Toggle Preview',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', togglePane());
          }
        }
      }, {
        label: 'Toggle Character Count',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleCount());
          }
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          if (mainWindow) {
            mainWindow.toggleDevTools();
          }
        }
      }, {
        type: 'separator'
      }, {
        label: 'Increase Font Size',
        accelerator: 'Command+Plus',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', increaseFontSize());
          }
        }
      }, {
        label: 'Decrease Font Size',
        accelerator: 'Command+-',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', decreaseFontSize());
          }
        }
      }, {
        label: 'Default Font Size',
        accelerator: 'Command+0',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', resetFontSize());
          }
        }
      }] : [{
        label: 'Toggle File Panel',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleSidebar());
          }
        }
      }, {
        label: 'Toggle Preview',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', togglePane());
          }
        }
      }, {
        label: 'Toggle Character Count',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleCount());
          }
        }
      }, {
        type: 'separator'
      }, {
        label: 'Increase Font Size',
        accelerator: 'Command+Plus',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', increaseFontSize());
          }
        }
      }, {
        label: 'Decrease Font Size',
        accelerator: 'Command+-',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', decreaseFontSize());
          }
        }
      }, {
        label: 'Default Font Size',
        accelerator: 'Command+0',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', resetFontSize());
          }
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Zoom',
        accelerator: 'Shift+Command+F',
        click() {
          if (mainWindow) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      }, {
        label: 'Minimize',
        accelerator: 'Command+M',
        role: 'minimize'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        role: 'front'
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'View on Github',
        click() {
          shell.openExternal('https://github.com/livio/docdown-editor');
        }
      }]
    }];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [{
      label: 'File',
      submenu: [{
        label: 'New File',
        accelerator: 'Ctrl+N',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', newFile());
          }
        }
      }, {
        label: 'Open',
        accelerator: 'Ctrl+O',
        click() {
          dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, (filePaths) => {
            if (mainWindow) {
              mainWindow.webContents.send('redux', openFolder(filePaths[0]));
            }
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'Ctrl+S',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', saveFile());
          }
        }
      }, {
        label: 'Save As',
        accelerator: 'Shift+Ctrl+S',
        click() {
          dialog.showSaveDialog(mainWindow, {}, (filename) => {
            if (mainWindow) {
              mainWindow.webContents.send('redux', saveAsFile(filename));
            }
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'Ctrl+W',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', closeFile());
          }
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Ctrl+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Ctrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Ctrl+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'Ctrl+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'Ctrl+V',
        role: 'pasteandmatchstyle'
      }, {
        label: 'Select All',
        accelerator: 'Ctrl+A',
        role: 'selectall'
      }, {
        type: 'separator'
      }, {
        label: 'Find and Replace',
        accelerator: 'Ctrl+F',
        click() {
          if (dialogWindow) {
            dialogWindow.show();
            dialogWindow.webContents.send('focus');
          }
        }
      }]
    }, {
      label: 'View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: 'Reload',
        accelerator: 'Ctrl+R',
        click() {
          if (mainWindow) {
            mainWindow.webContents.reload();
          }
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: 'F11',
        click() {
          if (mainWindow) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          if (mainWindow) {
            mainWindow.toggleDevTools();
          }
        }
      }, {
        type: 'separator'
      }, {
        label: 'Increase Font Size',
        accelerator: 'Ctrl+Plus',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', increaseFontSize());
          }
        }
      }, {
        label: 'Decrease Font Size',
        accelerator: 'Ctrl+-',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', decreaseFontSize());
          }
        }
      }, {
        label: 'Default Font Size',
        accelerator: 'Ctrl+0',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', resetFontSize());
          }
        }
      }] : [{
        label: 'Zoom',
        accelerator: 'F11',
        click() {
          if (mainWindow) {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        }
      }, {
        label: 'Toggle File Panel',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleSidebar());
          }
        }
      }, {
        label: 'Toggle Preview',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', togglePane());
          }
        }
      }, {
        label: 'Toggle Character Count',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', toggleCount());
          }
        }
      }, {
        type: 'separator'
      }, {
        label: 'Increase Font Size',
        accelerator: 'Ctrl+Plus',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', increaseFontSize());
          }
        }
      }, {
        label: 'Decrease Font Size',
        accelerator: 'Ctrl+-',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', decreaseFontSize());
          }
        }
      }, {
        label: 'Default Font Size',
        accelerator: 'Ctrl+0',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('redux', resetFontSize());
          }
        }
      }]
    }, {
      label: 'Help',
      submenu: [{
        label: 'View on Github',
        click() {
          shell.openExternal('https://github.com/livio/docdown-editor');
        }
      }]
    }];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
};

app.on('ready', launchApp);
app.on('activate', (e, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    launchApp();
  }
});
