<?php
	$conn=mysqli_connect('sophia.cs.hku.hk','agoyal','zIvdQsUN') or die ('Failed to Connect'.mysqli_error($conn));
	
	mysqli_select_db($conn, 'agoyal') or die ('Failed to Access DB'.mysqli_error($conn));
	
	$query = 'select * from checklist limit '.$_GET['lastRecord'].',3';
	
	$result = mysqli_query($conn, $query) or die ('Failed to query'.mysqli_error($conn));
	
	$json = array();
	
	while($row=mysqli_fetch_array($result)) {
		$json[] = array(
			'id' => $row['id'],
			'doneOrNot' => $row['doneOrNot'],
			'title' => $row['title'],
			'datetime' => $row['datetime'],
			'taskdescription' => $row['taskdescription']
		);
	}
	print json_encode(array('notes'=>$json));
?>