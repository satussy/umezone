/*
<!-- 
#####################################################################################
ハンド周りのHTML
#####################################################################################
-->
<div id="hand"></div>
 */
//TODO
//  sort
var Hand = (function(){
    var list = [] , elem ;

    function getList(){ return list ; }
    function getElement(){ return elem ; }


    function clearSelection (){
        list.forEach( function ( info ) {
            info.elem.classList.remove( "selected" );
        } );
    }


    
    var currentCard = null ;
    function onMouseMove( e ){
        e.preventDefault(); 
        var targetCard = e.target.parentNode ;
        if( currentCard != targetCard ){
            if( currentCard ){
                currentCard.style.border = "" ;
            }
            targetCard.style.border = "5px solid #F00" ;


            currentCard = targetCard ;
        }
    }

    function onMouseUp( e ){
        elem.removeEventListener( "mousemove" , onMouseMove , false );
        elem.removeEventListener( "mouseup"   , onMouseUp   , false );
        if( currentCard ){
            currentCard.style.border = "";
        }

    }
    function onMouseDown( e ){
        e.preventDefault(); 
        var t = e.target.parentNode ;
        if( !isCard( t ) ){ return; }

        if( is_single_select_mode ){
            clearSelection();
        }
        t.classList.toggle("selected");
        //elem.addEventListener( "mousemove" , onMouseMove , false );
        //elem.addEventListener( "mouseup"   , onMouseUp   , false );
    }

    return {
        get   elem(){ return getElement(); } ,
        get length(){ return list.length ; } ,

        init : function( id ){
            elem = document.getElementById( id );
        } ,

        //add a card which is expected to draw from deck to hand 
        //@param info normally return value of Deck.draw
        add : function( info ){
            info.elem.classList.add("flip");
            getList().push( info );
        } ,

        show : function(){
            var e = getElement() , list = getList() , i , n , info ;
            for( i = 0 , n = list.length ; i < n ; i++ ){
                info = list[i];
                if( info.elem.classList.contains( "flip" ) ){
                    e.appendChild( info.elem );
                }
            }

            setTimeout( function(){
                for( i = 0 , n = list.length ; i < n ; i++ ){
                    info = list[i];
                    info.elem.classList.remove( "flip" );
                }
            } , 10 );
        } , 

        hide : function(){
            var e = getElement() ;
            e.style.display = "none";

        } ,
        
        startSelectMode: function ( _is_single_select_mode ) { 
            clearSelection();
            is_single_select_mode = _is_single_select_mode ;
            elem.addEventListener( INPUT_DEVICE_START , onMouseDown, false ); 
        } , 
        endSelectMode: function () { 
            elem.removeEventListener( INPUT_DEVICE_START , onMouseDown, false ); 
        } ,
        
        getSelectedCard: function(){
            var list = [] , selected = elem.querySelectorAll( ".selected" );
            for( var i = 0  , n = selected.length ; i < n ; i++ ){
                list.push( selected[i].info );
            }

            return list ;
        } ,

        clearSelection : clearSelection ,

        drop : function ( info ){
            for( var list = getList() , i = 0 , n = list.length ; i < n ; i++){
                if( info.id == list[i].id ){
                    list.splice( i , 1 );
                    leaveNode( info.elem );
                    return info ;
                }
            }
            
            throw new Error( "Hand: no such card id:" + info.id );
        } ,
    
        play : function( i ){

        }
    };
})();
