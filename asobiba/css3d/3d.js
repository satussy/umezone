function q( selector , elem ){ return (elem || document).querySelectorAll( selector ); }

var magic_spel = q( "#magic_spel" )[0];

decorate( magic_spel );



function decorate( div ){
    
    var base_w = div.offsetWidth  ;
    var base_h = div.offsetHeight ;

    circlize( q( ".c1" , div )[0] , base_w/2 -  40 );
    circlize( q( ".c2" , div )[0] , base_w/2 -  80 );
    circlize( q( ".c3" , div )[0] , base_w/2 - 120 );
    


    function circlize( div , radius ){
        var text = div.innerHTML.split("");
        text = text.map( function( elem , index ){
            return '<div class="char">' + elem + "</div>" ;
        } );

        div.innerHTML = '<div class="inner">' + text.join("") + "</div>" ;

        var list = q( ".char" , div );

        for( i = 0 , n = list.length ; i < n ; i++ ){
            elem = list[ i ];
            initPositionAt( elem , i , n );


            var deg = 360 / n * i ;
            elem.style.webkitTransform = "rotateZ("+deg+"deg) translateY( -"+radius+"px) " ;
        } 
    }
    
    
    function initPositionAt( elem , index , total ){
        var w , h ;
        
        w = elem.offsetWidth  ;
        h = elem.offsetHeight ;

        var x = ( base_w - w ) / 2 ;
        var y = ( base_h - h ) / 2 ;

        elem.style.left = x + "px" ;
        elem.style.top  = y + "px" ;

    }
}
    
    

document.addEventListener( "mousemove" , function(e){
    magic_spel.style.webkitPerspective = e.clientX/10 ;




} , false );
