window.onload = init

var CMD = {
    get : get 
} ;

function init() {
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener( function( message , con ) {
            message.args.push( con );
            (CMD[ message.action ]||function(){}).apply( CMD , message.args ) ;
        });
    });
}

function get( opt , callbackid , con ) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { 
            con.postMessage( { action : "xhrResponse" , args : [ callbackid , xhr ] } ); 
        }
    }
    xhr.open( opt.method , opt.url , true)
    xhr.send(null)
    return xhr
}

