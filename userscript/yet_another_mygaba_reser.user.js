// ==UserScript==
// @name           yet another mygaba reservation list
// @namespace      umezo.tsuyabu.in
// @description    yet another mygaba reservation list
// @include        https://my.gaba.jp/app/booking/default.asp
// ==/UserScript==
//
//
var doc = document;

function $c( cls ){ return doc.getElementsByClassName( cls ); }
function $$( id  ){ return doc.getElementById( id ); }

var list = (function(){
        var list = $c("dailyAvailableDay") ,
            i , n , item , 
            result = [] ;
        for( var i = 0 , n = list.length ; i < n ; i++ ){
            var item = list[i];
            if( !item.textContent ){ continue; }
            result.push( item.innerHTML.split("'")[3] );
        }

        return result ;
    })() ,
//    currentDate = (function(){
//        var year = (function(){
//                return new Date().getFullYear();
//            })();
//            month = (function(){
//                return parseInt( $c("greenText")[0].textContent.trim() );
//            })() ,
//            
//            day = (function(){
//                return $c("calendarSelectedDay")[0].textContent.trim();
//            })() ;
//
//        return [ year , month , day ];
//    })(), 
    result = {} ,
    teacherIdMap = {} ,

    updateProgress ,
    
x;

(function(){
    var div = doc.createElement("div");
    div.style.position = "absolute" ;
    div.style.right    = "0px" ;
    div.style.top      = "0px" ;
    div.style.width    = "100%" ;

   
    var a = doc.createElement( "div" );
    a.innerHTML = "Init teachers" ;
    a.style.position = "absolute" ;
    a.style.right    = "0px" ;
    a.style.textAlign = "right" ;
    a.style.cursor = "pointer" ;
    a.addEventListener( "click" , function( e ){ 
        a.innerHTML = "Loading data..." ;
        a.style.backgroundColor = "#f1f1f1";
        setGetTeacherList();
    } , false );

    updateProgress = function ( total , current ){
        a.style.width = (current/total)*100 + "%" ;
    } ;

    finishProgress = function (){
        a.innerHTML = "Done" ;
        a.style.width = "";
    };

    div.appendChild( a );

    doc.body.insertBefore( div , doc.body.firstChild );
})();


var i = 0 ;
function setGetTeacherList(){
    var targetDate = list[i++];
    if( !targetDate ){ 
        finishProgress();
        showTeacher();
        return; 
    }else{
        updateProgress( list.length , i ) ;
    }
    setTimeout( function (){
        getTeacherList( targetDate );
    } , 500);
}


function showTeacher(){
    console.log( teacherIdMap );
    console.log( result );
    console.error( "implement this function to show a teacher-time table" );
}

function getTeacherList( targetDate ){
    var form = (function(){
        var form = doc.getElementsByTagName("form")[3].elements ,
            i , n , item , result = {} ;
        for( i = 0 , n = form.length ; i < n ; i++ ){
            item = form[i];
            result[ item.name ] = item.value ;
        }

        return result;
    })();
    form.view = 'daily' ;
    form.targetDate = targetDate ;

    GM_xmlhttpRequest({
        method : "post" ,
        url: "/app/booking/default.asp" ,
        headers: { 'Content-type': 'application/x-www-form-urlencoded' } ,
        data : getQuery( form ),
        onload : function (req) {
            var list = getTags(
                    req.responseText ,
                    "td" ,
                    "instructorNotSelected"
                ) ,

                reg = />([^<]+)<\/a/ ,
                i , n , key , tid ;

            for( i = 0 , n = list.length ; i < n ; i++ ){
                tid = parseInt( list[i].split("instructorID.value='")[1] );
                if( list[i].match( reg ) ){
                    key = RegExp.$1.trim() ;
                    if( !result[ key ] ){
                        result[ key ] = [];
                        teacherIdMap[ key ] = tid ;
                    }

                    result[key].push( targetDate );
                }
            }

            setGetTeacherList();
        }
    });
}


function getQuery( params ){
    var list = [] ;
    for( var i in params ){
        list.push( i + "=" + encodeURIComponent( params[i]) );
    }

    return list.join("&");
}



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



