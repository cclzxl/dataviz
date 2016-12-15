var clean_function = function(d)
{
     if(d.text ==null )
     {
            db.tweets.remove({_id:d._id});
     }else if(d.text.indexOf("\uD83D")  < 0 )
     {
            db.tweets.remove({_id:d._id});
     }
}