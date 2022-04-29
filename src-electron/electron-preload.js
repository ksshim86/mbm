/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { contextBridge, ipcRenderer } from 'electron'
import { BrowserWindow } from '@electron/remote'


contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },
  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },
  close () {
    BrowserWindow.getFocusedWindow().close()
  },
  sendMonitoringProps (args) {
    ipcRenderer.invoke('sendMonitoringProps', args)
  },
  getMonitoringProps () {
    return ipcRenderer.invoke('getMonitoringProps')
  },
  toggleControl (args) {
    ipcRenderer.invoke('toggleControl', args)
  },
  controlEditModeOn (args) {
    ipcRenderer.invoke('controlEditModeOn', args)
  },
  controlSelectUrlOn (args) {
    ipcRenderer.invoke('controlSelectUrlOn', args)
  },
  closeChild () {
    ipcRenderer.invoke('closeChild')
  },
  setSlideIndex (args) {
    ipcRenderer.invoke('setSlideIndex', args)
  },
  commandZoomIn (args) {
    ipcRenderer.invoke('commandZoomIn', args)
  },
  commandZoomOut (args) {
    ipcRenderer.invoke('commandZoomOut', args)
  },
  commandGoMain () {
    ipcRenderer.invoke('commandGoMain')
  },

  receive: (channel, func) => {
    let validChannels = ['back', 'controlEditModeOn', 'controlSelectUrlOn',
      'controlWindowClose', 'getSlideIndex', 'zoomIn', 'zoomOut', 'goMain']
    if (validChannels.filter(valid => channel.indexOf(valid) > -1)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})