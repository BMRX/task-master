const { ipcRenderer } = require("electron");
const remote = require("electron").remote;
const { fs } = require("fs");

let tasks = {}, quotes;

// When document has loaded, initialise
document.onreadystatechange = () => {
	if (document.readyState == "complete") {
		//setTimeout(showContent, 1000);
		showContent();
		// document.querySelector("#loading").style.display = "none";
		// document.querySelector("#task-list").style.display = "block";
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
		syncAndClose();
		//win.close();
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

ipcRenderer.on("init", (event, tArg, qArg) => {
	tasks = tArg;
	quotes = qArg.index;
	setRandQuote();
	populateLists();
	//testObjects(100000);
	console.log(tasks);
});

document.getElementsByClassName("defaultOpen")[0].click();

function setRandQuote() {
	// document.getElementById("loading").innerHTML = "";
	document.getElementById("msg").innerHTML = "";
	var rand = quotes[Math.floor(Math.random() * quotes.length)];
	document.getElementById("msg").innerHTML = rand;
	// document.getElementById("loading").innerHTML = rand;
	setTimeout(setRandQuote, 15000);
}

function showContent() {
	//document.querySelector("#loading").style.display = "none";
	document.querySelector("#task-list").style.display = "block";
}

function populateLists() {
	let open = document.getElementById("open");
	let closed = document.getElementById("closed");
	let task = document.createElement("div");
	task.setAttribute("class", "task");
	let left = document.createElement("div");
	left.setAttribute("class", "left");
	let right = document.createElement("div");
	right.setAttribute("class", "right");
	let title = document.createElement("p");
	let date = document.createElement("p");

	tasks.open.forEach(item => {
		title.innerText = item.title;
		left.appendChild(title);
		task.appendChild(left);
		date.innerText = item.date;
		right.appendChild(date);
		task.appendChild(right);
		open.appendChild(task);
	});
}

function syncAndClose() {
	// getRandQuote();
	// document.querySelector("#loading").style.display = "block";
	// document.querySelector("#task-list").style.display = "none";
	// Send objects to save
	ipcRenderer.send("sync-and-close", tasks);
}

function togglePage(evt, name) {
	var i, pages, btns;

	pages = document.getElementsByClassName("page");
	for (i = 0; i < pages.length; i++) {
		pages[i].style.display = "none";
	}

	btns = document.getElementsByClassName("btn");
	for (i = 0; i < btns.length; i++) {
		btns[i].className = btns[i].className.replace(" active", "");
	}

	document.getElementById(name).style.display = "block";
	evt.currentTarget.className += " active";
}

function addOpen() {
	let obj = {};
	obj.title = document.querySelectorAll('[name="title"]')[0].value;
	obj.group = document.querySelectorAll('[name="group"]')[0].value;
	obj.name = document.querySelectorAll('[name="name"]')[0].value;
	obj.description = document.querySelectorAll('[name="description"]')[0].value;
	obj.date = setDate();
	tasks.open.push(obj);
	console.log(tasks);
	//ipcRenderer.send('INSERT-ITEM', obj);
	document.getElementById("task-form").reset();
}

function formReset() {
	document.getElementById("task-form").reset();
}

function setDate() {
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	newdate = day + "/" + month + "/" + year;
	return newdate;
}
/* Testing */
function testObjects(x) {
	tasks.open = [];
	tasks.closed = [];
	for (let i = 0; i < x; i++) {
		tasks.open.push({ open: i })
		tasks.closed.push({ closed: i })
	}
}