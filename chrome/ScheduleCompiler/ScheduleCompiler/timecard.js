(function(){

if( location.href.toLowerCase().indexOf("http://webkan.klab.org/contents/index/weeklyreport.php") >= 0 ){
    var script = [
        chrome.extension.getURL( "jquery.js"      ) ,
        chrome.extension.getURL( "template.js"    ) ,
        chrome.extension.getURL( "template.ui.js" ) ,
        chrome.extension.getURL( "id.js"          )
    ];
    
    for( var i = 0 , n = script.length ; i < n ; i++ ){
        var s = document.createElement("script");
        s.src = script[i]+"#"+Math.random() ;
        document.body.appendChild( s );
    }
    
    $(".header").append('<div id="message"></div>');
    
    return;
}

if( location.href.toLowerCase().indexOf("/zaion/timecard/") >= 0 ){
    (function(){
        var URL_CYBOZU = "http://intra.klab.org/cgi-bin/klcb/ag.cgi?" ;
        
        function handleStateChange(){
            var uid;
            if( this.readyState == 1 ){
                //show disable icon
            }else if( this.readyState == 4 ){
                //try{

                    uid = extractUserId( this.responseText ) ;
                    hideMessage( );

                    //uid = 5015 ;
                    setTimeout( function(){ gottenUserId( uid ); } , 1 );
                //}catch( e ){
                    //location.href = URL_CYBOZU ;
                //}
            }
        }
        
        function extractUserId( html ){
            var parsed = html.split( 'UID=' )[1].split('"')[0] ;
            return parseInt( parsed , 10 );
        }
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleStateChange; 
        xhr.open( "GET" , URL_CYBOZU , true );
        xhr.send();
    })( );

    return;
}




//page action で backgroundからコールバックされる
chrome.extension.onRequest.addListener( function ( message , sender , sendResponse) {
    //趣味
    var retVal = (window[ message.action ]||function(){}).apply( window , message.args ); 
    
    //関数の実行結果をレスポンスの引数として返す
    //sendResponse.apply( null , retVal )とかの方が綺麗かも？
    sendResponse( { values : retVal } );
} ) ;



})();

function aggregate(){
    var INDEX_DATE = 0 ,
        INDEX_START= 5 ,
        INDEX_END  = 6 ,

        ID_YEAR_TARGET = "#pageForm1__ctl1_ZMonthButton1 td" ,
        ID_GRID_TARGET = "#PageForm1__ctl1_DataGrid1 tr" ,

        offset = 0 ,
        year = getPageYear() ,
        month = getPageMonth() ;

    //タイムカード表の行を取ってくる
    var list = (function( list ){
        var i , n , tr , td , dateParam , newList = [] , newElem , paid , comp ;
        for( i = 0 , n = list.length ; i < n ; i++ ){
            tr = list[i] ;

            //表題系の行はスキップ
            if( tr.getAttribute("nowrap") ){ continue ; }
    
            //対象の行のセルを取得
            td = $(tr).find("td") ;

            //行によってセルの数が違うけど、右から12個の中に欲しいデータがあるから、各行毎にオフセットを計算
            offset = td.length - 12 ;

            INDEX_DATE    = 0 + offset ;
            INDEX_START   = 5 + offset ;
            INDEX_END     = 6 + offset ;

            paid = isPaidHoliday( tr ); //有休フラグ
            comp = isCompDay( tr );     //振休フラグ

            dateParam = parseDate( td[ INDEX_DATE ].innerHTML );

            newElem = {
                date : Number( new Date( [ year , dateParam[0] , dateParam[1] ].join( "/" ) ) ) ,
                //有給は8H扱い 振休は0h(0hだと都合が悪いので0.001に)
                time : paid ? 480 : ( comp ? 0 : calTime( td[ INDEX_START ] , td[ INDEX_END ] ) ) ,
                holiday : isHoliday( tr ) ,
                paid : paid ,
                comp : comp , 
                othello : false 
            };


            if( i != 0 && i+1 != n ){
                newElem.othello = isOthello( list[ i-1 ] , tr , list[ i + 1 ] ) ;
            }


            newList.push( newElem );
        } 

        return newList;
    })( $( ID_GRID_TARGET ) );

    return [ year+"/"+month , list ];


    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    //
    //
    // ここからライブラリー
    // 
    // 
    //----------------------------------------------------------------------------------

    function getPageYear(){
        return parseInt( $( ID_YEAR_TARGET )[1].innerHTML , 10 );
    }

    function getPageMonth(){
        return parseInt( $( ID_YEAR_TARGET )[2].innerHTML , 10 );
    }

    function parseDate( dateString ){
        dateString = dateString.split( "月" );
        return [ parseInt( dateString[0] , 10 ) , parseInt( dateString[1] , 10 ) ];
    }

    //trで指定された日が土日、祝祭日かどうか調べる
    function isHoliday( tr ){
        var style = tr.getAttribute( "style" );
        return style.indexOf( "99FFFF" ) >= 0 || style.indexOf( "FFCCFF" ) >= 0 ;
    }

    //trで指定された日が代休か調べる
    function isCompDay( tr ){
        //対象の行のセルを取得
        var td     = $(tr).find("td") ,
            offset = td.length - 12 , 
            INDEX_HOLIDAY = 1 + offset ;

        td = td[ INDEX_HOLIDAY ];
        return td.innerHTML.indexOf("振休") >= 0 ;
        //return !!td.innerHTML;
    }

    //trで指定された日が有休か調べる
    function isPaidHoliday( tr ){
        //対象の行のセルを取得
        var td     = $(tr).find("td") ,
            offset = td.length - 12 , 
            INDEX_HOLIDAY = 1 + offset ;

        td = td[ INDEX_HOLIDAY ];
        return td.innerHTML.indexOf("有休") >= 0 ;
    }

    //オセロ休暇かどうか調べる
    function isOthello( prev , today , next ){
        return isHoliday( prev ) && !isHoliday( today ) && isHoliday( next ) ;
    }

    /**
     * calculate working time
     * @param HtmlElement s
     * @param HtmlElement e
     * @return Integer minutes
     */
    function calTime( s , e ){
        e = findTimeStr( e );
        s = findTimeStr( s );
        return strToMinutes( e ) - strToMinutes( s ) ;
    }
    
    /**
     * find string showing time in element specified s
     * @param HtmlElement s
     * @return String "HH:MM"
     */
    function findTimeStr( s ){
        var list = $(s).find( "span" );
        if( list.length != 0 ){
            s = list[ list.length - 1 ];
        }
        return s.innerHTML ;
    }

    /**
     * convert string formatted as "HH:MM" to minutes
     * @param String str formatted string "HH:MM"
     * @param Integer minutes
     */
    function strToMinutes( str ){
        str = str.split( ":" );
        return parseInt( str[0] , 10 ) * 60 + parseInt( str[1] , 10 ) ;
    }
}
