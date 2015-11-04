var request   = require('request');
var _         = require('lodash');
var db = require('./db/db');
var Extension = require('./db/Extension');
var utils     = require('./utils');

request("https://randomapi.com/api/?key=Z5J1-1QP0-68VY-D7R1&id=p0utdo8&noinfo&results=10", function(error, response, body) {
  var data = JSON.parse(body).results;
  var count = 0;
  _.each(data, function(ext) {
    var ext = ext.extension;
    var extensions = new Extension({
      developerEmail: ext.developerEmail,
      name: ext.name,
      description: ext.description,
      commands: [
        ext.commands.one,
        ext.commands.two,
        ext.commands.three,
        ext.commands.four,
        ext.commands.five,
      ],
      iconURL: ext.iconURL
    });

    extensions.save(function(err) {
      if (err) {
        console.log(err);
      }

      if (++count == 10) {
        process.exit();
      }
    });
  });
});
