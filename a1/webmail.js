let lastCount = 0;
let firstCount = 0;
let action = "init";

// move to trash-important-inbox



// set the action variable
function setAction(pageAction) {
    action = pageAction
    console.log(action);
}

// setActive function -- set button as active and add email html
function setActive(elem) {
    $('.active').removeClass('active');
    $(elem).addClass('active');
    document.getElementById('email-list').innerHTML = 
    `
    <table class="table">
        <thead>
        <tr>
            <th>Select</th>
            <th>Sender</th>
            <th>Title</th>
            <th>Date</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>
    `;
}

// set Move to Button
function setMoveToButton() {
    const currentActive = $('.active')[0].innerHTML.replace(/\s/g,'');
    if (currentActive === "Inbox") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Important</button>";
        $('#delete')[0].innerHTML = "<button class='btn-sm btn-danger'>Delete</button>"
    } else if (currentActive === "Important") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Inbox</button>";
        $('#delete')[0].innerHTML = "<button class='btn-sm btn-danger'>Delete</button>"
    } else if (currentActive === "Trash") {
        $('#move')[0].innerHTML = "<button class='btn-sm btn-primary'>Move to Inbox</button><button class='btn-sm btn-primary'>Move to Important</button>";
        $('#delete')[0].innerHTML = "<button class='btn-sm btn-danger'>Delete Forever</button>";
    }
}

// get data from the db
function getInitData() {
    if (action==="init") {
        firstCount = 0;
        lastCount += 5;
        console.log(`init values of firstCount and lastCount are ${firstCount} and ${lastCount}`);
    } else if (action==="right") {
        firstCount += 5;
        lastCount = firstCount + 5;
        console.log(`next values of firstCount and lastCount are ${firstCount} and ${lastCount}`);
    } else if (action==="left") {
        if (firstCount-5 <= 0) {
            firstCount = 0;
            lastCount = 5;
        } else {
            firstCount -= 5;
            lastCount = firstCount + 5;
        }
        console.log(`prev values of firstCount and lastCount are ${firstCount} and ${lastCount}`);
    }
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementsByTagName('tbody')[0].innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open('GET', `handleEmailDisplay.php?action=${action}&lastCount=${lastCount}&firstCount=${firstCount}&mailbox=${$(".active")[0].innerHTML}`, true);
    xmlhttp.send();
};

// display the email's content
function displayEmailContent(elem) {
    const elemID = elem.id;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            $('#delete, #move, #left, #right').addClass('disabled');
            document.getElementById('email-list').innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open('GET', `handleContentRequest.php?elemID=${elemID}`, true);
    xmlhttp.send();
};