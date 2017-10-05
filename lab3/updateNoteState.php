<?php 

// connect to the database
$conn=mysqli_connect('localhost', 'comp3322', 'agoyal') or die('Error!1'.mysqli_error($conn));

// select database
mysqli_select_db($conn, 'comp3322') or die('Error!2'.mysqli_error($conn));

// defining the query
$value = $_GET['newValue'];
$query = "update checklist set doneOrNot='$value' where id=".$_GET['id'];
mysqli_query($conn, $query) or die ('Query Error'.mysqli_error($conn));

?>