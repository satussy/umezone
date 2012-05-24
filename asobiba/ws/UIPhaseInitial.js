//ui for decide first player
var UIPhaseInitial = (function(){
    var doc = document ,
        elem = doc.querySelector( ".phase_init" );


    //label
    var labelElem = null ;
    function getLabelElement(){
        if( !labelElem ){
            labelElem = elem.querySelector(".label");
        }

        return labelElem ;
    }


    function show (){ elem.style.display = "block" ; }
    function hide (){ elem.style.display = "none"  ; }


    //default visibility
    hide();

    return {
        show : show ,
        hide : hide ,
        //label update
        set label ( text ){
            getLabelElement().innerText = text ;
        } ,
        set labelHTML ( html ){
            getLabelElement().innerHTML = html ;
        }
    };
} )();

