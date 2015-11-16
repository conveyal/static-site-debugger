var app = require('app')
var BrowserWindow = require('browser-window')

console.log('running')

var mainWindow

app.on('window-all-closed', function () { app.quit() })

app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 1024, height: 700})
  mainWindow.loadUrl(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => mainWindow = null)
  mainWindow.openDevTools() 
})
