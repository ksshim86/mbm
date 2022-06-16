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
  initFavoriteUrls () {
    ipcRenderer.invoke('initFavoriteUrls')
  },
  setFavoriteUrl (args) {
    ipcRenderer.invoke('setFavoriteUrl', args)
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
  commandRefresh (args) {
    ipcRenderer.invoke('commandRefresh', args)
  },
  commandGoBack (args) {
    ipcRenderer.invoke('commandGoBack', args)
  },
  commandGoForward (args) {
    ipcRenderer.invoke('commandGoForward', args)
  },
  commandGoMain () {
    ipcRenderer.invoke('commandGoMain')
  },
  newWindow (args) {
    ipcRenderer.invoke('newWindow', args)
  },
  async selectBookmarks () {
    return await ipcRenderer.invoke('selectBookmarks')
  },
  async updateBookmark (bookmark) {
    return await ipcRenderer.invoke('updateBookmark', bookmark)
  },
  async insertBookmark (bookmark) {
    return await ipcRenderer.invoke('insertBookmark', bookmark)
  },
  async deleteBookmark (id) {
    return await ipcRenderer.invoke('deleteBookmark', id)
  },
  async selectFavorites () {
    return await ipcRenderer.invoke('selectFavorites')
  },
  async selectFavoriteUrls (id) {
    return await ipcRenderer.invoke('selectFavoriteUrls', id)
  },
  async insertFavorite (favorite) {
    return await ipcRenderer.invoke('insertFavorite', favorite)
  },
  async updateFavorite (favorite) {
    return await ipcRenderer.invoke('updateFavorite', favorite)
  },
  async deleteFavorite (id) {
    return await ipcRenderer.invoke('deleteFavorite', id)
  },

  receive: (channel, func) => {
    let validChannels = ['back', 'controlEditModeOn', 'controlSelectUrlOn',
      'controlWindowClose', 'getSlideIndex', 'zoomIn', 'zoomOut', 'goMain']
    if (validChannels.filter(valid => channel.indexOf(valid) > -1)) {
      ipcRenderer.removeAllListeners(channel)
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})