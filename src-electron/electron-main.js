import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { initialize, enable } from '@electron/remote/main'
import path from 'path'
import os from 'os'
import Dao from './dao'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

initialize()

let mainWindow
let sqliteDao

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 750,
    minWidth: 1000,
    minHeight: 750,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      webviewTag: true,
      nativeWindowOpen: false,
    },
    autoHideMenuBar: true,
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'allow' }
  })

  mainWindow.webContents.on('did-create-window', (childWindow) => {
    childWindow.webContents.on('will-navigate', (e) => {
      e.preventDefault()
    })
  })

  enable(mainWindow.webContents)

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  sqliteDao = new Dao()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

let childWindow = null

function createChildWindow () {
  childWindow = new BrowserWindow({
    parent: mainWindow,
    show: false,
    width: 350,
    height: 500,
    minWidth: 350,
    minHeight: 500,
    maxWidth: 350,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      webviewTag: true,
      nativeWindowOpen: false,
    },
    autoHideMenuBar: true,
  })

  const childUrl = process.env.DEBUGGING
    ? `${process.env.APP_URL}#/control`
    : `file://${__dirname}/index.html#/control`

  childWindow.loadURL(childUrl)

  childWindow.on('closed', () => {
    childWindow = null
  })

  if (process.env.DEBUGGING) {
    childWindow.webContents.openDevTools()
  } else {
    childWindow.webContents.on('devtools-opened', () => {
      childWindow.webContents.closeDevTools()
    })
  }
}

ipcMain.handle('closeChild', () => {
  childWindow.close()
  mainWindow.webContents.send('controlWindowClose')
})

let monitoringProps = {}

ipcMain.handle('sendMonitoringProps', (event, args) => {
  monitoringProps = JSON.parse(JSON.stringify(args))
})

ipcMain.handle('toggleControl', (event, args) => {
  if (args) {
    // console.log('getPosition :' + mainWindow.getPosition())
    createChildWindow()
    childWindow.show()
  } else {
    if (childWindow != null) {
      childWindow.close()
    }
  }
})

ipcMain.handle('getMonitoringProps', () => {
  return monitoringProps
})

ipcMain.handle('controlEditModeOn', () => {
  mainWindow.webContents.send('controlEditModeOn')
})

ipcMain.handle('controlSelectUrlOn', (event, args) => {
  mainWindow.webContents.send(`controlSelectUrlOn-${args}`)
})

ipcMain.handle('setSlideIndex', (event, args) => {
  mainWindow.webContents.send('getSlideIndex', args)
})

ipcMain.handle('commandZoomIn', (event, args) => {
  mainWindow.webContents.send(`zoomIn-${args}`)
})

ipcMain.handle('commandZoomOut', (event, args) => {
  mainWindow.webContents.send(`zoomOut-${args}`)
})

ipcMain.handle('commandGoMain', () => {
  if (childWindow != null) {
    childWindow.close()
  }

  mainWindow.webContents.send('goMain')
})

ipcMain.handle('selectBookmarks', async () => {
  const obj = {
    result: true,
    message: '',
    rows: {},
  }
  const sql = `SELECT * FROM bookmark WHERE del_yn = 'N'`
  
  try {
    const res = await sqliteDao.all(sql)
    obj.rows = res.rows
  } catch (error) {
    obj.result = false
    obj.message = error.message
  }

  return obj
})

ipcMain.handle('updateBookmark', async (event, args) => {
  const obj = {
    result: true,
    message: '',
    rows: {},
  }
  const sql = `UPDATE bookmark SET name = ?, url = ? WHERE id = ?`
  
  try {
    const bookmark = JSON.parse(JSON.stringify(args))
    const params = [bookmark.name, bookmark.url, bookmark.id]

    const res = await sqliteDao.run(sql, params)

    obj.result = res.result
  } catch (error) {
    obj.result = false
    obj.message = error.message
  }

  return obj
})