<?php

// connect to the database
$conn=mysqli_connect('sophia.cs.hku.hk', 'agoyal', 'zIvdQsUN') or die('Error!'.mysqli_error($conn));

// select database
mysqli_select_db($conn, 'agoyal') or die('Error!'.mysqli_error($conn));

// defining the sql query
$query = 'SELECT * FROM checklist LIMIT'.$_GET['lastRecord'].',3';

// executing sql query
$result = mysqli_query($conn, $query) or die('Error!'.mysql_error($conn));

// display data from the database
while($row = mysqli_fetch_array($result)) {
	print '<div class="Note" id='.$row['id'].'>';
	print '<span>'.$row['doneOrNot'].'</span><h3>'.$row['title'].'</h3><br><h4>'.$row['datetime'].'</h4><p>'.$row['taskdescription'].'</p>';
	print '</div>';
}

?>