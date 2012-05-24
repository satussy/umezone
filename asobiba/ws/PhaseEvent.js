var PhaseEvent = (function(){
    var CHANGE = "phaseChange" ;
    return {
        CHANGE : CHANGE ,

        new : function ( new_phase , old_phase ){
            var e = document.createEvent("CustomEvent");
            e.initCustomEvent( "phaseChange" , true , true );

            e.newPhase = new_phase ;
            e.oldPhase = old_phase ;

            return e;
        }
    };
})();
