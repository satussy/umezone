var UIPhaseDraw = (function(){
    var elem = document.querySelector(".phase_draw");

    function show (){ elem.style.display = "block" ; }
    function hide (){ elem.style.display = "none"  ; }

    //default visibility
    hide();
    
    return {
        show : show ,
        hide : hide 
    };
})();
