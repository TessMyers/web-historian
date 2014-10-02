var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpRequest = require("http-request");
var helpers = require('http-helpers');
var url = require('url');
var fs = require('fs');


var sitePath = path.join(__dirname, '../archives/sites/');


var getRequest = function (req, res, parsedUrl, filepath) {

  if (filepath === undefined) {
    console.log("careless get request");
    return postRequest(req, res, parsedUrl);
  }

  var content = fs.readFileSync(filepath); //dontdothat.jpg

  console.log('writing headers after get request');
  res.writeHead(202,helpers.headers);
  res.end(content);
  // put this shit on the interwobs
};


var postRequest = function (req, res, parsedUrl){
  console.log("post");

  var datURL = "";
  req.on("data", function(buf){
    datURL += buf;

    if (datURL.indexOf("=") !== -1) {
      datURL = datURL.split("=",2)[1];
      console.log("daturl", datURL);
    }
  });

  req.on("end", function() {
    var filepath = sitePath + datURL;

    // first thing we do is open the file for reading.
    // if there's an error, the file doesn't exist.

    fs.open(filepath, "r", function(err, fd){
      if (err) {

        helpers.createFile(req, res, datURL, filepath);
        console.log('file does not exist, writing');

      } else {

        fs.close(fd, function (){ console.log("file exists~~"); });

        getRequest(req, res, parsedUrl, filepath);

      }
    });

  });
};



exports.handleRequest = function (req, res) {

  var parsedUrl = url.parse(req.url);

  ({"GET": getRequest, "POST": postRequest})[req.method](req, res, parsedUrl);

  // res.end(archive.paths.list);
};

exports.handler = exports.handleRequest;

/// LALALALALA THIS FILE DOES NOTHING
