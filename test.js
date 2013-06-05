var reqUrl = "http://api.v3.factual.com/t/places/schema";
var OAuth = require('oauth').OAuth;

var fs    = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json').toString());

var oauth = new OAuth(null, null, config[0].key, config[0].secret, '1.0', null, 'HMAC-SHA1', null);

oauth.get(reqUrl, null, null, function(e, data, res){
  console.log(data);
});
