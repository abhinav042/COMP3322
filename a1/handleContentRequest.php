<?php

// connect to the db
$conn=mysqli_connect('localhost', 'comp3322', 'agoyal') or die('Error!1'.mysqli_error($conn));

// select db
mysqli_select_db($conn, 'comp3322') or die('Error!2'.mysqli_error($conn));

// defining the variables
$elemID = $_GET['elemID'];

// sql query for getting the email's content
$query = "SELECT * FROM emails WHERE emailID='$elemID'";

// executing the sql query
$result = mysqli_query($conn, $query) or die('Error!3'.mysqli_error($conn));

// getting the content of the email 
while($row = mysqli_fetch_array($result)) {
	print '<p>'.$row['content'].'</p>';
}

?>