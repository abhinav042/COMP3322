let lastRecord = 0;
function pullMore() {
	let xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			document.getElementById("note").innerHTML = xmlhttp.responseText;
			xmlhttp.open("GET", `queryNote.php?lastRecord=${lastRecord}`, true);
			xmlhttp.send();
		}
	}
	lastRecord += 3;
}
// const span = document.getElementById()
// function changeState(elem) {
// 	const oldValue = elem.innerHTML;
// 	const noteID = elem.parentNode.getAttribute('id');
// 	const xmlhttp = new XMLHttpRequest();
// 	if(oldValue==='Y') {
// 		newValue==='N';
// 	} else {
// 		newValue==='Y';
// 	}
// 	// ajax code
// 	xmlhttp.onreadystatechange = function() {
// 		if(this.readyState === 4 && this.status === 200) {

// 		}
// 	}
// }
