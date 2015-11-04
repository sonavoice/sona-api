var express = require('express');
var router = express.Router();
var utils = require('../utils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(200);
});

router.post('/command', function(req, res) {
  if (!Object.keys(req.body).length) {
    res.send(400);
  } else {
    var transcript = req.body.transcript;
    var auth = req.body.auth;
    var confirmed = req.body.confirmed;

    utils.runCommand(transcript, auth, confirmed, function(err, feedback, confirmation) {
      if (err) {
        console.log(err);
        res.send({
          feedback: feedback,
          confirmation: false
        });
        return;
      }

      confirmation = (confirmation === undefined) ? false : confirmation;
      res.send({
        feedback: feedback,
        confirmation: confirmation,
      });

    });
  }
});

module.exports = router;
