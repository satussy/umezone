var Converter = (function( e ){
    var Game = e.Game , Sprite = e.Sprite , Event = e.Event , keyFrameId = 0 ;

    function convert( s ){
        console.log( s);
        var g = new Game( s.width , s.height ) ,
            r = g.rootScene ;

        var maxFrame = 0;

        var keyFrameMap = {};
        var keyFrameEnd = {};
        var activeKey = {};

        s.layer.forEach( function( layer , i ){

            if( !layer ){ return; }
            layer.forEach( function( keyFrame , i ){
                keyFrame.id = keyFrameId++ ;

                var prev ;
                if( i != 0 ){
                    prev = layer[i-1];
                    prev.nextKeyFrame = keyFrame ;
                    //if( prev.isTween ){
                        //keyFrame.elements = prev.elements ;
                    //}
                }



                if( keyFrame.elements.length == 0 ){ return; }

                maxFrame = Math.max( maxFrame , keyFrame.end );

                var s = keyFrame.start ;

                if( !keyFrameMap[ s ] ){
                    keyFrameMap[ s ] = [] ;
                }

                keyFrameMap[ s ].push( keyFrame );


                var end = keyFrame.end ;
                if( !keyFrameEnd[end] ){
                    keyFrameEnd[end] = [];
                }

                keyFrameEnd[end].push( keyFrame );


                keyFrame.elements.forEach( function( e ){
                    if( prev && prev.isTween ){
                        e.sprite = prev.elements[0].sprite;
                        return;
                    }

                    var sprite = e.sprite = new Sprite( e.width , e.height );
                    sprite.moveTo( e.left , e.top );
                    sprite.rotation = e.rotation ;
                    sprite.opacity = e.colorAlphaPercent/100 ;
                    sprite.scaleX = e.scaleX;
                    sprite.scaleY = e.scaleY;

                    var c1 = Math.floor( 255 * Math.random() );
                    var c2 = Math.floor( 255 * Math.random() );
                    var c3 = Math.floor( 255 * Math.random() );
                    sprite.backgroundColor = "rgba( "+[c1,c2,c3,0.1].join(",") + ")";
                });
            });
        });

        g.fps = s.fps || 12 ;

        g.addEventListener( Event.ENTER_FRAME , function(){
            var f = g.frame ;
            if( maxFrame - 1 <= f ){
                return;
                g.frame = 0;
            }

            if( keyFrameEnd[ f-1 ] ){
                keyFrameEnd[ f-1 ].forEach(function(e){
                    delete activeKey[ e.id ];
                    e.elements.forEach( function(e){
                        r.removeChild( e.sprite );
                    });
                });
            }

            var active ;
            for( active in activeKey ){
                if( activeKey[ active ].isTween ){
                    processTween( activeKey[ active ] , f);
                }
            }

            if( keyFrameMap[ f ] ){
                keyFrameMap[f].forEach(function(f){
                    activeKey[ f.id ] = f;
                    f.elements.forEach( function ( e ){
                        r.addChild( e.sprite );
                    });
                });
            }
        });

        function processTween( key , f ){
            //console.log( key );
            var sprite = key.elements[0].sprite , tween = key.tween ;
            for( d in key.tween ){
                //if( !( d == "x" || d == "y" ) ){ continue; }
                sprite[d] += tween[d];
            }
        }


          

      




        return g;
    }





    return {
        convert : convert 
    };
})( enchant );
