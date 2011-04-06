(function($){
    var lists = $( "#mu tr.text" ) ,
        links = $( "#mu td > a").map( (function(){
            var hash = {};
            return function( i , elem ){
                var href = elem.href ;
                if( href.indexOf("/bookmark/=/page=" ) >= 0 && href.indexOf( "#" ) < 0 ){
                    if( hash[ href ] ){
                        return null;
                    }else{
                        hash[ href ] = true ;
                        return href ;
                    }
                }
                return null;
            }
        })() ) ,
        sorter = (function(){
            function getTdAt( elem , num ){
                return $(elem).find( "td" )[num];
            }

            var _sorter = [
                function( a , b , order ){
                    a = $(a).find( "input" ).attr( "checked" ) ? 1 : 0 ;
                    b = $(b).find( "input" ).attr( "checked" ) ? 1 : 0 ;
    
                    return order * ( b - a ) ;
                },
                function( a , b , order ){
                    a = parseInt( $(a).html().replace(",","").match( /[0-9,]*円/ ) );
                    b = parseInt( $(b).html().replace(",","").match( /[0-9,]*円/ ) );

                    return order * ( b - a );
                },
                function( a , b , order ){
                    a = $(a).find( "a" ).html();
                    b = $(b).find( "a" ).html();

                    if( a == b ){
                        return 0;
                    }

                    return order * ( ( b > a ) ? 1 : -1 ) ;
                }
            ];

            return function ( num , order ){
                order = order ? 1 : -1 ;
                var s = _sorter[ num ];
                return function ( a , b ){
                    a = getTdAt( a , num );
                    b = getTdAt( b , num );

                    return s( a , b , order );
                };
            };
        })(),
        base = lists.parent() ;
    ;

    links.each( function ( i , v ){
        $.get( v , function( html ){
            var a = getTags( html , "tr" , "text" ).join() ;
            $( a ).insertAfter( lists.last() );
        });
    });





    function getTags(html, tagName, className){
        var cls = "";
        if(className){
            cls = "[^>]*?class=\"" + className + "\"";
        }
        var reg = new RegExp("<" + tagName + cls + "(\\s|.)*?>([^<]*)</" + tagName + ">", "ig");
        return html.match(reg);
    }

    function getTag(html, tagName, className){
        var tags = getTags(html, tagName, className);
        return (tags && tags.length) ? tags[0] : "";
    }

    function getTagText(html, tagName, className){
        return getTag(html, tagName, className) ? RegExp.$2 : "";
    }


    //Setting for UI
    base.addClass( "dmmab_base" );

    $("#su").click(function(){
        $(this).toggleClass( "collapse" );
    });

    lists.live( "mouseover" , ( function(){
        var hash = {} , frame = $('<div id="dmmab_frame"></div>').insertBefore( document.body.firstChild ) , current = null , total = 0;
        function parseDetail( html , href , row , callback ){
            var base   = $( '<div class="dmmab_popup"></div>' ),
                data   = getTags( getTag( html , "table" , "mg-b20" ) , "tr" ) ,
                tag    = $( getTags( data[ 9] , "td" )[1] ).html() ,
                rate   = $( getTags( data[11] , "td" )[1] ).find("img")[0] ,
                id     = href.split("=").pop().replace("/" , "" ) ,
                desc   = $( getTags( html , "div" , "mg-b20 lh4" )[0] ) , 
                images = $( "<span></span>" ) ,
                review_h = getTags( html , "div" , "bg-yel group" ) ,
                review_b = getTags( html , "div" , "wrap-desc" ) ,
                review = (function(){
                    if( review_h == null || review_b == null ){ return ""; }
                    var html=[] , i , n ;
                    for( i = 0 , n = review_h.length ; i < n ; i++ ){
                        html.push(
                            review_h[i] + review_b[i] 
                        );
                    }

                    return html.join("");
                })()
            ;


            $(row).find( ".star"  ).html( $("<span></span>").append( rate ).html() );
            $(row).find( ".genre" ).html( tag );


            (function( target ){
                var i = 1 ;

                insert();

                function insert(){
                    var img = new Image();
                    img.onload = function (){
                        if( isEnd( img ) ){
                            end();
                        }else{
                            insert();
                            target.append( $(img) );
                        }
                    };
                    img.onerror   = end;
                    img.onabort   = end;
                    img.oninvalid = end;

                    img.src = "http://pics.dmm.co.jp/digital/video/" + id + "/" + id + "jp-" + i + ".jpg" ;
                    i++;
                }

                function isEnd( img ){
                    return i > 20 || img.width < 700 ;
                }
            })( images );

            function end(){
                base.
                    append( $(rate) ).
                    append( " | " ).
                    append( tag ).
                    append( "<br>" ).
                    append( '<img src="http://pics.dmm.co.jp/digital/video/' + id + "/" + id + 'ps.jpg">' ).
                    append( '<img src="http://pics.dmm.co.jp/digital/video/' + id + "/" + id + 'pm.jpg">' ).
                    append( "<br>" ).
                    append( desc ).
                    append( review ).
                    append( '<img src="http://pics.dmm.co.jp/digital/video/' + id + "/" + id + 'pl.jpg">' ).
                    append( images );

                callback( $("<div></div>").append( base ).html() );
            }
        }

        return function( e ){
            frame.addClass( "on" );
            var t = $(this) , index , href ;

            if( t.attr( "index" ) == null ){
                t.attr( "index" , total );
                total++;
            }

            current = index = t.attr( "index" );

            if( !hash[ index ] ){
                t.append( '<td nowrap class="star" >&nbsp;</td><td nowrap class="genre" >&nbsp;</td>' );
                href = $(this).find( "a" ).attr("href"); 
                $.get( href , function( html , result ){
                    if( result != "success" ){
                        hash[ index ] = null ;
                        return;
                    }

                    try{
                        parseDetail( html, href , t , function( o ){
                            hash[ index ] = o ;
                            if( current == index ){
                                frame.html( hash[ index ] );
                            }
                        });
                        localStorage[ href ] = html ;
                    }catch( e ){
                        console.log("parse error");
                        hash[ index ] = null;
                    }

                });
                hash[ index ] = "loading...";
            }
            frame.html( hash[ index ] );
        };
    })() ).live( "mouseout" , function(){
        $("#dmmab_frame").removeClass( "on" );
    });


    $( "#mu td.table-hc.center" ).map(function(i,v){
        v.setAttribute("cmd",i);
        return v;
    }).parent().click( function(event){
        var t = $(event.target) ,
            cmd = t.attr( "cmd" ) ,
            order = t.hasClass( "asc" ) ? "desc" : "asc" ,
            s ; 

        $(t).parent().find( "td" ).removeClass( "asc" ).removeClass( "desc" );
        $(t).addClass( order );

        var s = sorter( cmd , order == "desc" );
        var base = $(t).parent().parent() ,
            row = $(base).find( "tr.text" ).remove().sort( s );
        $( row ).insertAfter( $(t).parent() );
    }).append( '<td nowrap class="table-hc center">&nbsp;</td><td nowrap class="table-hc center">&nbsp;</td>' );

})( jQuery );
