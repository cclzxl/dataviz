var express = require('express');
var router = express.Router();
var http = require("http");

router.get('/emoji_frequence', function(req, res, next) {
    /* Verify if search is undefined */
    /*optional params */
    var options = 
    {
        host: '127.0.0.1',
        port: 28017,
        path: '/tweets/tweets/',
        method: 'GET'
    };

        var getRequest = http.request(options, function(response)
        {
            var result = "";
            response.on('data', function (chunk) {
                result +=chunk;
            });
            response.on('end', function() {
                res.write(result);
                res.end();
                  
            });
               
        });
        getRequest.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            res.status(500).json({error:"Internal Server Error:	Please try later"});
        });
        getRequest.end();   

});

module.exports = router;