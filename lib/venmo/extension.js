var _ = require('lodash');
var request = require('request');

module.exports = {
  title: 'Venmo',
  iconURL: 'http://sonavoice.io/api/icon',
  commands: {
    'charge $1 to $2': function(cb, auth, args, confirmed) {
      var passport = auth.passport;
      var amount = args[0];
      var person = args[1];
      person = 'Eugene';

      console.log('passport =', passport);

      // 'https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>'
      var friendlistURL = "https://api.venmo.com/v1/users/" + passport.profile.id + "/friends?access_token=" + passport.accessToken
      if (confirmed) {
        request(friendlistURL, function(err, res, body) {
          var resData = JSON.parse(body);
          var friends = resData.data;
          // search through friend
          for (var i = 0; i < friends.length; i++) {
            if (friends[i].first_name.toLowerCase() === person.toLowerCase()) {
              var chargeURL = "https://api.venmo.com/v1/payments"

              request.post(chargeURL, {
                form: {
                  access_token: passport.accessToken,
                  user_id: friends[i].id,
                  note: "gimme money",
                  amount: -0.20
                }
              });

              cb(null, 'You sent ' + amount + ' to ' + person);
              return;
            }
          }
        });


      } else {
        cb(null, 'Do you want to send ' + amount + ' to ' + person + '?', true);
      }
    }
  }
}
