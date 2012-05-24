//object to handle phase changing and update views
function PhaseChangeHandler(){
    //I dont wanna write this any more !
    var t = this ;

    ///////////////////////////////////////////
    // regist commands
    //_________________________________________
    t[ Phase.PHASE_INITIAL ] = handleInitialPhase ;
    t[ Phase.PHASE_MARIGAN ] = handleMariganPhase ;
    t[ Phase.PHASE_DRAW    ] = handleDrawPhase ;
    t[ Phase.PHASE_CLOCK   ] = handleClockPhase ;

    ///////////////////////////////////////////
    // command implementations
    //_________________________________________



    // initializing phase command
    function handleInitialPhase( e ){
        Application.decideFirstPlayer();
        UIPhaseInitial.label = "First player is " + (Application.firstPlayer==Application.PLAYER_INDEX_A?"A":"B") + "!" ;
        UIPhaseInitial.show();
    }


    function handleMariganPhase( e ){
        UIPhaseInitial.hide();
        UIPhaseMarigan.show();
        Hand.startSelectMode( );
    }


    // draw phase
    function handleDrawPhase( e ){
        UIPhaseMarigan.hide();
        UIPhaseDraw.show();
    }


    function handleClockPhase( e ){
        UIPhaseDraw.hide();
        UIPhaseClock.show();
    }
}
