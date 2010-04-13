// ==UserScript==
//
//
//
//
// ==/UserScript==

if( typeof isChromeExtension == "undefined" ){ //case : script runs on non chrome browser
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
//        no support
//        onerror : function (){
//            removeMessage( mes );
//            printMessage( "error" );
//        }
    });
}
