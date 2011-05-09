var console = (function(){
    return {
        log : function ( text ){
            fl.outputPanel.trace( text );
        },
        clear : function ( ){
            fl.outputPanel.clear();
        }
    };
})();


function eachFrame( func ){
    var doc = fl.getDocumentDOM() ;
    var tl = doc.getTimeline();
    var layers = tl.layers , aLayer ;
    var i = 0 , n = 0 , j = 0 , m = 0;
    for( i = 0 , n = layers.length ; i < n ; i++ ){
        aLayer = layers[i];
        var frames = aLayer.frames , aFrame ;
        func( frames , i , aLayer );
//        for( j = 0 , m = frames.length ; j < m ; j++ ){
//            aFrame = frames[j] ;
//            func( aFrame );
//        }
    }
}

console.clear();

eachFrame( function ( frame , layerIndex , layer ) {
    if( layer.layerType == "folder" ){ return; }
    var aFrame , i , n ;
    console.log( "Layer " + (layerIndex+1) + ": " + layer.name + "-----------------------" );
    for( i = 0 , n = frame.length ; i < n ; i++ ){
        aFrame = frame[i] ;

        var startFrame = aFrame.startFrame+1 , duration = aFrame.duration - 1 , elems = aFrame.elements ;

        i += duration ;
    }
} );
