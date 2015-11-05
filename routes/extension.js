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
  var description = req.body.description || "";

  var zipBuffer = req.files.extension[0].buffer;

  Developer.findOne({authToken: guid}, function(err, dev) {
    if (dev === null) {
      res.status(401).send("Invalid auth token detected. Please login again.");
    } else {

      Extension.findOne({name: name}, function(err, doc) {
        // New item
        if (doc === null) {
          utils.addExtension(zipBuffer, name, function() {
            var sampleCommands = fs.readFileSync('lib/' + name + '/sampleCommands.txt', 'utf-8').split("\n");
            sampleCommands = sampleCommands.filter(function(n) { return n !== ""});

            var extensions = new Extension({ developerEmail: dev.email, name: name, description: description, commands: sampleCommands, iconURL: "https://sonavoice.com/extensionIcon/" + name })
            extensions.save(function(err) {
              if (err) {
                res.status(500).send('Internal server error while saving extension');
              } else {
                res.status(200).send('saved');
              }
            });
          });

        // Update
        } else {
          if (doc.developerEmail === email) {
            utils.addExtension(zipBuffer, name, function() {
              var sampleCommands = fs.readFileSync('lib/' + name + '/sampleCommands.txt', 'utf-8').split("\n");
              sampleCommands = sampleCommands.filter(function(n) { return n !== ""});

              Extension.findOneAndUpdate({name: name}, {$set: {description: description, commands: sampleCommands}}, function(err) {
                if (err) {
                  res.status(500).send('Internal server error while saving extension');
                } else {
                  res.status(200).send('updated');
                }
              });
            });
          } else {
            res.status(401).send('You are not authorized to update this extension!');
          }
        }
      })
    }
  });
});

module.exports = router;