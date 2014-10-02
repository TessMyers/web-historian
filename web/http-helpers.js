var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpRequest = require("http-request");


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.createFile = function(req, res, datURL, filepath) {

  httpRequest.get(datURL, function(e, scraped) { // scrapePage(e, scraped, filepath)
    if (e) {
      console.log("error getting html");
      return;
    }

    var scrapedHTML = new Buffer(scraped.buffer);

    // open and write new file
    fs.open(filepath, "w", function(err, fd) {

      if (err) {
        throw "cannot open file" + err;
      } else {
        // blatantly stolen from stack overflow
        fs.write(fd, scrapedHTML, 0, scrapedHTML.length, null, function(err) {
          if (err) {
            throw 'error writing file: ' + err;
          } else {
            fs.close(fd, function() {
              console.log('file written');
            });
          }
        });
      }
      console.log('writing headers after post request');

      res.writeHead(201, exports.headers);
      res.end();
    });
  });
};


exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
};
