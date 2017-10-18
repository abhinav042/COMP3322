<?php
	$conn=mysqli_connect('sophia.cs.hku.hk','agoyal','zIvdQsUN') or die ('Failed to Connect! '.mysqli_error($conn));
	
	mysqli_select_db($conn, 'agoyal') or die ('Failed to Access DB! '.mysqli_error($conn));

	$value = $_GET['newValue'];

	$query = "update checklist set doneOrNot='$value' where id=".$_GET['id'];

	mysqli_query($conn, $query) or die ('Query Error! '.mysqli_error($conn));

	$query2 = "select * from checklist where id=".$_GET['id'];
	
	$result = mysqli_query($conn, $query2) or die ('Failed for 2nd query! '.mysqli_error($conn));
	
	while ($row = mysqli_fetch_array($result)) {
	  print $row['doneOrNot'];
	}

?>