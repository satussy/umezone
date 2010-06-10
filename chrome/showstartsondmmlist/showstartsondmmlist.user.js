// ==UserScript==
// @name           showStartsOnDmmList
// @namespace      umezo.tsuyabu.in
// @include        http://www.dmm.co.jp/digital/videoa/-/list/=/article=series/id=9874/
// ==/UserScript==

    if( location.href.indexOf("list") < 0 ){ return ; }
    var GET = "GET" ;
	var doc = document ;
    var imgRegExp = new RegExp( "<img(\\s|.)*?([^<]*)>" , "ig")

    doc.addEventListener('DOMNodeInserted', handleInserted, false);
    setStarts( $( ".text > a" );

    function setStarts( list ){
        list.each( function( i , elem ){
            if( elem.href.indexOf("detail") < 0 ){ continue; }
            $.get( elem.href , null , function( data ){
                var ire = imgRegExp ;
//                var s = Number( new Date() );
//                var div = doc.createElement( "div" );
//                div.innerHTML = getTag( data , "div" , "review-list" );
                var div = getTag( data , "div" , "review-list" );
                var img = div.match( ire )[0];
//                console.log( div.innerHTML );
//                console.log( Number( new Date() ) - s , img );
                if( img.indexOf("http://p.dmm.co.jp/p/ms/review/") < 0 ){return;}

                $( elem ).append( img );
                return;
            });
        });
    }

    function handleInserted( event ){
        var t = event.target ;
        if( t.nodeName != "TABLE" ){ return ;}
        setStarts( $( ".text > a" , t ) );
    }

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
