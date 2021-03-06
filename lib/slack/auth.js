var express = require('express');
var router = express.Router();
var config = require('../../config.json');
var utils = require('../../utils');
var passport = require('passport'), SlackStrategy = require('passport-slack').Strategy;

/* Authentication */
passport.use(new SlackStrategy({
  clientID: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  callbackURL: "https://sonavoice.com/authenticate/slack/callback",
  scope: 'channels:read, chat:write:user, users:read, im:read',
  passReqToCallback: true,
}, function(req, accessToken, refreshToken, profile, done) {
  req.session.slack = {};
  req.session.slack.accessToken = accessToken;
  req.session.slack.refreshToken = refreshToken;
  req.session.slack.profile = profile;
  return done(null, false);
}));

/* Configure Routes */
router.get('/slack/start', passport.authenticate('slack'));
router.get('/slack/callback', passport.authenticate('slack', { failureRedirect: '/authenticate/slack/done' }));
router.get('/slack/done', function(req, res, next) {
  res.render('successAuth', { "auth": req.session.slack, "extension": "slack" });
});

module.exports = router;
