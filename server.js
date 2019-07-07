var express = require('express');
var compression = require("compression");
var app = express();
var http = require("http");
var path = require('path');

app.use(compression());
app.disable("x-powered-by");
app.set("port", process.env.PORT  || 8082);

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


http.createServer(app).listen(app.get("port"),app.get("ipAddress"), function(){
    console.log("Express server listening on port " + app.get('port'));
});
