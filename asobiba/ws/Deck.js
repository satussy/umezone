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
                img.onerror = _onload ;
            }
            
            image_amount++;
        }

        function _onload(){
            image_loaded++;
            onload.apply( this , arguments );
        }
    }


    //広げたときの中央の座標にする
    var  initial_point = null ;
    var selected_index = null ;
    var view_width = 700 ;
    var width = 200 ;

    function initDeckView( point ){
        initial_point = point ;
        var deck = getDeckElement() , cards = deck.querySelectorAll( ".card" ) , length = cards.length ;
        var 
            card_width  = width , 
            left_point  = point - view_width/2 ,
            right_point = left_point + view_width , 
            goal_x      = right_point - card_width ,
            logical_view_width = ( goal_x - left_point ),
            dx          =  logical_view_width / ( length - 1)
        ;


        deck.style.left = (point - card_width/2) + "px" ;

        //初期の選択位置は中央
        var selected_index = Math.floor( length / 2 ) ;

        var i = 0 , n = length , card , temp_x = left_point ;
        for( ; i < n ; i++ ){
            card = cards[i] ;
            //card.style.left = ( left_point + dx * i ) + "px" ;
            card.style.left = ( dx * ( i - selected_index )  ) + "px" ;

            if( i == selected_index ){
                card.style.borderColor = "#F00" ;
            }else{
                card.style.borderColor = "#000" ;
            }
            dir = 0;
            if( i < selected_index ){
                dir = -1 ;
            }else{
                dir = 1 ;
            }
            //card.style.webkitTransform = getTransform( selected_index , i ) ;



        }
    }



    //デッキを表にして、扇状に広げる
    //@param selected_index 選択状態にあるカードの番号
    function updateDeckView( point ){
        return;
        var deck = getDeckElement() , cards = deck.querySelectorAll( ".card" ) , length = cards.length 

        var card_width  = width ,
            left_point  = point - view_width/2 ,
            right_point = left_point + view_width , 
            goal_x      = right_point - card_width ,
            dx          = ( goal_x - left_point ) / ( length - 1)
        ;

        //初期の選択位置は中央
        var selected_index = Math.floor( point / dx ) ;


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
            
            card.style.webkitTransform = getTransform( selected_index , i ) ;
        }
    }

    function getTransform( selected_index , i ){

        var rad = (Math.PI/2) / ( 50 - selected_index - 1 ) * ( i - selected_index ) ;
        console.log( rad );
        
        return "translateX(" + Math.sin( rad ) * 1 + "px)" ;
    }

    //デッキを表にして重ねた状態にする
    function endDeckView( ){
        return;
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


//            setTimeout( function(){
//                if( handlers.onLoad ){ handlers.onLoad( ); }
//            } , 1 );

            function onCardImageLoaded( ){
                if( handlers.onProgress ){
                    handlers.onProgress( this , image_amount , image_loaded );
                }
                
                if( image_loaded < image_amount ){ return; }

                setHTML();


                if( handlers.onLoad ){ handlers.onLoad( ); }
                
            }
        } ,

        startSearch :   initDeckView ,
       updateSearch : updateDeckView ,
          endSearch :    endDeckView ,
        shuffule : shuffule 
    };
})();





var DeckController = ( function(){
function onDeckStart( e ){

    if( e.target.tagName == "BUTTON" ){ return; }
    e.preventDefault(); 

    Deck.startSearch( getInputPositionFromEvent( e ).x );

    document.addEventListener( INPUT_DEVICE_MOVE , onDeckMove , false );
    document.addEventListener( INPUT_DEVICE_END  , onDeckEnd  , false );
}


var prev_index = null ;
function onDeckMove( e ){ 
    e.preventDefault(); 

    Deck.updateSearch(getInputPositionFromEvent(e).x);
}


function onDeckEnd( e ){
    Deck.endSearch( "deck" );

    document.   addEventListener( INPUT_DEVICE_START , onDeckStart , false );
    document.removeEventListener( INPUT_DEVICE_MOVE  , onDeckMove  , false );
    document.removeEventListener( INPUT_DEVICE_END   , onDeckEnd   , false );
}

    document.addEventListener( INPUT_DEVICE_START , onDeckStart , false );



})();
