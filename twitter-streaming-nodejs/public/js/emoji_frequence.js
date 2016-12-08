
var map = function(){
var keys = ["\uD83D\uDE01","\uD83D\uDE02","\uD83D\uDE03","\uD83D\uDE04","\uD83D\uDE05","\uD83D\uDE06",
            "\uD83D\uDE09","\uD83D\uDE0A","\uD83D\uDE0B","\uD83D\uDE0C","\uD83D\uDE0D","\uD83D\uDE0F",
            "\uD83D\uDE12","\uD83D\uDE13","\uD83D\uDE14","\uD83D\uDE16","\uD83D\uDE18","\uD83D\uDE1A",
            "\uD83D\uDE1C","\uD83D\uDE1D","\uD83D\uDE1E","\uD83D\uDE20","\uD83D\uDE21","\uD83D\uDE22",
            "\uD83D\uDE23","\uD83D\uDE24","\uD83D\uDE25","\uD83D\uDE28","\uD83D\uDE29","\uD83D\uDE2A",
            "\uD83D\uDE2B","\uD83D\uDE2D","\uD83D\uDE30","\uD83D\uDE31","\uD83D\uDE32","\uD83D\uDE33",
            "\uD83D\uDE35","\uD83D\uDE37","\uD83D\uDE38","\uD83D\uDE39","\uD83D\uDE3A","\uD83D\uDE3B",
            "\uD83D\uDE3C","\uD83D\uDE3D","\uD83D\uDE3E","\uD83D\uDE3F","\uD83D\uDE40","\uD83D\uDE48",
            "\uD83D\uDE49","\uD83D\uDE4A","\uD83D\uDE4F"];  
  if(this.text!= null)
  {
    for(var i=0;i<keys.length;i++)
    {
      if( this.text.indexOf(keys[i]) != -1)
      {
        emit(keys[i],1);
      }
    }
  }
}
var reduce = function(key, values){
  var frequence = 0;
  values.forEach(function(v){ frequence += v});
  return frequence;
}
/*load( "/root/dataviz/twitter-streaming-nodejs/public/js/clean_data.js");
db.tweets.mapReduce(map,reduce,{out:"emoji_frequence"});
{
        "result" : "emoji_frequence",
        "timeMillis" : 49452,
        "counts" : {
                "input" : 3169085,
                "emit" : 1663869,
                "reduce" : 138334,
                "output" : 51
        },
        "ok" : 1
}*/
