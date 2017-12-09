//load all notes
function getNotes(data) {
	$("#allnotes").empty();
	$.getJSON("/allthenotes" + data, function(found) {
		for (var i = 0; i<found.length; i++) {
			$('#allnotes').prepend('<p class="dataentry" data-id=' + found[i].articleId + '><span class="notebody" note-id=' + found[i]._id + '>' + found[i].body + '<span class="deleter">X</span></p>');
		}
	})
}

$(document).on('click', 'a', function(e){
  e.preventDefault();
  var url = $(this).attr('href');
  window.open(url, '_blank');
});

//click for GET request to scrape
$(document).on("click", "#goScrape", function() {
	$.ajax({
		method: "GET",
		url: "/scrape",
	})
.done(function(data) {
	$.getJSON("/articles", function(data) {
		for (var i =0; i<data.length; i++) {
			$("#articles").append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ (data[i].link).link(data[i].link) + '</p>');
		}
	});
console.log("SCRAPED!");	
});	
});
// When you click a <p> tag empty the notes 
$(document).on('click', 'p', function(){
  $('#notes').empty();
  $('#allnotes').empty();
  var thisId = $(this).attr('data-id');


  // Run a GET request for an article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function(data) {
      console.log(data);
      // $('#notes').append('<h2>' + data.title + '</h2>'); 
      $('#notes').append('<textarea id="bodyinput"></textarea>'); 
      $('#notes').append('<button data-id="' + data._id + '" id="saveNote" class="button">Post</button>');
      $('#notes').append('<button data-id="' + data._id + '" id="deleteAllNotes" class="button">Send</button>');
      getNotes(data._id);
    });
});

//save the article ID when you click to save note
$(document).on("click", "#saveNote", function() {
	var thisId = $(this).attr("data-id");

//POST request to save the note
$.ajax({
	method: "POST",
	url: "/articles/" + thisId,
	data: {
		articleId: thisId,
		body: $("bodyinput").val()
	}
})
//then add body of note and delete button
.done(function(note) {
	$("#allnotes").prepend('<p class="dataentry" data-id=' + note.articleId + '><span class="notebody" note-id=' + note._id + '>' + note.body + '<span class="deleter">X</span></p>');
    console.log("Note: ", note);
});
//remove the values entered in the #bodyinput
    $("bodyinput").val("");
});

//save the article id when you click the #deleteAllNotes button, 
$(document).on("click", "#deleteAllNotes", function(){
  var thisId = $(this).attr('data-id');

//GET request to delete all the notes
  $.ajax({
    method: "GET",
    url: "/deleteall/" + thisId
  })
    .done(function(data) {
      console.log("Data: " + data);
    });
//remove the values entered in the #bodyinput 
  $("#bodyinput").val("");
  $("#allnotes").empty();
});

//empty the #allnotes div when you click the delete button
$(document).on("click", ".deleter", function(){
  
  $("#allnotes").empty();
  
//save the <span> and <p> tag that are parents of the delete button
  var selected = $(this).parent();     // the <span>
  var selectedp = selected.parent();   // the <p>
  var thisId = selectedp.attr("data-id");
  console.log("thisId: " + thisId);
  var thisNoteId = selected.attr("note-id");
  console.log("thisNoteId: " + thisNoteId);

//GET request to delete a note
  $.ajax({
    method: "GET",
    url: "/delete/" + thisNoteId
  })
 //remove the deleted note from the #allnotes 
    .done(function( data ) {
      selectedp.remove();
    });

//remove the values entered in the #bodyinput 
  $("#bodyinput").val("");
});
