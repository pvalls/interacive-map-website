//Main interaction of the application
//It handles some events and buttons management

//New spot boolean handler
var new_spot = false;

//GET THE ELEMENTS FROM THE DOM
//Get the modal from Panoviewer
var modal = document.getElementById('PanoModalBox');
var span = document.getElementsByClassName("close")[0];

//Get the Modal from NewSpot
var span_newspot = document.getElementsByClassName("close")[1];
var button_newspot = document.querySelector(".btn_newspot");
var button_newspot2 = document.getElementById("NewSpot2"); //Second newspot ( when the window size is small )

var modal_new_spot = document.getElementById('SetNewBox');
var form_submit = document.forms["NS"];

var button_positive;
var button_negative;
var button;

//When the user submites the new spot 
form_submit.onsubmit = function(){
	//DEPRACATED - We just make disapear the modal - The server will automatically send us back the message from the new spot information
	//Create the Spot Object and send it to the server
	// var spot = {};
	// spot.Name = document.forms["NS"]["Name"].value;
	// //Dirty trick to override the image file name
 //    spot.Img = document.forms["NS"]["Pos"].value.replace(".","_") +"."+document.forms["NS"]["filetoupload"].value.split(".")[1];
 //    spot.Votes = document.forms["NS"]["Votes"].value.split("_");
 //    spot.Desc = document.forms["NS"]["Desc"].value;
 //    spot.Pos = document.forms["NS"]["Pos"].value.split("_");
    //spot.type = "NEWSPOT";
    //s.SendMessage(spot);

    ///////////////////////////////////////////////////
    modal_new_spot.style.display="none";

    //Deactivate NEWSPOT alert message
	document.getElementById("NEWSPOTalert").style.display = "none";

    new_spot = false; // Set the boolean to false
}

//BUTTONS EVENTS FOR ADDING NEW SPOT//
button_newspot.addEventListener("click",function(){
	new_spot = true;
	document.getElementById("NEWSPOTalert").style.display = "block";
	alert("Now click on the location of the NEW SPOT on the MAP");
})

button_newspot2.addEventListener("click",function(){
	
	new_spot = true;
	document.getElementById("NEWSPOTalert").style.display = "block";
	document.getElementById("sideBarMobile").style.display = "none";
	document.getElementById("myOverlay").style.display = "none";
	//In reduced view the user is probably usin a touchscreen
	alert("Now tap on the location of the NEW SPOT on the MAP");


})

span_newspot.addEventListener("click",function(){
	modal_new_spot.style.display="none";
})


//Creating a map variable from leaflet library
var mymap = L.map('main_map',{minZoom:13}).setView([41.3818, 2.1685], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
	{ attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
	maxZoom: 18, 
	id: 'mapbox.streets', 
	accessToken: 'pk.eyJ1IjoibGllamluIiwiYSI6ImNqdDdmb2UyaDBwZ3o0M21zY3ZmcHNzNzEifQ.cnbeUTj8w1EdD-LAOC6Pcw' }).addTo(mymap);


//MAP EVENTS //
//When clicking on a marker this function is called
mymap.on("popupopen",function(e){
	//Clicked marker identifier (name)
	var marker = e.popup._source;
	buttonsEvents(marker);

});

//When the user clicks on the map if the new_spot is true we that means that we need to add a new spot
mymap.on('click',NewSpot);

function NewSpot(e){
	if(new_spot){
		CleanSpots(); // Clean previous values
		modal_new_spot.style.display ="block";
		var LatLong = e.latlng;
		document.forms["NS"]["Pos"].value = LatLong.lat+"_"+LatLong.lng;
		document.forms["NS"]["Votes"].value = "0_0";
		document.forms["NS"]["Pos"].readOnly = true;
		document.forms["NS"]["Votes"].readOnly = true;
	}
}

function CleanSpots(){
	//clean input
	document.forms["NS"]["Name"].value = "";
    document.forms["NS"]["Desc"].value="";
    document.forms["NS"]["filetoupload"].value ="";
    document.forms["NS"]["Votes"].value ="";
    document.forms["NS"]["Pos"].value = "";
}

//OPEN EVENTS FOR VOTING AND PANO BUTTONS//
function buttonsEvents(marker){

	button = document.getElementById(String(marker.imgpath));
	button_positive = document.getElementById(String(marker.imgpath+"vp"));
	button_negative = document.getElementById(String(marker.imgpath+"vn"));

	//EVENTS VOTING THE SPOT //
	if(button_positive != null){
		
		button_positive.onclick = function(){
			sendVote(0,marker);
		}

		button_negative.onclick = function(){
			sendVote(1,marker);
		}
	}
	
	//PANORAMIC IMAGE //
	// When the user clicks the button, open the modal 
	if(button!=null){
		button.onclick = function() {
			  modal.style.display = "block";

			  /* jshint jquery: true */
			    jQuery(document).ready(function($){
			      $("#myPano").pano({
			        img: "Resources/Pano/"+button.id
			        //img: "Resources/" + marker.url
			      });
			    });
		}
			// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			  modal.style.display = "none";
		}
			// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			  if (event.target == modal) {
			    modal.style.display = "none";
			  }
		}
	}
	
}

//Method to send the vote to the server through websocket
function sendVote(index,marker){
	//Hide all the buttons for voting - Users can only vote one time for one spot
	button_positive.style.display = "none";
	button_negative.style.display = "none";

	marker.votes[index] = parseInt(marker.votes[index])+1;
	marker.votes[index] = marker.votes[index].toString();
	marker.voted = true;

	//Send it to the websocket server
	var data = {};
	data.type = "SPOTVOTE";
	data.votes = marker.votes;
	data.id = marker.id;
	data.spotname = marker.name;
	s.SendMessage(data);
}

// OPEN AND CLOSE SIDEBARS //
function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function MobileHorizontalBarClick() {

	console.log("MobileHorizontalBarClicked");

	if(document.getElementById("sideBarMobile").style.display === "none"){

		// console.log("mySidebar is displayed");
		document.getElementById("sideBarMobile").style.display ="block";
		document.getElementById("myOverlay").style.display = "block";
	}
	else{
		// console.log("mySidebar is NOT displayed");
		document.getElementById("sideBarMobile").style.display = "none";
		document.getElementById("myOverlay").style.display = "none";
	}
}
 
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
  document.getElementById("sideBarMobile").style.display = "none";
}
