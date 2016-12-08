//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app);
var moment = require('moment');
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
console.log(tracklist);
var filter = {"track":track_list,"locations":"-180,-90,180,90"};
/* connection mongoDB*/
var MongoClient = require('mongodb').MongoClient;
//format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/tweets', function (err, db) {
    if (err) {
        throw err;
        
    } else {
        console.log("successfully connected to the database");       
        var collection = db.collection('tweets');

        /*twitter streaming begin */
         
              //Connect to twitter stream passing in filter emoji patterns
              twit.stream('statuses/filter',filter , function(stream) {
                  stream.on('data', function(data) {
                  //create tweet object
                  var tweet = {};
                  //parse twitter timestamp
                  var date = moment(data.created_at,"ddd MMM DD HH:mm:ss Z YYYY");
                  tweet.day = date.date();
                  tweet.month = (date.month() + 1) % 12;
                  tweet.year = date.year();
                  tweet.hour = date.hour();
                  tweet.minute = date.minute();
                  tweet.second = date.second();
                  //tweet text
                  tweet.text = data.text;
                  //user name
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
                  
                  if(data.hasOwnProperty("coordinates"))
                  {
                    if( data.coordinates!==null)
                    {
                        tweet.lat = data.coordinates.coordinates[1];
                        tweet.lng = data.coordinates.coordinates[0];
                    }else if(data.hasOwnProperty("place"))
                    {
                      if(data.place!==null)
                      {
                        if(data.place.bounding_box.type == "Polygon")
                        {
                          var polygon = data.place.bounding_box.coordinates;
                          var lats = [];
                          var lngs = [];
                          for(var i=0; i< polygon.length ;i++)
                          {
                              lats.push(0);
                              lngs.push(0);
                              for(var j=0; j<polygon[i].length;j++)
                              {
                                lats[i] += polygon[i][j][1];
                                lngs[i] += polygon[i][j][0];
                              }
                              lats[i] = lats[i] / j;
                              lngs[i] = lngs[i] / j;
                          }
                          tweet.lat = 0;
                          tweet.lng = 0;
                          for(var k=0;k<i;k++)
                          {
                            tweet.lat += lats[k];
                            tweet.lng += lngs[k];
                          }
                          tweet.lat = tweet.lat /i;
                          tweet.lng = tweet.lng /i;
                        }
                      }
                    }
                  }
                  console.log(tweet);
                    collection.insert(tweet, {w:1}, function(err, docs) {
                      if(err)
                        throw err;
                       //console.log("err:" + err + " ,docs:"  + JSON.stringify(docs));
                    });

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