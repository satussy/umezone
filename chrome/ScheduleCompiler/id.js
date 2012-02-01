var URL_CYBOZU = "http://intra.klab.org/cgi-bin/klcb/ag.cgi?" ;

message( "ユーザID確認中" );
(function(){

    function handleStateChange(){
        var uid;
        if( this.readyState == 1 ){
            //show disable icon
        }else if( this.readyState == 4 ){
            try{

                uid = extractUserId( this.responseText ) ;
                hideMessage( );

                //uid = 5015 ;
                setTimeout( function(){ gottenUserId( uid ); } , 1 );
            }catch( e ){
                location.href = URL_CYBOZU ;
            }
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



