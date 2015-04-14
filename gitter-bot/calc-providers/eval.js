function EvalProvider(){}

EvalProvider.prototype = {
    constructor: EvalProvider,

    calculate: function( expr ){
        try{
            return eval( expr );
        }catch ( e ){
            console.warn( "MessageParser._eval: ", e );
            return this.INVALID_MSG;
        }
    }
};

module.exports = EvalProvider;