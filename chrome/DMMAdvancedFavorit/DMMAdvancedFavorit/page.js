(function($){
    var 
        //お気に入り一覧の行を取得
        lists = $( "#mu tr.text" ) ,

        //ページネータのリンクを全部取ってきてURL一覧を生成
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

        //ソート用のコンパレータを生成するナゾのクロージャ
        sorter = (function(){
            //elemで指定された要素(tr)からnum番目のtdを取ってくる
            function getTdAt( elem , num ){
                return $(elem).find( "td" )[num];
            }


            //コンパレータ
            var _sorter = [
                //チェックが入っているかどうかで比較
                function( a , b , order ){
                    a = $(a).find( "input" ).attr( "checked" ) ? 1 : 0 ;
                    b = $(b).find( "input" ).attr( "checked" ) ? 1 : 0 ;
    
                    return order * ( b - a ) ;
                },
                //値段比較
                function( a , b , order ){
                    a = parseInt( $(a).html().replace(",","").match( /[0-9,]*円/ ) );
                    b = parseInt( $(b).html().replace(",","").match( /[0-9,]*円/ ) );

                    return order * ( b - a );
                },

                //タイトル比較
                function( a , b , order ){
                    a = $(a).find( "a" ).html();
                    b = $(b).find( "a" ).html();

                    if( a == b ){
                        return 0;
                    }

                    return order * ( ( b > a ) ? 1 : -1 ) ;
                }
            ];

            //コンパレータを返す関数を返す
            //num   int コンパレータの種類(0:チェックボックス , 1:値段 , 2:タイトル)
            //order int 昇順か降順か
            return function ( num , order ){
                order = order ? 1 : -1 ;
                var s = _sorter[ num ];

                //実際に呼び出されるコンパレータを設定して返す
                return function ( a , b ){
                    a = getTdAt( a , num );
                    b = getTdAt( b , num );

                    return s( a , b , order ); //ここに昇順か降順かが指定できるのがミソ
                };
            };
        })(),

        //表本体
        base = lists.parent() ;
    ;



    //2ページ目移行を取得して連結
    links.each( function ( i , v ){
        $.get( v , function( html ){
            var a = $( getTags( html , "tr" , "text" ).join() );
            a.insertAfter( lists.last() );
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

    //$("#su").click(function(){
    //    $(this).toggleClass( "collapse" );
    //});

    //リストの項目にマウスオーバーしたら、ポップアップパネルに情報をセットして表示
    //初回は必要な情報を取得してくる
    lists.live( "mouseover" , ( function(){
        var hash = localStorage , frame = $('<div id="dmmab_frame"></div>').insertBefore( document.body.firstChild ) , current = null , total = null ;

        return function( e ){
            frame.addClass( "on" );
            var t = $(this) , index , href ;

            href = $(this).find( "a" ).attr("href"); 

            current = index = href ;

            if( !t.hasClass("init") ){
                t.append( '<td nowrap class="star" >&nbsp;</td><td nowrap class="genre" >&nbsp;</td>' );
                t.addClass("init");
            }

            //詳細情報が未取得の場合はLoading表示をしつつ,情報を取得する
            if( !hash[ index ] ){
                $.get( href , function( html , result ){
                    if( result != "success" ){
                        delete hash[ index ] ;
                        return;
                    }


                    try{
                        parseDetail( html, href , t , function( o , star , genre ){
                            $(t).find( ".star"  ).html( star  );
                            $(t).find( ".genre" ).html( genre );


                            hash[ index ] = o ;
                            hash[ "star_"  + index ] = star ;
                            hash[ "genre_" + index ] = genre ;

                            if( current == index ){
                                frame.html( hash[ index ][0] );
                            }
                        });
                    }catch( e ){
                        //console.log("parse error" , e);
                        delete hash[ index ] ;
                        //throw e;
                    }

                });
                hash[ index ] = "loading...";
            }else{
                $(t).find( ".star"  ).html( hash[ "star_"  + index ] );
                $(t).find( ".genre" ).html( hash[ "genre_" + index ] );
            }
            frame.html( hash[ index ] );
        };


        //詳細ページから内容を取得してくる
        function parseDetail( html , href , row , callback ){
            var 
                isAnime   = href.indexOf("anime") >= 0 ,
                isAmateur = href.indexOf("videoc") >= 0 ,
                base   = $( '<div class="dmmab_popup"></div>' ),
                data   = getTags( getTag( html , "table" , "mg-b20" ) , "tr" ) ,

                tagIndex = isAnime || isAmateur ? 6 : 9 ,
                tag    = $( getTags( data[ tagIndex ] , "td" )[1] ).html() ,

                rateIndex = isAnime || isAmateur ? 8 : 11 ,
                rate   = $( getTags( data[ rateIndex ] , "td" )[1] ).find("img")[0] ,
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


            (function( target ){
                var i = 1 , category = isAmateur ? "amateur" : "video" ;

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

                    img.src = "http://pics.dmm.co.jp/digital/"+category+"/" + id + "/" + id + "jp-" + i + ".jpg" ;
                    i++;
                }

                function isEnd( img ){
                    return i > 20 || img.width < 700 ;
                }
            })( images );

            function end(){
                var category = isAmateur ? "amateur" : "video" , postfix = isAmateur ? "jp" : "ps" ;
                base.
                    append( $(rate) ).
                    append( " | " ).
                    append( tag ).
                    append( "<br>" ).
                    append( '<img src="http://pics.dmm.co.jp/digital/'+category+'/' + id + "/" + id + postfix + '.jpg">' ).
                    append( "<br>" ).
                    append( desc ).
                    append( review ).
                    append( '<img src="http://pics.dmm.co.jp/digital/'+category+'/' + id + "/" + id + 'pl.jpg">' ).
                    append( images );

                callback( $("<div></div>").append( base ).html() , $("<span></span>").append( rate ).html() , tag );
            }
        }

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
