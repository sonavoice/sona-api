var express = require('express');
var router = express.Router();
var config = require('../../config.json');
var utils = require('../../utils');
var passport = require('passport'), VenmoStrategy = require('passport-venmo').Strategy;

/* Authentication */
passport.use(new VenmoStrategy({
  clientID: config.venmo.clientID,
  clientSecret: config.venmo.clientSecret,
  callbackURL: "http://localhost:3000/authenticate/venmo/callback",
  scope: 'make_payments, access_profile, access_friends',
  passReqToCallback: true,
}, function(req, accessToken, refreshToken, profile, done) {
  req.session.venmo = {};
  req.session.venmo.accessToken = accessToken;
  req.session.venmo.refreshToken = refreshToken;
  req.session.venmo.profile = profile;
  return done(null, false);
}));

/* Configure Routes */
router.get('/venmo/start', passport.authenticate('venmo'));
router.get('/venmo/callback', passport.authenticate('venmo', { failureRedirect: '/authenticate/venmo/done' }));
router.get('/venmo/done', function(req, res, next) {
  res.render('successAuth', { "token": req.session.venmo, "extension": "venmo" });
});

module.exports = router;