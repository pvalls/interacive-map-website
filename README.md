# interacive-map-website

This is a fully working modern responsive website including the whole client & server side (HTML, css, Javascript & node.js with a REDIS database). The aim of the website is to find and create spots/markers/places on an interactive map (based on Leaflet) with pop-up desciptions and a panoramic image view as well as some user review options such as LIKE/DISLIKE.

This website was created as the final assignment for the subject ECV (Entorn de Comunicació Virtual) on my 4th year of the Audiovisual Systems Engineering degree at University Pompeu Fabra, Barcelona.


## INFO

The website was orginally created to be oriented to the skateboarding community in Barcelona, and we named it BCN SKATE SPOTS Interactive Map. 

The goal is to allow skaters to annonimously search for new places (spots) to skate nearby them.
What's more, users can open an interactive panoramic view of the spot and see the community´s review about it.

The map is intended to be mantained by the community. Thefore, users can interact with each other by contributing to the site in the following fashion:

	- By evaluating with Like/Dislike the current spots on the map, which can act as a quality guideline while also filtering by automatically deleting spots with bad user reviews. (When Dislikes - Likes > 5)
	- By sharing/creating/uploading NEW SPOTS with their own position, description and panoramic image to the server's REDIS database.

## IMPLEMENTATION DETAILS

	- The websites' map is based on the free Leaflet Javascript open source library of intercavtive maps (https://leafletjs.com/)
	- The main stylesheet of css is from w3school.
	- The interactive panoramic view is based on the JQuery code by [Sean Coyne](https://github.com/seancoyne/pano)	
	- The uploaded images are stored as files on the server and are automatically erased when a marker is erased.
	- The rest of the spot information is stored on a REDIS database.

	Other comments:
	- Welcome page
	- Website is responsive.
	- Number of votes of each spot is updated in real time.


Check the source code comments for further insights.


## FUTURE IMPROVEMENTS

	- We would have liked to have more time to implement more user interaction such as a board with the latest added spots & user comments. 
	- User accounts.
	- Display who is at each spot.
	- Size of markers depending on spot importance/popularity.
	- Google analytics.

## RUN THE SERVER

	1. Install node.js, go to the main directory with the node terminal and run "node MainServer.js".
	2. Go to the localhost or your server's ip.(For the markers to appear you also need to have REDIS installed on the server side.)

## AUTHORS &  ACKNOWLEDGMENTS

The creators of the website are Pol Valls & Lie Jin. 

Special thanks to our professor Javier Agenjo.


### emails
	pol.valls02@estudiant.upf.edu
	lie.jin01@estudiant.upf.edu
	
	
