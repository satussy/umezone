enchant(); 

var g    = new Game( 240 , 240 ) ,
    root = g.rootScene ,
    s    = new Sprite( 20 , 20 );

g.preload( "../img/loading.ico" );
g.onload = function(){
    s.image = g.assets["../img/loading.ico"];
    s.x = 100;
    g.rootScene.addChild( s );
}

root.backgroundColor = "#000000" ;

g.start();



