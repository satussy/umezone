/*
<div id="deck" ></div>
*/
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
                img.onload  = (function( info ){
                    return function(){
                        _onload.apply( this , [ info ] );
                    };
                })( info ); 
                
                img.onerror = (function( info ){
                    return function(){
                        _onerror.apply( this , [ info ] );
                    };
                })( info );
            }
            
            image_amount++;
        }

        function _onload( info ){
            image_loaded++;
            onload.apply( this , [ info ] );
        }

        function _onerror ( info ){
            info.has_image_error = true;
            _onload.apply( this , [ info ] );
        }
        
    }


    //広げたときの中央の座標にする
    var  initial_point = null ;
    var selected_index = null ;
    var view_width = 700 ;
    var width = 200 ;

    function initDeckView( point ){
        initial_point = point ;
        var deck    = getDeckElement() , 
            cards   = deck.querySelectorAll( ".card" ) , 
            length  = cards.length ,
            card_width         = width , 

            //見た目の左はじの座標
            left_point         = point - view_width/2 ,

            //見た目の右はじの座標
            right_point        = left_point + view_width , 

            //一番右のカードのX座標
            goal_x             = right_point - card_width ,

            //1番左のカードのX座標と1番右のカードのX座標の距離
            logical_view_width = ( goal_x - left_point ),

            //隣り合ったカードのX座標の距離
            dx                 =  logical_view_width / ( length - 1)
        ;


        //デッキをクリック位置を中心になるように置く
        deck.style.left = (point - card_width/2) + "px" ;

        
        //初期の選択位置は中央
        var selected_index = Math.floor( length / 2 ) ;

        var i = 0 , n = length , card , new_x ;
        for( ; i < n ; i++ ){
            card = cards[i] ;

            if( i == selected_index ){
                card.style.borderColor = "#F00" ;
            }else{
                card.style.borderColor = "#000" ;
            }


            new_x = dx * ( i - selected_index );

            card.style.webkitTransform = "translateX("+new_x+"px)";
        }
    }



    //デッキを表にして、扇状に広げる
    //@param selected_index 選択状態にあるカードの番号
    function updateDeckView( point ){
        var deck    = getDeckElement() , 
            cards   = deck.querySelectorAll( ".card" ) , 
            length  = cards.length ,
            card_width         = width , 

            //見た目の左はじの座標
            left_point         = initial_point - view_width/2 ,

            //見た目の右はじの座標
            right_point        = left_point + view_width , 

            //一番右のカードのX座標
            goal_x             = right_point - card_width ,

            //1番左のカードのX座標と1番右のカードのX座標の距離
            logical_view_width = ( goal_x - left_point ),

            //隣り合ったカードのX座標の距離
            dx                 =  logical_view_width / ( length - 1)
        ;

        //初期の選択位置は中央
        var selected_index = Math.max( 0 , Math.min( length - 1 , Math.floor( ( point - left_point ) / dx ) ) );


        var i = 0 , n = cards.length , card , dir , deg , style ;
        for( ; i < n ; i++ ){
            card = cards[i] ;

            if( i == selected_index ){
                card.style.borderColor = "#F00" ;
                new_y = 100 ;
            }else{
                card.style.borderColor = "#000" ;
                new_y = 0 ;
            }

            if( i >= selected_index ){
                dir =  1 ;
            }else{
                dir = -1 ;
            }

            new_x = ( 
                dir * Math.log( 1 + Math.abs( i - selected_index ) * 10 ) * 3 + 
                ( i - Math.floor( length/2) ) 
            ) * dx ;

            deg = ( 
                dir * Math.log( 1 + Math.abs( i - selected_index ) ) + 
                ( i - Math.floor( length/2) ) 
            ) * 0.2 ;


            //card.style.webkitTransform = "rotate(" + deg + "deg) translateX(" + new_x + "px) translateY(-"+new_y+"px)";
            card.style.webkitTransform = "translateX("+new_x+"px) translateY(-"+new_y+"px)";
            //card.style.webkitTransform = "rotate("+new_x+"deg)";
        }
    }

    function getTransform( selected_index , i , left_point , right_point , card_amount ){

        var rad = (Math.PI/2) / ( card_amount - selected_index - 1 ) * ( i - selected_index ) ;
        return "translateX(" + Math.sin( rad ) * 350 + "px)" ;
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
        var list = getDeckList() , i , n , info , deck = getDeckElement() ;

        for( i = 0 , n = list.length ; i < n ; i++ ){
            info = list[i] ;

            deck.appendChild( info.elem );
        }
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
        //@param handlers event handler { onProgress , onLoad }  
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

                var html = [] , list = getDeckList() , i , n , info , deck = getDeckElement() , elem ;
                for( i = 0 , n = list.length ; i < n ; i++ ){
                    list[i].id = i ;
                    info = list[i].master ;
                    elem = document.createElement( "div" );
                    elem.className = "card" ;
                    if( info.has_image_error ){
                        elem.innerHTML = '<img src="card.gif">' ;
                    }else{
                        elem.innerHTML = '<img src="'+ImagePath.small( info )+'">' ;
                    }

                    elem.info = list[i];
                    list[i].elem = elem ;
                }

                setHTML();


                if( handlers.onLoad ){ handlers.onLoad( ); }
                
            }
        } ,

        startSearch :   initDeckView ,
       updateSearch : updateDeckView ,
          endSearch :    endDeckView ,
           shuffule : shuffule ,
               draw : function (){
                   var info = getDeckList().pop();
                   info.elem.setAttribute( "style" , "" );
                   info.elem.parentNode.removeChild( info.elem );

                   //デッキが表示状態の場合は再描画が必要だけど
                   //ここではいわゆるデッキからのドローを想定しているので
                   //単純にトップから1枚わたす
                   return  info;
                } ,
        //選択中の1枚を抜いて返す
        drawSelected : function (){
            throw new Exception( "まだむりぽ" );
        },
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

    //document.addEventListener( INPUT_DEVICE_START , onDeckStart , false );



})();
