// ==UserScript==
// @name           showStartsOnDmmList
// @namespace      umezo.tsuyabu.in
// @include        http://www.dmm.co.jp/digital/videoa/-/list/=/article=series/id=9874/
// ==/UserScript==
    if( location.href.indexOf("list") < 0 ){ return ; }
    var GET = "GET" ;
	var doc = document ;
    var imgRegExp = new RegExp( "<img(\\s|.)*?([^<]*)>" , "ig")
    var PlainHTMLUtil = (function(){
        function getTags(html, tagName, id){
            var cls = "";
            if(id){
                cls = "[^>]*?id=\"" + id + "\"";
            }
            var reg = new RegExp("<" + tagName + cls + "(\\s|.)*?>([^<]*)</" + tagName + ">", "ig");
            return html.match(reg);
        }

        function getTag(html, tagName, className){
            var tags = getTags(html, tagName, className);
            return (tags && tags.length) ? tags[0] : "";
        }

        return {
            getTags : getTags ,
            getTag  : getTag
        };
    })();

    var DefaultListView = (function(){
        return {
            linkSelector : "div.bx-cont > table div.tl-3 a" ,
            isValidLink : function( href ){
                return href.indexOf( "detail" ) < 0 ;
            } ,
            insertStar : function ( elem , img ){
                $( elem ).append( img );
            } ,
            insertSample : function () {}

        } ;
    })();

    var ActressView = (function(){
        return {
            linkSelector : "td > a" ,
            isValidLink : function( href ){
                return href.indexOf( "product" ) < 0 ;
            } , 
            insertStar : function ( elem , img ){
                img = $( img );
                img.css( { "float" : "right" , "display" : "inline" , "margin" : 0 , "padding" : 0} );
                $( elem ).append( img );
            } ,
            insertSample : function ( elem , sample) {
                sample = $(sample);
                $( elem ).append( sample );
                sample.css( { display : "none" , "position" : "absolute" } );

                $(elem).
                    mouseover( function( event ){
                        sample.css( { 
                            display : "block" 
//                            , top  : event.pageY  +"px" , 
//                            left : event.pageX + "px" 
                        } );
                    }).
                    mouseout( function(){
                        sample.css( { display : "none" } );
                    });

            }
        } ;
    })();

    function setStarts( list ){
        list.each( function( i , elem ){
            if( currentView.isValidLink( elem.href ) ){ return; }
            $.get( elem.href , null , function( data ){
                var sample = PlainHTMLUtil.getTag( data , "div" , "sample-video" ) ;

                //------------------------------------------
                var ire = imgRegExp ;
                var div = $( PlainHTMLUtil.getTag( data , "div" , "review-list" ) );

                var img = $( "img" , div ).get(0);
                if( img.src.indexOf("http://p.dmm.co.jp/p/ms/review/") < 0 ){return;}
                img = $(img).parent().get(0);

                currentView.insertStar   ( elem , img );
                currentView.insertSample ( elem , sample ); 

                return;
            });
        });
    }

    function handleInserted( event ){
        var t = event.target ;
        if( t.nodeName != "TABLE" ){ return ;}
        setStarts( $( currentView.linkSelector , t ) );
    }

    function isActressView(){
        if( location.href.indexOf( "actress.dmm.co.jp" ) >= 0 ){
            return true;
        }
        return false ;
    }


    var currentView = isActressView() ? ActressView : DefaultListView ; 
    doc.addEventListener('DOMNodeInserted', handleInserted, false);
    setStarts( $( currentView.linkSelector ) );

