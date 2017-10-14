let lastCount = 0;
let firstCount = 0;
let action = "init";
let currentActive;
let currPageCount = 1;
let pageCount;

// check if last page - for pagination
function checkNext() {
    if (pageCount == 0) {
        pageCount++;
    }
    console.log(`the pageciel is ${pageCount}`);
    if (currPageCount == pageCount) {
        $('#right')[0].disabled = true;
    } else if (currPageCount > pageCount) {
        setAction('left');
        getInitData();
    } else {
        $('#right')[0].disabled = false;
    }
}

// set the action variable
function setAction(pageAction) {
    action = pageAction
    console.log(action);
}

// get an array of IDs of all the selected checkboxes
function getSelected() {
    let select = [];
    $(':checkbox:checked').each(function(i) {
        select[i] = $(this).closest('tr').attr('id');
        console.log(`the thing is : ${select[i]}`);
    });
    return select;
};

// update mailbox for all selected emails
function updateMailbox(updatedMailbox) {
    const selectedCheckboxes = JSON.stringify(getSelected());
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            getInitData();
            console.log(xmlhttp.responseText);
        }
    }
    xmlhttp.open('GET', `handleMailboxChange.php?selectedCheckboxes=${selectedCheckboxes}&updatedMailbox=${updatedMailbox}`, true);
    xmlhttp.send();
};

// setActive function -- set the active sidebar tab and add email html
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
};

// set Move to Button -- also enabling the next and prev buttons
function setMoveToButton() {
    currentActive = $('.active')[0].innerHTML.replace(/\s/g,'');
    if (currentActive === "Inbox") {
        // setting html for the function buttons when inbox is active
        $('#move')[0].innerHTML = "<button onclick='updateMailbox(`Important`)' id='move-to-imp' class='btn-sm btn-primary'>Move to Important</button>";
        $('#delete')[0].innerHTML = "<button onclick='updateMailbox(`Trash`)' id='move-to-del' class='btn-sm btn-danger'>Delete</button>"
    } else if (currentActive === "Important") {  
        // setting html for the function buttons when important is active
        $('#move')[0].innerHTML = "<button onclick='updateMailbox(`Inbox`)' id='move-to-inbox' class='btn-sm btn-primary'>Move to Inbox</button>";
        $('#delete')[0].innerHTML = "<button onclick='updateMailbox(`Trash`)' id='move-to-del' class='btn-sm btn-danger'>Delete</button>"
    } else if (currentActive === "Trash") {
        // setting html for the function buttons when trash is active
        $('#move')[0].innerHTML = "<button onclick='updateMailbox(`Inbox`)' id='move-to-inbox' class='btn-sm btn-primary'>Move to Inbox</button><button id='move-to-imp' onclick='updateMailbox(`Important`)' class='btn-sm btn-primary'>Move to Important</button>";
        $('#delete')[0].innerHTML = "<button onclick='updateMailbox(`rm`)' id='del-forever' class='btn-sm btn-danger'>Delete Forever</button>";
    }
};

// get data from the db
function getInitData() {
    if (action==="init") {
        firstCount = 0;
        lastCount += 5;
        
        console.log(`prev values of firstCount and lastCount are ${firstCount} and ${lastCount}. The current page count is ${currPageCount} and page ciel is ${pageCount}`);
    } else if (action==="right") {
        firstCount += 5;
        lastCount = firstCount + 5;
        currPageCount++;
        console.log(`prev values of firstCount and lastCount are ${firstCount} and ${lastCount}. The current page count is ${currPageCount}`);
    } else if (action==="left") {
        if (firstCount-5 <= 0) {
            firstCount = 0;
            lastCount = 5;
            currPageCount = 1;
        } else {
            firstCount -= 5;
            lastCount = firstCount + 5;
            currPageCount--;
        }
        console.log(`prev values of firstCount and lastCount are ${firstCount} and ${lastCount}. The current page count is ${currPageCount}`);
    }
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            pageCount = xmlhttp.responseText.substr(xmlhttp.responseText.length-1, xmlhttp.responseText.length);
            document.getElementsByTagName('tbody')[0].innerHTML = xmlhttp.responseText.substr(0, xmlhttp.responseText.length-1);
            checkNext();
        }
    };
    xmlhttp.open('GET', `handleEmailDisplay.php?action=${action}&lastCount=${lastCount}&firstCount=${firstCount}&mailbox=${$(".active")[0].innerHTML}`, true);
    xmlhttp.send();
};

// display the email's content
function displayEmailContent(elem) {
    const elemID = $(elem).parent()[0].id;
    console.log(elemID);
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (currentActive == 'Inbox') {
                if ($('#move-to-imp')) $('#move-to-imp')[0].disabled = true;
                if ($('#move-to-del')) $('#move-to-del')[0].disabled = true;
                if ($('#right')) $('#right')[0].disabled = true;
                if ($('#left')) $('#left')[0].disabled = true;
            } else if (currentActive == 'Important') {
                if ($('#move-to-imp')) $('#move-to-imp')[0].disabled = true;
                if ($('#move-to-del')) $('#move-to-del')[0].disabled = true;
                if ($('#right')) $('#right')[0].disabled = true;
                if ($('#left')) $('#left')[0].disabled = true;
            } else if (currentActive == 'Trash') {
                if ($('#move-to-imp')) $('#move-to-imp')[0].disabled = true;
                if ($('#move-to-del')) $('#move-to-del')[0].disabled = true;
                if ($('#right')) $('#right')[0].disabled = true;
                if ($('#left')) $('#left')[0].disabled = true;
            }
            document.getElementById('email-list').innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open('GET', `handleContentRequest.php?elemID=${elemID}`, true);
    xmlhttp.send();
};