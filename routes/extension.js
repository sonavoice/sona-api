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
  Extension.find({}, function(err, extensions) {
    if (err) {
      console.log('Error in retrieving all extensions: ', err);
    } else {
      res.send(extensions);
    }
  });
});

router.post('/', upload.fields([{ name: 'guid', maxCount: 1 }, { name: 'extension', maxCount: 1 }]), function(req, res) {
  /* Ideally need extensions name, developer id, and zipped extension in request */
  //req.accepts('application/zip');
  var guid = req.body.guid;
  var email = req.body.email;
  var name = req.body.name;

  var zipBuffer = req.files.extension[0].buffer;
  console.log(guid);
  console.log(email);

  Developer.findOne({authToken: guid}, function(err, dev) {
    if (dev === null) {
      res.status(401).send("Invalid auth token detected. Please login again.");
    } else {
      utils.addExtension(zipBuffer, name, function() {
        res.sendStatus(200);
      });
      var extensions = new Extension({ developerEmail: dev.email, name: name, description: "fake description", commands: [], iconURL: "fake icon URL"  })
      extensions.save(function(err) {
        if (err) { 
          console.log('Didn\'t save Extension to Extension collection')
        };
        console.log('Extension saved!');
      });
    }
  });
});

module.exports = router;