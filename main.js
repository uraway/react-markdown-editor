'use strict';

import app from 'app';
import BrowserWindow from 'browser-window';
import crashReporter from 'crash-reporter';
import Menu from 'menu';
import dialog from 'dialog';
import path from 'path';
import fs from 'fs';
const ipcRenderer = require('electron').ipcRenderer;
import ipc from 'ipc';

let mainWindow = null;

if (process.env.NODE_ENV === 'develop') {
  crashReporter.start();

  //appMenu.append(devMenu);
}

function getFileContent(file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    mainWindow.send('fileContent', data);
  });
}

let template = [
      {
        label: 'RMD',
        submenu: [
          {
            label: 'About RMD',
            selector: 'orderFrontStandardAboutPanel:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'CommandOrControl+Q',
            click: function() {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Open',
            accelerator: 'CommandOrControl+O',
            click: () => {
              dialog.showOpenDialog({
                title: 'Pick a markdown file to open',
                properties: ['openFile'],
                filters: [{ name: 'Markdown', extensions: ['md'] }],
              }, fileName => {
                if (fileName) {
                  getFileContent(fileName[0]);
                }
              });
            },
          },
          {
            label: 'Save',
            accelerator: 'CommandOrControl+S',
            click: () => {
              dialog.showSaveDialog({
                title: 'Save markdown file',
                filters: [{ name: 'Markdown', extensions: ['md'] }],
              }, fileName => {
                mainWindow.send('saveFile');
                ipc.on('contentToSave', function(event, content) {
                  fs.writeFile(fileName, content, function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  });
                });
              });
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CommandOrControl+Z',
            selector: 'undo:',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CommandOrControl+Z',
            selector: 'redo:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CommandOrControl+X',
            selector: 'cut:',
          },
          {
            label: 'Copy',
            accelerator: 'CommandOrControl+C',
            selector: 'copy:',
          },
          {
            label: 'Paste',
            accelerator: 'CommandOrControl+V',
            selector: 'paste:',
          },
          {
            label: 'Select All',
            accelerator: 'CommandOrControl+A',
            selector: 'selectAll:',
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CommandOrControl+R',
            click: function() {
              BrowserWindow.getFocusedWindow().reloadIgnoringCache();
            }
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Command+Alt+I',
            click: function() {
              BrowserWindow.getFocusedWindow().toggleDevTools();
            }
          }
        ]
      },
      {
        label: 'Help',
      },
    ];

let menu = Menu.buildFromTemplate(template);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  //Menu.setApplicationMenu(appMenu);
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
  });
  Menu.setApplicationMenu(menu);
  mainWindow.loadURL('file://' + __dirname + '/index.html');
});
