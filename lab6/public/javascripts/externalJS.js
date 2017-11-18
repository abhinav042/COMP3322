// report data array for filling in info box
let reportListData = [];

// DOM READY 
$(document).ready(function() {
    // populate on page load
    populateReportList();
});

$('#btnAddReport').on('click', addOrUpdateReport);

$('#reportList').on('click', 'div button.deleteReport', deleteReport);

/*
*
* Functions
*
*/

function populateReportList() {
    // empty content string
    let listContent = `<div><h4>Company&nbsp&nbsp&nbsp&nbspYear&nbsp&nbsp&nbsp&nbspProfit&nbsp&nbsp&nbsp&nbspDelete?</h4></div><br>`;
    // JQuery call for JSON
    $.getJSON(`/users/annualreports`, function(data) {
        reportListData = data;
        // for each elem in data add a <div> element to the content string
        $.each(data, function() {
            listContent += `<div>${this.company}&nbsp&nbsp&nbsp&nbsp${this.year}&nbsp&nbsp&nbsp&nbsp${this.profit}&nbsp&nbsp&nbsp&nbsp`;
            listContent += `<button data=${this._id} class="myButton deleteReport">delete</button></div><br>`;
        });
        // inject the listContent string to the existing reportList element
        $('#reportList').html(listContent);
    });
};

function addOrUpdateReport(event) {
    event.preventDefault();

    let errCount = 0;
    $('#addReport input').each(function(index, val) {
        if ($(this).val() === "") {
            errCount++;
        }
    });
    $('#addReport select').each(function(index, val) {
        if ($(this).val() === "") {
            errCount++;
        }
    });

    // check and make sure errCount is zero
    if (errCount === 0) {
        // if zero; info is valid; compile info into one obj
        const company = $("#addReport fieldset input#inputReportCompany").val();
        const year = $("#addReport fieldset select#inputReportYear").val();
        const profit = $("#addReport fieldset select#inputReportProfit").val();
        const newReport = {
            "company" : company,
            "year" : year,
            "profit" : profit
        };
        $.ajax({
            type: "PUT",
            data: newReport,
            url: "/users/addorupdatereport",
            dataType: "JSON",
        }).done((res)=> {
            // check if err response is blank
            if (res.msg == "") {
                // clear all form inputs
                $("#addReport fielset input").val("");
                $("#addReport fieldset select").val(0);

                // update the table
                populateReportList();
            } else {
                // alert err msg
                alert(`ERROR : ${res.msg}`);
            }
        });
    } else {
        // if errCount is not zero, prompt to fill in all details
        alert('Please fill in all fields');
        return false;
    }
}

function deleteReport(event) {
    event.preventDefault();
    // prompt a confirmation
    const confirmation = confirm('are you sure you want to delete?');

    // check and make sure the report confirmed
    if (confirmation === true) {
        // delete the selected report
        const id = $(this).attr('data');
        $.ajax({
            type: "DELETE",
            url: `/users/delete/${id}`,
        }).done((res) => {
            // check if err res is blank
            if (res.msg === "") {
                // update the table
                populateReportList();
            } else {
                // alert err msg
                alert(`ERROR : ${res.msg}`);
            }
        });
    } else {
        // if confirmation false
        return false;
    }
};