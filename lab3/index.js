let lastRecord = 0;

// for loading tasks from the db
function pullMore() {
	let xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			document.getElementById("Note").innerHTML += xmlhttp.responseText;
		}
	};
	xmlhttp.open("GET", `queryNote.php?lastRecord=${lastRecord}`, true);
	xmlhttp.send();
	lastRecord += 3;
};

// toggle yes - no
function changeState(elem) {
	const oldValue = elem.innerHTML;
	const noteID = elem.parentNode.getAttribute('id');
	const xmlhttp = new XMLHttpRequest();
	let newValue;
	if(oldValue==='Y') {
		newValue='N';
	} else {
		newValue='Y';
	}
	console.log(newValue);
	// ajax code
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			elem.innerHTML = newValue;
		}
	};
	xmlhttp.open("GET", `updateNoteState.php?id=${noteID}&newValue=${newValue}`);
	xmlhttp.send();
};
