const { ipcRenderer } = require("electron");
const remote = require("electron").remote;
const { fs } = require("fs");

// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == "complete") {
		handleWindowControls();
	}
};

function handleWindowControls() {
	let win = remote.getCurrentWindow();
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById("min-button").addEventListener("click", event => {
		win.minimize();
	});

	document.getElementById("max-button").addEventListener("click", event => {
		win.maximize();
	});

	document.getElementById("restore-button").addEventListener("click", event => {
		win.unmaximize();
	});

	document.getElementById("close-button").addEventListener("click", event => {
		win.close();
	});

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();

	win.on("maximize", toggleMaxRestoreButtons);
	win.on("unmaximize", toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add("maximized");
		} else {
			document.body.classList.remove("maximized");
		}
	}
}

ipcRenderer.on("init", (event, arg) => {
	
	// Hide loading
	
	
});

function load() {
    timeOut = setTimeout(showContent, 3000);
}

function showContent() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("taskList").style.display = "inline-block";
}

function createTask() {
    
}