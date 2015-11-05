var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require('../utils');
var config = require('../config.json');

router.get('/:extension', function(req, res, next) {
  var extension = req.params.extension

  res.sendFile(path.join(__dirname, '../lib/' + extension + '/logo.png'));
});

module.exports = router;