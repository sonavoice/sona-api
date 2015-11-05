var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var utils = require('../utils');
var fs = require('fs');
var multer  = require('multer');
var upload = multer();

var Extension = require('../db/Extension');
var Developer = require('../db/Developer');

router.get('/', function(req, res) {
  var name = req.query.name || '';
  Extension.find({name: {"$regex": name, "$options": "i"}}, function(err, extensions) {
    if (err) {
      console.log('Error in retrieving all extensions: ', err);
    } else {
      res.send(extensions);
    }
  });
});
router.post('/', upload.fields([{ name: 'guid', maxCount: 1 }, { name: 'extension', maxCount: 1 }]), function(req, res) {
  var guid = req.body.guid;
  var email = req.body.email;
  var name = req.body.name;

  var zipBuffer = req.files.extension[0].buffer;

  Developer.findOne({authToken: guid}, function(err, dev) {
    if (dev === null) {
      res.status(401).send("Invalid auth token detected. Please login again.");
    } else {
      utils.addExtension(zipBuffer, name, function() {

        var sampleCommands = fs.readFileSync('lib/' + name + '/sampleCommands.txt', 'utf-8').split("\n");
        sampleCommands = sampleCommands.filter(function(n) { return n !== ""});

        var extensions = new Extension({ developerEmail: dev.email, name: name, description: "", commands: sampleCommands, iconURL: "https://sonavoice.com/extensionIcon/" + name })
        extensions.save(function(err) {
          if (err) {
            console.log('Didn\'t save Extension to Extension collection');
            res.status(500).send('Internal server error while saving extension');
          };
          res.status(200).send('Extension saved!');
        });
      });
    }
  });
});

module.exports = router;