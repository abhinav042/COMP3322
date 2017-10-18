$(document).ready(function() {

  //id of last note retrieved from the database
  lastRecord = 0;

  //load the first 3 notes from the database.
  pullMore();

  //register "pullMore" as event handler when "Showing More..." is clicked
  $("#more").click(pullMore);
  
  //vertical position of the scroll bar such that note of topNoteId is displayed at the top
  lastScrollTop = 0;
  
  //id of the note displayed at the top of the iPhone screen
  topNoteId = 1;
  
  //register "displayTop" as event handler when the note list is scrolled  
  $("#Checklist").scroll(displayTop);

});

function pullMore(){
	
  // TO-DO 1: Use $.getJSON to retrive a json string response from "queryNote.php"
  // For each note contained in the JSON string, create a <div> element to present note info
  // and append it to the end of "#notes" element
  // Set the event handler of "click" on all the elements of class 
  //"clickableSpan" to "changeState" 
	$.getJSON(`queryNote.php?lastRecord=${lastRecord}`, function (result) {
		$.each(result.notes, function(i, j){
			$("#notes").append('<div class="note" id="'+j['id']+'"><span class="clickableSpan" onclick="changeState(this)">'+j['doneOrNot']+'</span><h3>'+j['title']+'</h3><br><h4>'+j['datetime']+'</h4><p>'+j['taskdescription']+'</p></div>');
			});
  	});
  lastRecord += 3;
}

function changeState(){	
	
	var oldValue = $(this).text();
	
	var newvalue;
	
	var noteID = //TO-DO 2: get id of the current note
	noteID=$(this).parent().attr('id');
	
	if (oldValue == 'Y') {
		newvalue = 'N';
	} else {
		newvalue = 'Y';
	}
	
	var that = $(this);
	
	// TO-DO 3: Use $.get to retrieve updateNoteState.php, to update value of doneOrNot of current note in database
	// If database is successfully updated, change display of doneOrNot on the HTML page accordingly 
	
	$.get("updateNoteState.php?id="+noteID+"&newValue="+newvalue,function(data){
		that.text(data);
	}); 
}

function displayTop(){	
	   //retrieve the current vertical position of the scroll bar
	   var st = $(this).scrollTop();
	   
	   //hideOrShow indicates whether some note(s) at the top of the display has/have been hidden or shown
	   var hideOrShow = false;
	   
	   while (st >= lastScrollTop + $("#"+topNoteId).height()){
	       // scrolling down and some note(s) go beyond top of the iPhone screen
		   // hide the note(s)
		   $("#"+topNoteId).css('visibility', 'hidden');
		   
		   lastScrollTop += $("#"+topNoteId).height();
		   
		   topNoteId++;		 
		     
		   hideOrShow = true;  
	   } 
	   
	   // TO-DO 4: similar to how we handle scroll-down, implement the code 
	   //to display hidden note(s) when scrolling up and available space (height) allows
	 
	   
	   while (st <= lastScrollTop - $("#"+topNoteId).height()){
	       // scrolling down and some note(s) go beyond top of the iPhone screen
		   // hide the note(s)
		   topNoteId--;	

		   $("#"+topNoteId).css('visibility', 'visible');
		   
		   lastScrollTop -= $("#"+topNoteId).height();
		   
		   hideOrShow = true;  
	   }
	   
	   
	   
	   //adjust vertical position of the scroll bar to be the same as lastScrollTop
	   if (hideOrShow)
	   	  $(this).scrollTop(lastScrollTop);
	   
}
