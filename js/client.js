//Client.js - It handles messages from the server and generates Markers to the client-side

//A simple client class called SPOTTER
var SPOTTER = function(){
	this.url ="";
	this.wsconnection = null;
	this.connectionid;
	this.dic_marker = {}; //dictionary to store the spots markers
};

//connect to the websocket server
SPOTTER.prototype.connect = function(url){
	this.url = url;
	if(!url)
		throw("You must specify the server URL!");

	window.WebSocket = window.WebSocket||window.MozWebSocket;
	if(!window.WebSocket){
		alert("Websocket not supported by your Browser!");
		return;
	}
	var final_url ="ws://"+url;
	this.wsconnection = new WebSocket(final_url);
};

//Send message to the ws server
SPOTTER.prototype.SendMessage = function(msg){
	this.wsconnection.send(JSON.stringify(msg));
};

//Creates the marker from the websocket message received from ws
SPOTTER.prototype.CreateMarker = function(data){
	//console.log(data.Pos);
	var marker = L.marker(data.Pos,{icon: this.CreateIcon()}).addTo(mymap);
	marker.name = data.Name;
	marker.id = data.id;
	marker.imgpath = data.Img;
	marker.votes = data.Votes;
	marker.desc = data.Desc;
	marker.voted = false;
	this.AssignPopUp(marker,true);
	this.dic_marker[data.id] = marker;

};

//Returns an Icon
SPOTTER.prototype.CreateIcon = function(){
	var myIcon = L.icon({
		iconUrl:'Resources/SkateIcon_selected.png',
		iconSize:[40,40],
		popupAnchor:[20,3],
		iconAnchor:[-0.5,1]
	});
	return myIcon;
};

SPOTTER.prototype.AssignPopUp = function(marker,buttons){
	var pop = L.popup();
	var htmlContent = this.CreatePopUp(marker.name,marker.imgpath,marker.desc,marker.votes,buttons);
	pop.setContent(htmlContent);
	marker.bindPopup(pop);
};

//Creates the popup with the information ( HTML Content )
SPOTTER.prototype.CreatePopUp = function(name,imgpath,desc,votes,buttons){
	var br1 = document.createElement("br");
	var br2 = document.createElement("br");
	var br3 = document.createElement("br");
	var br4 = document.createElement("br");
	var br5 = document.createElement("br");


	var spot_name = document.createElement("h2");
	spot_name.className = "POP_NAME";
	spot_name.innerHTML = name;

	var spot_desc = document.createElement("p");
	spot_desc.className = "POP_DESC";
	spot_desc.innerHTML = desc;

	var spot_vote = document.createElement("b");
	spot_vote.innerHTML="USER'S REVIEW";

	var spot_vote_values = document.createElement("p");
	spot_vote_values.className ="POP_VOTES";
	spot_vote_values.innerHTML="Likes: "+votes[0]+" Dislikes: "+votes[1];

	var button = document.createElement("button");
	button.className = "btn_pano";
	button.innerHTML = "<i class=\"fa fa-eye\"></i> SEE PANO ";
	button.setAttribute("id",imgpath);

	var button_positive = document.createElement("button");
	button_positive.className = "btn_vote pos";
	button_positive.innerHTML = "Good<i class =\"fa fa-thumbs-up\"></i>";
	button_positive.setAttribute("id",imgpath+"vp");

	var button_negative = document.createElement("button");
	button_negative.className = "btn_vote neg";
	button_negative.innerHTML = "Bad  <i class =\"fa fa-thumbs-down\"></i>";
	button_negative.setAttribute("id",imgpath+"vn");

	var final_div = document.createElement("div");
	final_div.className = "holder";
	// final_div.appendChild(br1);
	final_div.appendChild(spot_name);
	// final_div.appendChild(br2);
	final_div.appendChild(spot_desc);
	final_div.appendChild(br3);
	final_div.appendChild(spot_vote);

	//Buttons if needed
	if(buttons){
		final_div.appendChild(br1);
		final_div.appendChild(button_positive);
		final_div.appendChild(button_negative);
		final_div.appendChild(br2)
	}
	
	final_div.appendChild(spot_vote_values);
	// final_div.appendChild(br4);
	final_div.appendChild(button);

	return final_div;
};

//CONENCTING THE WEBSOCKET SERVER
var s = new SPOTTER();
//client.wsconnect("localhost:9026");
s.connect("ecv-etic.upf.edu:9026");

//Message received from the ws server
//Here we receive the data of every spot - Create Spot(marker) and add it to the array
s.wsconnection.onmessage = function(msg){
	var data = JSON.parse(msg.data);
	console.log(data);
	if(data.type=="SPOT"){
		s.CreateMarker(data);
	}
	else if(data.type =="SPOTVOTE"){
		if((data.id in s.dic_marker) && s.dic_marker[data.id].name == data.name){
			var marker = s.dic_marker[data.id];
			marker.votes = data.votes;
			var htmlcont;

			if(marker.voted)
				htmlcont = s.CreatePopUp(marker.name,marker.imgpath,marker.desc,marker.votes,false);
			else{
				htmlcont = s.CreatePopUp(marker.name,marker.imgpath,marker.desc,marker.votes,true);
			}

			marker._popup.setContent(htmlcont);
			buttonsEvents(marker);
		}
	}
	else if(data.type =="DELETEVOTE"){
		//delete the actual marker in the database and remove to the map
		if((data.id in s.dic_marker) && s.dic_marker[data.id].name == data.name){
			mymap.removeLayer(s.dic_marker[data.id]);
			delete s.dic_marker[data.id]; //remove from the dictionary
		}
	}
	else if(data.type=="AUT"){
		s.connectionid = data.id;
	}
}