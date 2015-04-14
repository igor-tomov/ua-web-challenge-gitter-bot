var config        = require( './config' );
var GitterClient  = require( './gitter-client' );
var MessageParser = require( './message-parser' );

// init input data
var args = process.argv.slice( 2 );

var room  = args[0],
    token = args[1] || config.apiToken;

// instantiate necessary objects
var client = new GitterClient( token );
var parser = new MessageParser( config.parser );

// pass incoming messages through expression parser
client.on( GitterClient.POST_MESSAGE_EVENT, function( payload ){
    var result = parser.feed( payload.text );

    if ( result ){
        payload.responseText = payload.text + " = " + result;
    }
});

// Connect to room
client.join( room );