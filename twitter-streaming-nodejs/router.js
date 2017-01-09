var express = require('express');
var router = express.Router();
var http = require("http");

router.get('/tweets', function(req, res, next) {
    var query =  '/tweets/';
    if(req.query.count)
    {
        query += '$cmd/?filter_count=tweets&limit=1';
    }else
    {
        query +=  'tweets/';
    }
    var options = 
    {
        host: '127.0.0.1',
        port: 28017,
        path: query,
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

router.get('/emoji_frequence', function(req, res, next) {
    var query =  '/tweets/emoji_frequence/?find';
    
    var options = 
    {
        host: '127.0.0.1',
        port: 28017,
        path: query,
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

router.get('/emoji_day_frequence', function(req, res, next) {
    var query =  '/tweets/emoji_day_frequence/?find';
    
    var options = 
    {
        host: '127.0.0.1',
        port: 28017,
        path: query,
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

router.get('/emoji_pair_frequence', function(req, res, next) {
    var query =  '/tweets/emoji_pair_frequence/?find';
    
    var options = 
    {
        host: '127.0.0.1',
        port: 28017,
        path: query,
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