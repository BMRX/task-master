'use-strict'
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const fs = require("fs");

let tasks = { open: [], closed: [] };

try {
	tasks = JSON.parse(fs.readFileSync("./tasklist.json", { encoding: "utf8" }));
} catch (e) {
	console.log(e);
	tasks = { open: [], closed: [] };
}


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
		main.webContents.send("init", tasks, quotes);
		main.webContents.openDevTools();
	});
	main.loadFile("./index.html");
	main.show();
});

let quotes = JSON.parse(fs.readFileSync("./quotes.json", { encoding: "utf8" }));

ipcMain.on("sync-and-close", (event, arg) => {
	tasks.open = [];
	tasks.closed = [];

	if (arg.open.length > 0 || arg.closed.length > 0) {
		arg.open.forEach(element => {
			tasks.open.push(element);
		});
		arg.closed.forEach(element => {
			tasks.closed.push(element);
		});
		saveData();
	}

	win = null;
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function saveData() {
	fs.writeFile("./tasklist.json", JSON.stringify(tasks), "utf8", function (err, result) {
		if (err) console.log('error', err);
	});
}