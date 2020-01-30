'use-strict'
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const fs = require("fs");

app.on("ready", () => {
	let main = new BrowserWindow({
		show: false,
		frame: false,
		width: 400,
		height: 300,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true,
		},
    });
    
	main.webContents.once("dom-ready", () => {
		main.webContents.openDevTools();
	});
	main.loadFile("./index.html");
	main.show();
});