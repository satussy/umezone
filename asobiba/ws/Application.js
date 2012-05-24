//Application controller 
var Application = (function(){

    var INITIAL_HAND_COUNT = 5 ,
        CLOCK_DRAW_COUNT = 2 ;

    
    // singleton is enough
    var phaseHandler = new PhaseChangeHandler();
    
    // join PhaseChangeHandler and event handler
    function onPhaseChange( e ){
        console.log( e.oldPhase + " -> " + e.newPhase );
        //command pattern
        phaseHandler[ e.newPhase ]( e );
    }


    ///////////////////////////////////////////
    // Application logic
    //_________________________________________

    // player info
    var //const
        PLAYER_INDEX_A = 0 , 
        PLAYER_INDEX_B = 1 ,

        //
        playerA , 
        playerB ,

        // index of first player
        firstPlayer = null ;

    // decide first player
    // should be asyncronious ?
    function decideFirstPlayer(){
        firstPlayer = (Math.random() * 100 > 50) ? PLAYER_INDEX_A : PLAYER_INDEX_B ;
    }

    ///////////////////////////////////////////
    // public
    //_________________________________________
    return mix( new CustomEventTarget("application") , {
        PLAYER_INDEX_A : PLAYER_INDEX_A , 
        PLAYER_INDEX_B : PLAYER_INDEX_B ,
        get firstPlayer () {
            return firstPlayer ;
        },
        start : function( playerAData , playerBData ){

            playerA = { deck : playerAData };

            //to use event bubbling mechanism
            //EventTarget must be child document
            document.documentElement.appendChild( this.eventTarget );
            
            //and make phase event target child
            this.appendChild( Phase.eventTarget );

            //Debug
            //listen all event
            this.addEventListener( PhaseEvent.CHANGE , onPhaseChange , false );

            Phase.init();
        } ,

        decideFirstPlayer : function(){
            if( !Phase.isInitialize() ){
                throw new Error( "Application.setFirstPlayer can be called in initializing phase" );
            }
            decideFirstPlayer();
        } ,

        agreePlayerOrder : function () {
            if( !Phase.isInitialize() ){
                throw new Error( "Application.setFirstPlayer can be called in initializing phase" );
            }
            Deck.init( "deck" , playerA.deck , { onLoad : function(){
                Deck.shuffule();
                for( var i = 0 , n = INITIAL_HAND_COUNT ; i < n ; i++){
                    Hand.add( Deck.draw() );
                }
                Hand.show();
                Phase.end();
            } } );
            Hand.init( "hand" );
        } ,

        endMarigan : function( ){
            if( !Phase.isMarigan() ){
                throw new Error( "Application.endMarigan can be called in marigan phase" );
            }
            var list = Hand.getSelectedCard();
            for( var i = 0 , n = list.length ; i < n ; i++ ){
                BackYard.add( Hand.drop( list[i] ) );
                Hand.add( Deck.draw() );
            }
            
            Hand.show();

            Phase.end();
        } ,
        endDraw : function( ){
            Hand.add( Deck.draw() );
            Hand.show();
            Phase.end();
        } ,

        endClock : function( ){
            var selected = Hand.getSelectedCard();
            if( selected.length >= 1 ){
                if( selected.length != 1 ){
                    throw new Error( "Application.endClock clocked card is just one card. " + selected.length + " cards were selected." );
                    return;
                }

                BackYard.add( Hand.drop( selected[0] ) );
                for( var i = 0 , n = CLOCK_DRAW_COUNT ; i < n ; i++){
                    Hand.add( Deck.draw() );
                }

                Hand.show();
            }

            Phase.end();
        } ,
    } );
})();
