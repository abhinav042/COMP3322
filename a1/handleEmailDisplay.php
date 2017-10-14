<?php 

// connect to the db
$conn=mysqli_connect('localhost', 'comp3322', 'agoyal') or die('Error!1'.mysqli_error($conn));

// select db
mysqli_select_db($conn, 'comp3322') or die('Error!2'.mysqli_error($conn));

// defining variables

$action = $_GET['action'];
$mailbox = $_GET['mailbox'];
$firstCount = $_GET['firstCount'];
$lastCount = $_GET['lastCount'];
$recLimit = 5;

// sql query for getting all the mails
$query1 = "SELECT * FROM emails WHERE mailbox='$mailbox'";

// sql query for limiting the query
$query2 = "SELECT * FROM emails WHERE mailbox='$mailbox' LIMIT $firstCount, $recLimit";

// executing the sql query 
$result = mysqli_query($conn, $query2) or die('Error!3'.mysqli_error($conn));

// display data from the db
while($row = mysqli_fetch_array($result)) {
	print '<tr class="email" id='.$row['emailID'].'>';
	print '<td><input type="checkbox" class="email-checkbox"></td><td onclick="displayEmailContent(this);">'.$row['sender'].'</td><td onclick="displayEmailContent(this);">'.$row['title'].'</td><td onclick="displayEmailContent(this);">'.$row['date'].'</td>';
    print '</tr>';
}

// getting the number of rows
$result = mysqli_query($conn, $query1) or die('Error!3'.mysqli_error($conn));

// getting the number of mails
if ($result) {
    $rowCount = mysqli_num_rows($result);   
}

// getting the number of pages
$pageCount = ceil($rowCount/$recLimit);

echo $pageCount;

?>