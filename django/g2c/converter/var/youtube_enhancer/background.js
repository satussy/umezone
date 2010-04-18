window.onload = init

var CMD = {
    xhr : xhr ,
    initGM : initGM ,
    setValue : setValue 
} ;

function init() {
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener( function( message , con ) {

            var args = message.args ;
            if( !( args instanceof Array ) ){ args = [ args ]; }

            args.push( con );
            (CMD[ message.action ]||function(){}).apply( CMD , args ) ;
        });
    });
}

//GM_xmlhttpRequest
function xhr( opt , callbackid , con ) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { 
            callback( con , callbackid , [ convertToGMResponse( xhr ) ] );
        }
    }
    xhr.open( opt.method , opt.url , true)
    if( opt.headers ){
        for( var i in opt.headers ) {
            xhr.setRequestHeader( i , opt.headers[i] );
        }
    }
    xhr.send( opt.data )
    return xhr
}


//GM_setValue
function setValue( key , value ){
    localStorage[ key ] = value ;
}


function initGM ( callbackid , con ){
    callback( con , callbackid , localStorage );
}


function callback( con , callbackid , args ){
    if( !( args instanceof Array ) ){ args = [ args ] ; }
    args.unshift( callbackid );
    con.postMessage( { action : "callbackResponse" , args : args } );
}

function convertToGMResponse( xhr ){
    var newObj = extractProperties( xhr );
    delete newObj.responseXML;
    return newObj;
}

function extractProperties( obj ){
    var newObj = {} , i ;
    for( i in obj ){
        if( obj[i] && typeof obj[i] == "function" ){ continue; }
        newObj[ i ] = obj[i];
    }

    return newObj ;
}


