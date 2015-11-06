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

    utils.runCommand(transcript, auth, confirmed, function(err, feedback, requiresConfirmation) {
      if (err) {
        console.log(err);
        res.send({
          feedback: feedback,
          requiresConfirmation: false
        });
        return;
      }

      requiresConfirmation = (requiresConfirmation === undefined) ? false : requiresConfirmation;
      res.send({
        feedback: feedback,
        requiresConfirmation: requiresConfirmation,
        previousTranscript: transcript,
      });

    });
  }
});

module.exports = router;
