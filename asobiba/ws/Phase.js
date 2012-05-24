//return
var Phase = (function(){
    var ///////////////////////////////////////////
        // STATIC
        //_________________________________________

        PHASE_INITIAL = "phase_init"    ,
        PHASE_MARIGAN = "phase_marigan" ,
        PHASE_STAND   = "phase_stand"   ,
        PHASE_DRAW    = "phase_draw"    ,
        PHASE_CLOCK   = "phase_clock"   ,
        PHASE_MAIN    = "phase_main"    ,
        PHASE_CRIMAX  = "phase_crimax"  ,
        PHASE_BATTLE  = "phase_battle"  ,
        PHASE_END     = "phase_end"     ,


        ///////////////////////////////////////////
        //
        //_________________________________________
        current_state = null 
    ;
    var phase_change_map = { };
        phase_change_map[ PHASE_INITIAL ] = PHASE_MARIGAN ;
        phase_change_map[ PHASE_MARIGAN ] = PHASE_DRAW    ;
        phase_change_map[ PHASE_DRAW    ] = PHASE_CLOCK   ;
        phase_change_map[ PHASE_CLOCK   ] = PHASE_MAIN    ;
        phase_change_map[ PHASE_MAIN    ] = PHASE_BATTLE  ;
        phase_change_map[ PHASE_BATTLE  ] = PHASE_END     ;
        phase_change_map[ PHASE_END     ] = PHASE_STAND   ;


    function end(){
        var old_state = current_state ;
        if( !current_state ){
            current_state = PHASE_INITIAL ;
        }else{
            current_state = phase_change_map[ current_state ];
        }

        this.dispatchEvent( PhaseEvent.new( current_state , old_state ) );
    }





    return mix( new CustomEventTarget("phase") , {
        init: function(){
            current_state = null ;
            this.end();

        } ,
        end : end ,

        PHASE_INITIAL : PHASE_INITIAL ,
        PHASE_MARIGAN : PHASE_MARIGAN ,
        PHASE_STAND   : PHASE_STAND   ,
        PHASE_DRAW    : PHASE_DRAW    ,
        PHASE_CLOCK   : PHASE_CLOCK   ,
        PHASE_MAIN    : PHASE_MAIN    ,
        PHASE_CRIMAX  : PHASE_CRIMAX  ,
        PHASE_BATTLE  : PHASE_BATTLE  ,
        PHASE_END     : PHASE_END     ,

        isInitialize   : function (){ return current_state == PHASE_INITIAL; } ,
        isMarigan      : function (){ return current_state == PHASE_MARIGAN; } ,
        isDraw         : function (){ return current_state == PHASE_DRAW   ; } ,
        isClock        : function (){ return current_state == PHASE_CLOCK  ; } ,
        isMain         : function (){ return current_state == PHASE_MAIN   ; } ,
        isBattle       : function (){ return current_state == PHASE_BATTLE ; } ,
        isEnd          : function (){ return current_state == PHASE_END    ; }
    } );




})();
