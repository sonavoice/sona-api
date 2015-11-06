var _ = require('lodash');
var request = require('request');

module.exports = {
  title: 'Venmo',
  iconURL: 'http://sonavoice.io/api/icon',
  commands: {
    'request $1 from $2 with message $3': function(cb, auth, args, confirmed) {
      var passport = auth.passport;
      var amount = args[0];
      var person = args[1];
      var message = args[2];
      // person = 'Eugene';

      // 'https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>'
      var friendlistURL = "https://api.venmo.com/v1/users/" + passport.profile.id + "/friends?access_token=" + passport.accessToken
      if (confirmed) {
        request(friendlistURL, function(err, res, body) {
          var resData = JSON.parse(body);
          var friends = resData.data;
          // search through friend
          for (var i = 0; i < friends.length; i++) {
            if (friends[i].first_name.toLowerCase() === person.toLowerCase()) {
              var chargeURL = "https://api.venmo.com/v1/payments";

              request.post(chargeURL, {
                form: {
                  access_token: passport.accessToken,
                  user_id: friends[i].id,
                  note: message,
                  amount: -0.20
                }
              });

              cb(null, 'You requested ' + amount + ' from ' + person);
              return;
            }
          }

          cb('error', 'Could not find ' + person);
        });


      } else {
        cb(null, 'Do you want to request ' + amount + ' from ' + person + '?', true);
      }
    },
    'pay $1 amount $2 with message $3': function(cb, auth, args, confirmed) {
      var passport = auth.passport;
      var amount = args[0];
      var person = args[1];
      var message = args[2];
      // person = 'Eugene';

      // 'https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>'
      var friendlistURL = "https://api.venmo.com/v1/users/" + passport.profile.id + "/friends?access_token=" + passport.accessToken
      if (confirmed) {
        request(friendlistURL, function(err, res, body) {
          var resData = JSON.parse(body);
          var friends = resData.data;
          // search through friend
          for (var i = 0; i < friends.length; i++) {
            if (friends[i].first_name.toLowerCase() === person.toLowerCase()) {
              var chargeURL = "https://api.venmo.com/v1/payments";

              request.post(chargeURL, {
                form: {
                  access_token: passport.accessToken,
                  user_id: friends[i].id,
                  note: message,
                  amount: 0.20
                }
              });

              cb(null, 'You sent ' + amount + ' to ' + person);
              return;
            }
          }

          cb('error', 'Could not find ' + person);
        });


      } else {
        cb(null, 'Do you want to send ' + amount + ' to ' + person + '?', true);
      }
    },
  }
}
