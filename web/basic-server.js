// var httpRequest = require("http-request");
var handler = require("./request-handler");
var helpers = require("./http-helpers");
// var path = require("path");
// var fs = require('fs');
var http = require('http');



var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(
  handler.handleRequest
);


console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

