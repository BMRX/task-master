const { ipcRenderer } = require("electron");
const remote = require("electron").remote;
const { fs } = require("fs");

let tasks = {},
	quotes;

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

	document.getElementById("restore-button")
		.addEventListener("click", event => {
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

ipcRenderer.on("init", (event, tArg) => {
	tasks = tArg;
	//setRandQuote();
	populateLists();
	//testObjects(100000);
	console.log(tasks);
	scrollNextMessage();
});

let taskDetail = document.getElementById("task-detail"), taskHeader = document.getElementById("task-header"), taskDetails = document.getElementById("task-details")
	taskAuthor = document.getElementById("task-author"), taskDate = document.getElementById("task-date");

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
	document.getElementById("open").innerHTML = "";
	for(var i = 0; i < tasks.open.length; i++) {
		let open = document.getElementById("open");
		let closed = document.getElementById("closed");
		let task = document.createElement("div");
		task.setAttribute("id", i);
		task.setAttribute("onclick", `lookupTask("open", ${i})`);
		task.setAttribute("class", "task");
		let left = document.createElement("div");
		left.setAttribute("class", "left");
		let right = document.createElement("div");
		right.setAttribute("class", "right");
		let title = document.createElement("p");
		let date = document.createElement("p");

		title.innerText = tasks.open[i].title;
		left.appendChild(title);
		task.appendChild(left);
		date.innerText = tasks.open[i].date;
		right.appendChild(date);
		task.appendChild(right);
		open.appendChild(task);
	}
		
}

function lookupTask(taskType, id) {
	let activeBtn;
	taskHeader.innerHTML = "";
	taskAuthor.innerHTML = "";
	taskDate.innerHTML = "";
	taskDetails.innerHTML = "";

	if(taskType == "open") {
		console.log("TASKTYPE");
		taskHeader.innerHTML = tasks.open[id].title;
		taskAuthor.innerHTML = tasks.open[id].author;
		taskDate.innerHTML = tasks.open[id].date;
		taskDetails.innerHTML = tasks.open[id].details;
		activeBtn = document.getElementsByClassName("defaultOpen");
		activeBtn[0].className = activeBtn[0].className.replace(" active", "");
		document.getElementById(taskType).style.display = "none";
		taskDetail.style.display = "block";
	}
	if(taskType == "closed") {
		taskHeader.innerHTML = tasks.open[id].title;
		taskAuthor.innerHTML = tasks.open[id].author;
		taskDate.innerHTML = tasks.open[id].date;
		taskDetails.innerHTML = tasks.open[id].details;
		document.getElementById(taskType).style.display = "none";
		taskDetail.style.display = "block";
	}
}

function closeTaskDetail() {
	// This is a hack, I'm lazy
	taskDetail.style.display = "none";
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
	closeTaskDetail();
	if(taskDetail.style.display == "block") {
		console.log("hi");
		// closeTaskDetail();
	}
	
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
	obj.author = document.querySelectorAll('[name="author"]')[0].value;
	obj.details = document.querySelectorAll('[name="details"]')[0].value;
	obj.date = setDate();
	tasks.open.push(obj);
	console.log(tasks);
	populateLists();
	document.getElementById("task-form").reset();
	document.getElementsByClassName("defaultOpen")[0].click();
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
		tasks.open.push({ open: i });
		tasks.closed.push({ closed: i });
	}
}

/* News ticker */
var newsArray;
function updateNewsArray() {
	newsArray = [
		["Something need doing?", true, "a1"],
		["Work, Work...", true, "a2"],
		["I can do that", true, "a3"],
		["Be happy to.", true, "a4"],
		["Okie dokie.", true, "a5"],
		["No time for play.", true, "a6"],
		["What you want?", true, "a7"],
		["Lok-regar no'gul.", true, "a8"],
		["I find your lack of faith disturbing.", true, "a9"],
		["Never tell me the odds!", true, "a10"],
		[
			"I've been waiting for you, Employee. We meet again, at last. The circle is now complete. When I left you, I was but the learner; now I am the master.",
			true,
			"a11",
		],
		["Pubes.", true, "a12"],
		[
			"We all make choices in life, but in the end our choices make us.",
			true,
			"a13",
		],
		["It's dangerous to go alone, take this!", true, "a14"],
		["Stay awhile, and listen!", true, "a15"],
		["Wake me when you need me.", true, "a16"],
		["Every puzzle has an answer.", true, "a17"],
		[
			"I used to be an adventurer like you, until I took an arrow to the knee.",
			true,
			"a18",
		],
		["It’s super effective!", true, "a19"],
		["Praise the sun!", true, "a20"],
		["When God gives you lemons, you find a new God.", true, "a21"],
		[
			"What's that? You want strawberry? Well how about Rawberry? Made with lightning, real lightning.",
			true,
			"a22",
		],
		[
			"It's an energy drink for men. Menergy. These aren't your dad's puns, these are energy puns. Turbopuns.",
			true,
			"a23",
		],
		[
			"Science, energy, science, energy, electrolyes, turbolytes, powerlytes, more lights than your body has room for. You'll be so fast, mother nature will be like, 'Sloooooowwww dooowwwwnn'.",
			true,
			"a23",
		],
		[
			"Power running, power lifting, power sweeping, power dating, power eating, power laughing, power spawning babies. You'll have so many babies. 400 babies.",
			true,
			"a24",
		],
	];
}

var s = document.getElementById("msg");
document.addEventListener(
	"visibilitychange",
	function() {
		if (!document.hidden) {
			scrollNextMessage();
		}
	},
	false,
);
var scrollTimeouts = [];
var nextMsgIndex;
function scrollNextMessage() {
	updateNewsArray();
	//select a message at random

	try {
		do {
			nextMsgIndex = Math.floor(Math.random() * newsArray.length);
		} while (!eval(newsArray[nextMsgIndex][1]));
	} catch (e) {
		console.log("Newsarray doesn't work at idx " + nextMsgIndex);
	}

	scrollTimeouts.forEach(function(v) {
		clearTimeout(v);
	});
	scrollTimeouts = [];

	//set the text
	s.textContent = newsArray[nextMsgIndex][0].toString();

	//get the parent width so we can start the message beyond it
	let parentWidth = s.parentElement.clientWidth;

	//set the transition to blank so the move happens immediately
	s.style.transition = "";
	//move div_text to the right, beyond the edge of the div_container
	s.style.transform = "translateX(" + parentWidth + "px)";

	//we need to use a setTimeout here to allow the browser time to move the div_text before we start the scrolling
	scrollTimeouts.push(
		setTimeout(function() {
			//distance to travel is s.parentElement.clientWidth + s.clientWidth + parent padding
			//we want to travel at rate pixels per second so we need to travel for (distance / rate) seconds
			let dist = s.parentElement.clientWidth + s.clientWidth + 20; //20 is div_container padding
			let rate = 100; //change this value to change the scroll speed
			let transformDuration = dist / rate;

			//set the transition duration
			s.style.transition = "transform " + transformDuration + "s linear";
			let textWidth = s.clientWidth;
			//we need to move it to -(width+parent padding) before it won't be visible
			s.style.transform = "translateX(-" + (textWidth + 5) + "px)";
			//automatically start the next message scrolling after this one finishes
			//you could add more time to this timeout if you wanted to have some time between messages
			scrollTimeouts.push(
				setTimeout(
					scrollNextMessage,
					Math.ceil(transformDuration * 1000),
				),
			);
		}, 100),
	);
}
