# interacive-map-website

This is a fully working modern responsive website including the whole client & server side (HTML, css, Javascript & node.js with a REDIS database). The aim of the website is to find and create spots/markers/places on an interactive map (based on Leaflet) with pop-up desciptions and a panoramic image view as well as some user review options such as LIKE/DISLIKE.

This website was created as the final assignment for the subject ECV (*Entorn de Comunicació Virtual*) on my 4th year of the *Audiovisual Systems Engineering degree* at *University Pompeu Fabra*, Barcelona.


## Info

The website was orginally created to be oriented to the skateboarding community in Barcelona, and we named it BCN SKATE SPOTS Interactive Map. 

The goal is to allow skaters to annonimously search for new places (spots) to skate nearby them.
What's more, users can open an interactive panoramic view of the spot and see the community´s review about it.

The map is intended to be mantained by the community. Thefore, users can interact with each other by contributing to the site in the following fashion:

- By evaluating with Like/Dislike the current spots on the map, which can act as a quality guideline while also filtering by automatically deleting spots with bad user reviews. (When Dislikes - Likes > 5)
- By sharing/creating/uploading NEW SPOTS with their own position, description and panoramic image to the server's REDIS database.

## Implementation details

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


## Future improvements

- We would have liked to have more time to implement more user interaction such as a board with the latest added spots & user comments. 
- User accounts.
- Display who is at each spot.
- Size of markers depending on spot importance/popularity.
- Google analytics.

## Run the server side and use the web

- Clone this repo on any directory and change directory
	`$ git clone https://github.com/pvalls/interacive-map-website`
	`$ cd interacive-map-website`
- Install [node.js](https://nodejs.org/en/download/) if you don't already have it.
- Install [Redis](https://redis.io) if you don't already have it.
- Run the redis server<br>
	`$ cd redis-5.0.6/src`<br>
	`$ ./redis-server` 
- Run our server with the command <br>
`"node MainServer.js".`
- Access and use the web at<br>
`http://localhost:9026/main.html`

**Some screenshots**
![](https://github.com/pvalls/interacive-map-website/raw/master/screenshots/Main%20Page.png)
![](https://github.com/pvalls/interacive-map-website/raw/master/screenshots/Panoramic%20View.png)

## AUTHORS &  ACKNOWLEDGMENTS

The creators of the website are Pol Valls and Lie Jin (@Jinanggd and @pvalls)

Special thanks to our professor Javier Agenjo.

***emails***:
<a href="mailto:lie9762@gmail.com">lie9762@gmail.com</a> <a href="mailto:polvallsrue@gmail.com">polvallsrue@gmail.com</a>

	
	
	
