var util         = require('util');
var EventEmitter = require('eventemitter3');
var Promise      = require('promise-es6').Promise;
var Gitter       = require( 'node-gitter' );

/**
 * Provides facade interface for dealing with Gitter API
 *
 * @param {String} token - Gitter API token
 * @constructor
 */
function GitterClient( token ){
    EventEmitter.call(this);

    this._gitter = new Gitter( token );
}

GitterClient.POST_MESSAGE_EVENT = 'post:message';

util.inherits( GitterClient, EventEmitter );

GitterClient.prototype._onPostMessage = function( user, message ){
    var model = message.model,
        text  = ( model.text || "" ).trim(),
        payload;

    // don't process empty strings
    if ( ! text ){
        return;
    }

    //don't process own messages
    if ( user.id === model.fromUser.id ){
        return;
    }

    // process only new message
    if ( model.editedAt ){
        return;
    }

    // prepare payload data
    payload = {
        text: text,
        responseText: null
    };

    this.emit( GitterClient.POST_MESSAGE_EVENT, payload );

    if ( payload.responseText ){
        this._room.send( payload.responseText );
    }
};

GitterClient.prototype._onJoin = function( data ){
    var user = data[0],
        room = data[1];

    console.info( "Gitter-bot has joined to '%s' room as '%s'", room.name, user.username );

    room.subscribe();
    room.on( "chatMessages", this._onPostMessage.bind(this, user) );

    this._room = room;
};

GitterClient.prototype._onError = function( error ){
    console.error( "Gitter API: ", error );
};

GitterClient.prototype.join = function( room ){
    if ( this._room ){
        console.error( "You has already join to room" );
        return;
    }

    Promise.all( [this._gitter.currentUser(), this._gitter.rooms.join( room )] )
           .then( this._onJoin.bind(this) )
           .catch( this._onError.bind(this) );
};

GitterClient.prototype.leave = function(){
    if ( this._room ){
        this._room.removeAllListeners( "chatMessages" );
        this._room.unsubscribe();

        delete this._room;
    }
};

module.exports = GitterClient;