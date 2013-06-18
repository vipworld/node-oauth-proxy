var http  = require('http');
var PORT  = 8111;
var OAuth = require('oauth').OAuth
  , fs    = require('fs')
  , url   = require('url')
  , minimatch = require('minimatch');

var config = JSON.parse(fs.readFileSync('./config.json').toString());
var oauths = {};

config.forEach(function(c){
  oauths[c.name] = new OAuth(null, null, c.key, c.secret, '1.0', null, 'HMAC-SHA1', null);
});

http.createServer(function (req, res){
  console.log("request recieved: %s", req.url);
  var host = url.parse(req.url).hostname;
  config.forEach(function(c){
    if(minimatch(host, c.match)) {
      if(req.method !== 'GET') {
        res.end("only supports get");
        return;
      }

      console.log('oauth match found: %s', c.match);

      oauths[c.name][req.method.toLowerCase()](req.url, null, null, function(error, data, ores) {
        res.statusCode = ores.statusCode;
        for (var h in ores.headers) {
          res.setHeader(h, ores.headers[h]);
        }
        res.write(data);
        res.end();
        return;
      });
    }
  });
  // res.statusCode = 404;
  // res.end();
}).listen(PORT);
