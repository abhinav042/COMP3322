<?php

// connect to the database
$conn=mysqli_connect('localhost', 'comp3322', 'agoyal') or die('Error!1'.mysqli_error($conn));

// select database
mysqli_select_db($conn, 'comp3322') or die('Error!2'.mysqli_error($conn));

// defining the sql query
$query = 'SELECT * FROM checklist LIMIT '.$_GET['lastRecord'].',3';

// executing sql query
$result = mysqli_query($conn, $query) or die('Error!3'.mysqli_error($conn));

// display data from the database
while($row = mysqli_fetch_array($result)) {
	print '<div class="note" id='.$row['id'].'>';
	print '<span onclick="changeState(this)">'.$row['doneOrNot'].'</span><h3>'.$row['title'].'</h3><br><h4>'.$row['DATETIME'].'</h4><p>'.$row['taskdescription'].'</p>';
	print '</div>';
}

?>