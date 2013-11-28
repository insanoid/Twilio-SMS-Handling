//
//Node.js client to read SMS through Twilio (URL call back for SMS configured) and then responds back with an appropriate answer from Wolfram ALpha
//

var express = require("express");
var app = express();
var restler = require('restler');
var url = require('url');

app.use(express.logger());
var wolfram = require('wolfram-alpha').createClient("4EU37Y-TX9WJG3JH3", null);

var port = process.env.PORT || 5001;
app.listen(port, function() {
    console.log("Client listening on " + port);
});

app.all('/', function(request, response) {

    var url_parts = url.parse(request.url, true);
    var query_string = url_parts.query;
    var sms_query = query_string.Body; // The SMS message which can be reused for any purpose.

    wolfram.query(sms_query, function (err, result) {
        if (err){
            throw err;
        }

        var response_string = "<Response><Sms>";
        if(result.length){
            if(result[1]){
                if(result[1].subpods[0]){
                    response_string = response_string + result[1].subpods[0].text;
                } else{
                    response_string = response_string + result[0].subpods[0].text;
                }
            }else{
                response_string = response_string + result[0].subpods[0].text;
            }
        }else{
            response_string = response_string + "An answer was not found";
        }
        response.send(response_string + "</Sms></Response>"); //A response is sent back to Twilio.
    });
});
