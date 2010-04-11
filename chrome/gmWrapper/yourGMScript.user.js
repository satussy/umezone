// ==UserScript==
//
//
//
//
// ==/UserScript==
//
//
//

if( typeof isChromeExtension == "undefined" ){ //chrome wrapperが読み込まれていない場合
    init();
}else{
    function onReadyGM(){
        init();
    }
}

function init(){
    GM_setValue( "key1" , "value1" );
    GM_log( GM_getValue( "key1" ) );

    GM_log( GM_getValue( "key2" , "default2" ) );
    GM_setValue( "key2" , "value2_stored" ) ;

    GM_setValue( "key1" , "value1_new" );
    GM_log( GM_getValue( "key1" ) );


    GM_xmlhttpRequest({
        method : "get" ,
        url: "http://www.google.com/" , 
        onload : function (req) {
            GM_log( req );
        } 
//        忘れてた, 
//        onerror : function (){
//            removeMessage( mes );
//            printMessage( "error" );
//        }
    });
}
