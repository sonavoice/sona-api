var _ = require('lodash');
var request = require('request');

module.exports = {
  title: 'Venmo',
  iconURL: 'http://sonavoice.io/api/icon',
  commands: {
    'charge $1 to $2': function(cb, auth, args) {
      var token = auth.accessToken;
      console.log(token)
      var amount = args[0];
      var person = args[1];

      console.log(auth)

      // var friendlistURL = https://api.venmo.com/v1/users/:user_id/friends?access_token=<access_token>
      // "https://api.venmo.com/v1/users/" + passport.profile.id + "/friends?access_token=" + passport.accessToken
      request(friendlistURL, function(err,res, body){
        var resData = JSON.parse(body);
        var friends = resData.data
        // search through friend
        for(var friend in friends) {
          if(friend.first_name.toLowerCase() === person.toLowerCase()) {
            var chargeURL = "https://api.venmo.com/v1/payments"

            request.post(chargeURL, {form: {
              access_token: "",
              user_id: "",
              note: "",
              amount: ""
            }})
          }
        }

      })
    }
  }
}