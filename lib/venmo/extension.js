var _ = require('lodash');
var request = require('request');

module.exports = {
  title: 'Venmo',
  iconURL: 'http://sonavoice.io/api/icon',
  commands: {
    'request $1 from $2': function(cb, auth, args, confirmed) {
      var passport = auth.passport;
      var amount = Number(args[0].replace(/[^0-9\.]+/g,"")) * -1.0;
      console.log('amount =', amount);
      var person = args[1];
      // var message = args[2];
      var message = 'Sent through Sona.'
        // person = 'Eugene';

      // 'https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>'
      var friendlistURL = "https://api.venmo.com/v1/users/" + passport.profile.id
         + "/friends?access_token=" + passport.accessToken;

      if (!confirmed) {
        cb(null, 'Do you want to request ' + args[0] + ' from ' + person + '?', true);
        return;
      }

      request(friendlistURL, function(err, res, body) {
        var resData = JSON.parse(body);
        var friends = resData.data;
        // search through friend
        for (var i = 0; i < friends.length; i++) {
          if (friends[i].first_name.toLowerCase() === person.toLowerCase()) {
            console.log('found friend');
            var chargeURL = "https://api.venmo.com/v1/payments";
            var options = {
              url: chargeURL,
              formData: {
                access_token: passport.accessToken,
                user_id: friends[i].id,
                note: message,
                amount: amount,
              },
            };
            request.post(options, function(err, res, body) {
              console.log('body =', body);
              var data = JSON.parse(body);
              if (err || data.hasOwnProperty('error')) {
                console.log('err =', err);
                cb(null, 'Could not request money from ' + person);
                return;
              }

              cb(null, 'You requested ' + args[0] + ' from ' + person);
            });

            return;
          }
        }

        cb('error', 'Could not find ' + person);
      });


    },
    'pay $1 to $2': function(cb, auth, args, confirmed) {
      var passport = auth.passport;
      var amount = Number(args[0].replace(/[^0-9\.]+/g,""));
      var person = args[1];
      // var message = args[2];
      var message = 'Sent through Sona.';
      // person = 'Eugene';

      // 'https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>'
      var friendlistURL = "https://api.venmo.com/v1/users/" + passport.profile.id + "/friends?access_token=" + passport.accessToken

      if (!confirmed) {
        // cb(null, 'Do you want to send ' + amount + ' to ' + person + '?', true);
        cb(null, 'Confirm?', true);
        return;
      }

      request(friendlistURL, function(err, res, body) {
        var resData = JSON.parse(body);
        var friends = resData.data;
        // search through friend
        for (var i = 0; i < friends.length; i++) {
          if (friends[i].first_name.toLowerCase() === person.toLowerCase()) {
            var chargeURL = "https://api.venmo.com/v1/payments";
            var options = {
              url: chargeURL,
              formData: {
                access_token: passport.accessToken,
                user_id: friends[i].id,
                note: message,
                amount: 0.20,
              },
            };


            request.post(options, function(err, res, body) {
              var data = JSON.parse(body);
              if (err || data.hasOwnProperty('error')) {
                // console.log('err =', err);
                cb(null, 'Could not send money to ' + person);
                return;
              }

              cb(null, 'You sent ' + amount + ' to ' + person);
            });

            return;
          }
        }

        cb('error', 'Could not find ' + person);
      });
    },
  }
}
