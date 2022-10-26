import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  Tray,
  nativeImage,
  Menu,
  screen,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import ElectronStore from 'electron-store';

ElectronStore.initRenderer();
app.commandLine.appendSwitch('ignore-certificate-errors');
const isDevelopment = process.env.NODE_ENV !== 'production';
let win;
let tray;
let workerWindow;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function initTray() {
  const iconPath =
    process.platform === 'darwin'
      ? path.join(__static, 'images/icon.png')
      : path.join(__static, 'favicon.ico');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);
  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit app',
      click() {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Electron app');
  tray.setContextMenu(menu);
  tray.on('click', () => {
    win.show();
  });
}

async function createWorkerWindow() {
  const display = screen.getPrimaryDisplay();
  const { width } = display.workAreaSize;

  workerWindow = new BrowserWindow({
    width: 320,
    height: 210,
    x: width - 320,
    y: 0,
    transparent: true,
    frame: false,
    backgroundColor: '#FFF',
    resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (workerWindow.setWindowButtonVisibility) {
    workerWindow.setWindowButtonVisibility(false);
  } else {
    workerWindow.setMenuBarVisibility(false);
  }

  workerWindow.hide();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await workerWindow.loadURL(`file://${__dirname}/../public/worker.html`);
  } else {
    createProtocol('app');
    // Load the worker.html when not in development
    workerWindow.loadURL('app://./worker.html');
  }
  workerWindow.on('closed', () => {
    workerWindow = undefined;
  });
}

async function createMainWindow() {
  // Window起動時に環境変数を設定しないといけない
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.setMenuBarVisibility(false);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    await win.loadURL('app://./index.html');
  }

  win.on('close', (event) => {
    if (app.quitting) {
      win = null;
    } else {
      event.preventDefault();
      win.hide();
    }
  });
}

async function createWindow() {
  await createMainWindow();
  await createWorkerWindow();
}

app.on('before-quit', () => {
  app.quitting = true;
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  win.show();
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vue Devtools failed to install:', e.toString());
      }
    }
    initTray();
    createWindow();
  });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on('incoming-call', (_, { caller }) => {
  workerWindow.webContents.send('incoming', caller);
  workerWindow.show();
  workerWindow.focus();
});

ipcMain.on('accept', () => {
  win.webContents.send('answerCall');
  win.show();
  win.focus();
  workerWindow.hide();
});

ipcMain.on('cancel-call', () => {
  workerWindow.hide();
});

ipcMain.on('ignore-call', () => {
  workerWindow.hide();
  win.webContents.send('ignoreCall');
});
