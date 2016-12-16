import { app, BrowserWindow, Menu, shell, dialog, ipcMain } from 'electron';
import { newFile, openFolder, saveFile, saveAsFile, closeFile, discardFile } from './app/actions/files';
import { findText, replaceText, replaceAllText } from './app/actions/text';
import { toggleSidebar, togglePane, toggleCount } from './app/actions/ui';

let menu;
let template;
let mainWindow = null;
let dialogWindow = null;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
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

  mainWindow.loadURL(`file://${__dirname}/app/app.html`);

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

  ipcMain.on('save-as', (e, id) => {
    dialog.showSaveDialog(mainWindow, {}, (filename) => {
      mainWindow.webContents.send('redux', saveAsFile(id, filename));
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
            mainWindow.webContents.send('redux', saveAsFile(id, filename));
            mainWindow.webContents.send('redux', closeFile(id));
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
        selector: 'orderFrontStandardAboutPanel:'
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
        selector: 'hide:'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      }, {
        label: 'Show All',
        selector: 'unhideAllApplications:'
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
        selector: 'new:',
        click() {
          mainWindow.webContents.send('redux', newFile());
        }
      }, {
        label: 'Open',
        accelerator: 'Command+O',
        selector: 'open:',
        click() {
          dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, (filePaths) => {
            mainWindow.webContents.send('redux', openFolder(filePaths[0]));
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'Command+S',
        selector: 'save:',
        click() {
          mainWindow.webContents.send('redux', saveFile());
        }
      }, {
        label: 'Save As...',
        accelerator: 'Shift+Command+S',
        click() {
          dialog.showSaveDialog(mainWindow, {}, (filename) => {
            mainWindow.webContents.send('redux', saveAsFile(filename));
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'Command+W',
        selector: 'performClose:',
        click() {
          mainWindow.webContents.send('redux', closeFile());
        }
      }, {
        label: 'Close Window',
        accelerator: 'Shift+Command+W',
        click() {
          mainWindow.close();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      }, {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }, {
        type: 'separator'
      }, {
        label: 'Find and Replace',
        accelerator: 'Command+F',
        click() {
          dialogWindow = new BrowserWindow({
            parent: mainWindow,
            show: false,
            resizable: false,
            width: 400,
            height: 172
          });
          dialogWindow.loadURL(`file://${__dirname}/app/replacer.html`);
          dialogWindow.on('closed', () => {
            dialogWindow = null;
          });

          if (process.env.NODE_ENV === 'development') {
            dialogWindow.openDevTools();
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

          dialogWindow.once('ready-to-show', () => {
            dialogWindow.show();
          });
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
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle File Panel',
        click() {
          mainWindow.webContents.send('redux', toggleSidebar());
        }
      }, {
        label: 'Toggle Preview',
        click() {
          mainWindow.webContents.send('redux', togglePane());
        }
      }, {
        label: 'Toggle Character Count',
        click() {
          mainWindow.webContents.send('redux', toggleCount());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: 'Toggle File Panel',
        click() {
          mainWindow.webContents.send('redux', toggleSidebar());
        }
      }, {
        label: 'Toggle Preview',
        click() {
          mainWindow.webContents.send('redux', togglePane());
        }
      }, {
        label: 'Toggle Character Count',
        click() {
          mainWindow.webContents.send('redux', toggleCount());
        }
      }]
    }, {
      label: 'Window',
      submenu: [{
        label: 'Zoom',
        accelerator: 'Shift+Command+F',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      }, {
        type: 'separator'
      }, {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
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
      label: '&File',
      submenu: [{
        label: '&New File',
        accelerator: 'Ctrl+N',
        selector: 'new:',
        click() {
          mainWindow.webContents.send('redux', newFile());
        }
      }, {
        label: '&Open',
        accelerator: 'Ctrl+O',
        selector: 'open:',
        click() {
          dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, (filePaths) => {
            mainWindow.webContents.send('redux', openFolder(filePaths[0]));
          });
        }
      }, {
        type: 'separator'
      }, {
        label: '&Save',
        accelerator: 'Ctrl+S',
        selector: 'save:',
        click() {
          mainWindow.webContents.send('redux', saveFile());
        }
      }, {
        label: '&Save As',
        accelerator: 'Shift+Ctrl+S',
        click() {
          dialog.showSaveDialog(mainWindow, {}, (filename) => {
            mainWindow.webContents.send('redux', saveAsFile(filename));
          });
        }
      }, {
        type: 'separator'
      }, {
        label: '&Close Tab',
        accelerator: 'Ctrl+W',
        selector: 'performClose:',
        click() {
          mainWindow.webContents.send('redux', closeFile());
        }
      }]
    }, {
      label: '&View',
      submenu: (process.env.NODE_ENV === 'development') ? [{
        label: '&Reload',
        accelerator: 'Ctrl+R',
        click() {
          mainWindow.webContents.reload();
        }
      }, {
        label: 'Toggle &Full Screen',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &Developer Tools',
        accelerator: 'Alt+Ctrl+I',
        click() {
          mainWindow.toggleDevTools();
        }
      }] : [{
        label: '&Zoom',
        accelerator: 'F11',
        click() {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
      }, {
        label: 'Toggle &File Panel',
        click() {
          mainWindow.webContents.send('redux', toggleSidebar());
        }
      }, {
        label: 'Toggle &Preview',
        click() {
          mainWindow.webContents.send('redux', togglePane());
        }
      }, {
        label: 'Toggle &Character Count',
        click() {
          mainWindow.webContents.send('redux', toggleCount());
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
