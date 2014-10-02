var http = require("http-request");
var handler = require("./request-handler");
var path = require("path");
var express = require("express");
var fs = require('fs');

var port = 8080;
var ip = "127.0.0.1";
var server = express();



var newPath = path.join(__dirname, '../archives/sites/'); //TODO fix this
server.use(express.static(newPath));






server.get("*", function (req, res){
  console.log("get on nonexistent site.");
});

server.post("*", function (req, res) {
  // obtain filepath to new file: URL
  console.log("poast");

  var datURL = "";
  req.on("data", function(buf){
    datURL += buf;

    if (datURL.indexOf("=") !== -1) {
      datURL = datURL.split("=",2)[1];
      console.log("I splitteted a thing", datURL);
    }
  });

  req.on("end", function() {
    var filepath = newPath + datURL;

    // scrape URL for HTML
    http.get(datURL , function (e, scraped){ // scrapePage(e, scraped, filepath)
      if (e) {
        console.log("error getting html");
        return;
      }

      var scrapedHTML = new Buffer(scraped.buffer);

      // open and write new file
      fs.open(filepath, "w", function (err, fd){

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
          // </stolen>
        }
        res.end();
      });
    });
  });
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

