<?php

// connect to the db
$conn=mysqli_connect('sophia', 'agoyal', 'zIvdQsUN') or die('Error!1'.mysqli_error($conn));

// select db
mysqli_select_db($conn, 'agoyal') or die('Error!2'.mysqli_error($conn));

// defining variables
$updatedMailbox = $_GET['updatedMailbox'];
$selectedCheckboxes = json_decode($_GET['selectedCheckboxes']);

// query based on updatedMailbox
foreach($selectedCheckboxes as $id) {
    if ($updatedMailbox=='rm') {
        $query = "delete from emails where emailID='$id'";
        mysqli_query($conn, $query) or die ('Query Error'.mysqli_error($conn));
        print 'yee';
    } else {
        $query = "update emails set mailbox='$updatedMailbox' where emailID='$id'";
        mysqli_query($conn, $query) or die ('Query Error'.mysqli_error($conn));
    }
    print " '$id'";
}

?>