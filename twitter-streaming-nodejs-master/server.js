//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'DLuB6zCCJ1ZkusXwSEkCEvIvd',
  consumer_secret: 'DCcrnRfpnggtol6Vj13LCynbm9ahtbO2TQc8ey6czk1KMiwKSj',
  access_token_key: '4230026657-VPEAcPse8Mipenz4EsUSgJMOKt2QnevLxudwz56',
  access_token_secret: 'pCgoelV6RV4wpB130ANuAj1PTS582V3KOEnKQej4XwFBq'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//read emoji data
var fs = require('fs');
var emoji_data = JSON.parse(fs.readFileSync(__dirname + '/public/data/emoji_data.json', 'utf8'));
//console.log(emoji_data.data);

//tweet emoji track list
var track_list = "";
for (var i = 0; i < emoji_data.data.length; i++) {
    var surrogate_pair = emoji_data.data[i].surrogate_pair;
    if(i!=emoji_data.data.length-1)
    {
      track_list += surrogate_pair + ",";
    }else{
      track_list += surrogate_pair;
    }
    console.log(surrogate_pair);
}
var filter = {"track":track_list};
/* connection mongoDB*/
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/tweets', function (err, db) {
    if (err) {
        throw err;
        
    } else {
        console.log("successfully connected to the database");       
        var collection = db.collection('tweets');

        /*twitter streaming begin */
          var filter = {'track':'\uD83D\uDE1A'};
         
              //Connect to twitter stream passing in filter emoji patterns
              twit.stream('statuses/filter',filter , function(stream) {
                  stream.on('data', function(data) {
                  var tweet = {};
                  tweet.created_at = data.created_at;
                  tweet.text = data.text;
                  if(data.hasOwnProperty("user"))
                  {
                    if(data.user.hasOwnProperty("screen_name"))
                    {
                        tweet.user_name = data.user.screen_name;
                    }else if(data.user.hasOwnProperty("name"))
                    {
                      tweet.user_name = name;
                    }
                    if(data.user.hasOwnProperty("location"))
                    {
                      tweet.user_location = data.user.location;  
                    }
                  }
                  
                  if(data.coordinates)
                  {
                    if( data.coordinates!=null)
                    {
                        tweet.lat = data.coordinates.coordinates[0];
                        tweet.lng = data.coordinates.coordinates[1];
                    }
                  }else if(data.place)
                  {
                            if(data.place.bounding_box === 'Polygon'){
                            // Calculate the center of the bounding box for the tweet
                            var coord, _i, _len;
                            var centerLat = 0;
                            var centerLng = 0;

                            for (_i = 0, _len = coords.length; _i < _len; _i++) {
                              coord = coords[_i];
                              centerLat += coord[0];
                              centerLng += coord[1];
                            }
                            centerLat = centerLat / coords.length;
                            centerLng = centerLng / coords.length;

                            tweet.lat = centerLat;
                            tweet.lng = centerLng;

                          }
                  }
                    collection.insert(tweet, {w:1}, function(err, docs) {
                      if(err)
                        throw err;
                       console.log("err:" + err + " ,docs:"  + JSON.stringify(docs));
                    });

                      if (data.coordinates){
                        if (data.coordinates !== null){
                          //If so then build up some nice json and send out to web sockets
                          var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                          socket.broadcast.emit("twitter-stream", outputPoint);

                          //Send out to web sockets channel.
                          socket.emit('twitter-stream', outputPoint);
                        }
                        else if(data.place){
                          if(data.place.bounding_box === 'Polygon'){
                            // Calculate the center of the bounding box for the tweet
                            var coord, _i, _len;
                            var centerLat = 0;
                            var centerLng = 0;

                            for (_i = 0, _len = coords.length; _i < _len; _i++) {
                              coord = coords[_i];
                              centerLat += coord[0];
                              centerLng += coord[1];
                            }
                            centerLat = centerLat / coords.length;
                            centerLng = centerLng / coords.length;

                            // Build json object and broadcast it
                            var outputPoint = {"lat": centerLat,"lng": centerLng};
                            socket.broadcast.emit("twitter-stream", outputPoint);

                          }
                        }
                      }
                      stream.on('limit', function(limitMessage) {
                        return console.log(limitMessage);
                      });

                      stream.on('warning', function(warning) {
                        return console.log(warning);
                      });

                      stream.on('disconnect', function(disconnectMessage) {
                        return console.log(disconnectMessage);

                      });
                  });
              });
            
    }
    
});