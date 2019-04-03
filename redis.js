//https://stackoverflow.com/questions/10584502/how-do-i-issue-hget-get-command-for-redis-database-via-node-js


var redis = require("redis"), client = redis.createClient();
client.select(3);
client.on("error",function(err){
	console.log("Error: "+ err);
});
// client.hmset("POLIE_SPOTS","SPOT1_NAME","plazaCat","SPOT1_SRC","algo.png","SPOT1_VOTE","1");
// client.hmset("POLIE_SPOTS","SPOT2_NAME","random","SPOT2_SRC","algo.png","SPOT2_VOTE","2");
client.set("Random","Valor");
client.hmset("SPOT","SPOT1_NAME","plazaCat","SPOT1_SRC","algo.png","SPOT1_VOTE","1");

//Adding info to data base
//5 entries:
//Name: Name of the spot
//Img: Path of the image
//Votes: Array of the votes 
//Desc: Description
//Pos: Array of lattitude and long coordinates
client.hmset("POLIE_SPOT2","Name","Indra","Img","indra.jpg","Votes","0_0","Desc","Carrer Tànger amb Carrer Boronat. Lloc senzill","Pos","41.403186_2.193864");
client.hmset("POLIE_SPOT3","Name","Ciutadella","Img","tryout.jpg","Votes","0_0","Desc","Al lao de mi casa EHEHE","Pos","41.388906_2.183508");


// client.hgetall("POLIE_SPOTS",function(err,obj){
// 	console.dir(obj);
// });
client.multi()
	.keys('*',function(err,replies){
		//console.log("MULTI got "+replies.length+" replies");
		replies.forEach(function(reply,index){
			//console.log("Reply "+index+": "+reply.toString());
			if(reply.toString().includes("POLIE")){
				console.log("READING INFO FROM " + reply.toString());
				client.hgetall(reply.toString(),function(e,o){
					console.dir(o);
				});
			}
			// client.get(reply.toString(),function(err,data){
			// 	if(err){
			// 		console.log("PROBANDO CON HGETALL");
			// 		client.hgetall(reply.toString(),function(e,o){
			// 			console.dir(o);
			// 		});
			// 	}
			// 	else console.log(data);
			// });
		});
	})
	.exec(function(err,replies){});
