var Deck = (function(){
    var deck_element , deck_list , image_amount = 0 , image_loaded = 0 ;

    function getDeckElement(      ){ return deck_element ; }
    function setDeckElement( deck ){ deck_element = deck ; }

    function getDeckList(      ){ return deck_list ; }
    function setDeckList( list ){ deck_list = list ; }

    function loadImage( list , onload ){
        var id , img , info ;
        
        for( id in list ){
            info = list[id];
            if( isNaN( id ) ){ continue; }
            img = new Image();
            img.src = ImagePath.small( info );
            
            if( onload ){
                img.onload = _onload ;
            }
            
            image_amount++;
        }

        function _onload(){
            image_loaded++;
            onload.apply( this , arguments );
        }
    }



    //デッキを表にして、扇状に広げる
    //@param selected_index 選択状態にあるカードの番号
    function startDeckView( selected_index ){
        var deck = getDeckElement() , cards = deck.querySelectorAll( ".card" );

        var i = 0 , n = cards.length , card , dir , deg , style ;
        for( ; i < n ; i++ ){
            card = cards[i] ;

                  if( i > selected_index ){
                dir =  1 ;
            }else if( i < selected_index ){
                dir = -1 ;
            }else{
                dir =  0 ;
            }
            
            deg = dir * Math.log( 1 + Math.abs( selected_index - i ) );
            
            style = "rotate(" + deg + "deg)";
            if( dir == 0 ){
                style += " translateY( -100px )" ;
            }
            
            card.style.webkitTransform = style ;
        }
    }

    //デッキを表にして重ねた状態にする
    function endDeckView( ){
        var deck = getDeckElement() , cards = deck.querySelectorAll( ".card" );


        var i = 0 , n = cards.length , card , dir , deg , style ;
        for( ; i < n ; i++ ){
            card = cards[i] ;

            card.style.webkitTransform = "rotate( 0 )" ;
        }
    }


    // copy & paste http://la.ma.la/blog/diary_200608300350.htm
    function shuffule( redraw ){
        var list = getDeckList() , i = list.length , j , t ;

        while(i){
            j = Math.floor(Math.random()*i);
            t = list[--i];
            list[i] = list[j];
            list[j] = t;
        }



        if( redraw ){ setHTML(); }
        return list;
    }

    function setHTML( ){
        var html = [] , list = getDeckList() , i , n , info ;
        for( i = 0 , n = list.length ; i < n ; i++ ){
            info = list[i].master ;

            html.push( '<div class="card"><img src="'+ImagePath.small( info )+'"></div>' );
        }

        getDeckElement().innerHTML = html.join("\n");
    }

    return {
        get elem ( ) { return getDeckElement(); } ,
        set elem (e) { setDeckElement( e ); } ,

        get list ( ) { return getDeckList() } ,
        set list (l) { setDeckList( l ); } ,

        get visible ( ){ return getDeckElement().style.display != "none" ; } ,
        set visible (b){ return getDeckElement().style.display = b ? "block" : "none" ; } ,

        get count() { return getDeckList().length ; } ,

        //@param list 北ちーのツールから出力されたJSONをparseしたもの
        init : function( deck_id , list , handlers ){
            var deck_element = document.getElementById( deck_id ) , i , l = [] , info ;

            for( id in list ){
                info = list[id];
                if( isNaN( id ) ){ continue; }
                
                for( i = 0 ; i < info.recipe ; i++ ){
                    l.push( { master : info } );
                }
            }

            
            handlers = handlers || {} ;
            
            setDeckElement( deck_element );
            setDeckList( l );

            loadImage( list,onCardImageLoaded );

            function onCardImageLoaded( ){
                if( handlers.onProgress ){
                    handlers.onProgress( this , image_amount , image_loaded );
                }
                
                if( image_loaded < image_amount ){ return; }

                setHTML();


                if( handlers.onLoad ){ handlers.onLoad( ); }
                
            }
        } ,

        startSearch : startDeckView ,
          endSearch :   endDeckView ,
        shuffule : shuffule 
    };
})();





var DeckController = ( function(){
function onDeckStart( e ){

    if( e.target.tagName == "BUTTON" ){ return; }
    e.preventDefault(); 

    var deck = Deck.elem , pos = getInputPositionFromEvent( e );

    deck.style.left = pos.x - ( deck.offsetWidth  ) /2 + "px" ;
    deck.style.top  = pos.y - ( deck.offsetHeight ) /2 + "px" ;

    Deck.startSearch( getSelectedIndex( window.innerWidth , getInputPositionFromEvent( e ).x , 50 ) );

    document.addEventListener( INPUT_DEVICE_MOVE , onDeckMove , false );
    document.addEventListener( INPUT_DEVICE_END  , onDeckEnd  , false );
}


var prev_index = null ;
function onDeckMove( e ){ 
    e.preventDefault(); 

    var w = window.innerWidth , x = getInputPositionFromEvent(e).x , index = getSelectedIndex( w,x,50 );

    if( prev_index != index ){
        Deck.startSearch( index );

        prev_index = index ;
    }
}

function getSelectedIndex( w , x , max ){
    var range = 300/max , distance = x - w/2 , index = Math.floor( distance/range ) ;

    if( index < 0 ){
        index = 0 ;
    }else if( max < index ){
        index = max ;
    }

    return index ;
}

function onDeckEnd( e ){
    Deck.endSearch( "deck" );

    document.   addEventListener( INPUT_DEVICE_START , onDeckStart , false );
    document.removeEventListener( INPUT_DEVICE_MOVE  , onDeckMove  , false );
    document.removeEventListener( INPUT_DEVICE_END   , onDeckEnd   , false );
}

    document.addEventListener( INPUT_DEVICE_START , onDeckStart , false );



})();
