var UIPhaseClock = (function(){
    var elem = document.querySelector(".phase_clock");

    function show (){ elem.style.display = "block" ; }
    function hide (){ elem.style.display = "none"  ; }

    //default visibility
    hide();
    
    return {
        show : show ,
        hide : hide ,
        startClock : function () {
            elem.querySelector(".announce").style.display = "none"  ;
            elem.querySelector(".select"  ).style.display = "block" ;
            Hand.startSelectMode(1);
        },
        doClock : function (){
            Hand.endSelectMode();
            Application.endClock();
        },
        skipClock : function (){
            Hand.endSelectMode();
            Hand.clearSelection();
            Application.endClock();
        }
    };
})();
