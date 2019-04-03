//NodeJS HTTP-server side//

//Redis DataBase
//http://ecv-etic.upf.edu/_admin/php-redis-admin/?overview

var redis = require("redis"), client_redis = redis.createClient(); // data Base
client_redis.select(3); //connect to the database 3

var http = require('http'); //Http
var url = require('url'); //url parse
var fs = require('fs'); //File reading
var formidable = require('formidable');//Formidable to UploadFiles

var WebSocketServer = require('websocket').server; // using WebSocket to send and receive information

var num_spots = 0;
//Arrays to store information
var connections = [];
var spots = {}; // dictionary with the id and spots

var server = http.createServer(function(req,res){
    var q = url.parse(req.url,true);

    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            var oldpath = files.filetoupload.path;
            var finalfilename = fields.Pos.replace(".","_")+"."+files.filetoupload.name.split(".")[1];
            var newpath = __dirname + "/Resources/Pano/"+finalfilename;

            fs.rename(oldpath, newpath, function (err) {
                //Save the spot in the Redis database
                if (err) throw err;
                SaveSpot(fields.Name,finalfilename,fields.Votes,fields.Desc,fields.Pos);
                res.writeHead(204);
                return res.end();
            });
        });
    }
    else{
        //try to load the file asked from the user, if it does not exist just return 404
        fs.readFile("."+q.pathname,function(err,data){
            if(err){
                res.writeHead(404,{'Content-Type':'text/html'});
                return res.end("404 Not Found");
            }
            if(q.pathname.includes(".html")){
                res.writeHead(200,{'Content-Type':'text/html'});
            }
            else if(q.pathname.includes(".css")){
                res.writeHead(200,{'Content-Type':'text/css'});
            }
            else if(q.pathname.includes(".js")){
                res.writeHead(200,{'Content-Type':'text/javascript'});
            }
            else if(q.pathname.includes(".jpg")){
                res.writeHead(200,{'Content-Type':'image/jpeg'});
            }
            else if(q.pathname.includes(".png")){
                res.writeHead(200,{'Content-Type':'image/png'});
            }
            res.write(data);
            return res.end();
        })
    }
})

server.listen(9026, function() {
    console.log("["+ new Date()+"]" + "Server is listening on port 9026");
});

//Read the spots in the database
GetSpots();
//Opening websocket Server
ws = new WebSocketServer({
    httpServer: server
});

//Everytime someone tries to connect to the websocket server
ws.on("request", function(request) {
    
    var connection = request.accept(null, request.origin);
    var id = connections.push(connection) - 1; // ID of the connected user

    //User ID object
    var userid = {};
    userid.type = "AUT";
    userid.id = id;
    connection.sendUTF(JSON.stringify(userid));

    //We send the spots to the users
    SendSpots(connection);
    //Messages from the user
    connection.on('message', function(message) {

        if (message.type === 'utf8') {
            var data = JSON.parse(message.utf8Data);

            if(data.type=="SPOTVOTE"){
                if((data.id in spots) && spots[data.id].Name == data.spotname){

                    console.log(spots[data.id].Name+"has been voted");
                    spots[data.id].Votes = data.votes;
                    var msg = {};

                    var positive = data.votes[0];
                    var negative = data.votes[1];
                    var result = parseInt(positive)-parseInt(negative);

                    if(result < -5){
                        msg.type ="DELETEVOTE";
                        var filepath = __dirname+"/Resources/Pano/"+spots[data.id].Img;


                        //Delete the panoramic file
                        fs.unlink(filepath, (err) => {
                            if (err) throw err;
                        });
                        //Remove from database
                        client_redis.del(spots[data.id].rediskey);

                        //Remove from the dictionary
                        delete spots[data.id];

                    }
                    else{
                        msg.type="SPOTVOTE";
                        msg.votes = spots[data.id].Votes;
                        //msg.userid = data.userid;

                        //Store in the database
                        client_redis.hmset(spots[data.id].rediskey,"Votes",spots[data.id].Votes[0]+"_"+spots[data.id].Votes[1]);
                    }
                    msg.id= data.id;
                    msg.name = data.spotname;


                    //SEND MESSAGE
                    doBroadcast(msg);
                }
            }
        }
    });

    //User disconnected
    connection.on('close', function(connection) {
        connections.splice(id,1); // remove the connection from the array
    });
});

//Send the data to all the users ( Broadcast )
function doBroadcast(data){
    for(var i=0; i<connections.length;i++)
        connections[i].sendUTF(JSON.stringify(data));   
}

//Reads all the markers in the data base and store it in a dictionary
function GetSpots(){
    client_redis.multi()
        .keys('*',function(err,replies){
            replies.forEach(function(reply,index){
                if(reply.toString().includes("POLIE")){
                   // console.log("["+new Date() + "][DB]: Getting spot "+ reply.toString());
                    client_redis.hgetall(reply.toString(),function(e,o){
                        num_spots++;
                        o.id =num_spots;
                        o.rediskey = reply.toString();
                        o.Votes = o.Votes.split("_");
                        o.Pos = o.Pos.split("_");
                        //console.dir(o);
                        spots[num_spots] = o;
                        // var data = JSON.parse(o);
                        // data.type = "SPOT";
                        //connection.sendUTF(JSON.stringify(o));

                    });
                }
            });
        })
        .exec(function(err,replies){});
}

//Send the spots information through websocket
function SendSpots(connection){
    for(var id in spots){
        var data = spots[id];
        data.type = "SPOT";
        connection.sendUTF(JSON.stringify(data));
    }
}

//Save In redis dataBase
function SaveSpot(name,pathname,votes,desc,pos){
    if(num_spots in spots)
        num_spots++;

    var key = "POLIE_SPOT"+num_spots;
    client_redis.hmset(key,"Name",name,"Img",pathname,"Votes",votes,"Desc",desc,"Pos",pos);
    
    var spot = {};
    spot.Name = name;
    spot.Img = pathname;
    spot.Votes = votes.split("_");
    spot.Desc = desc;
    spot.Pos = pos.split("_");
    spot.id= num_spots;
    spot.rediskey = "POLIE_SPOT"+num_spots;
    spots[num_spots] = spot;

    //And send it through web socket
    var data = spot;
    data.type = "SPOT";
    doBroadcast(data);
    //console.log("["+new Date() + "][DB]: saved new spot "+ spot.Name)
}
