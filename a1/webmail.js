let lastCount = 0;

// setActive function
function setActive(elem) {
    $('.active').removeClass('active');
    $(elem).addClass('active');
}

// set Move to Button
function setMoveToButton() {
    const currentActive = $('.active')[0].innerHTML.replace(/\s/g,'');
    if (currentActive === "Inbox") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Important</button>";
    } else if (currentActive === "Important") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Inbox</button>";
    } else if (currentActive === "Trash") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Inbox</button><button class='btn-sm btn-primary'>Move to Important</button>";
        $('#delete')[0].innerHTML = "<button class='btn-sm btn-danger'>Delete Forever</button>"
    }
}

// get data from the db
function getInitData() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementsByTagName('tbody')[0].innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open('GET', `handleEmailDisplay.php?lastCount=${lastCount}&mailbox=${$(".active")[0].innerHTML}`, true);
    xmlhttp.send();
    lastCount += 5;
};

// get prev data from the db
function getPrevData() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("email-list").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open('GET', `getData.php?lastCount=${lastCount}&mailbox=${$(".active")[0].innerHTML}`, true);
    xmlhttp.send();
};
