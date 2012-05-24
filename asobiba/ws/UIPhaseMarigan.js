var UIPhaseMarigan = (function(){
    var elem = document.querySelector(".phase_marigan");

    function show (){ elem.style.display = "block" ; }
    function hide (){ elem.style.display = "none"  ; }

    //default visibility
    hide();
    
    return {
        show : show ,
        hide : hide 
    };
})();
