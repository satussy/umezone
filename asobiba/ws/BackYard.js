var BackYard = (function(){
    var list = [] ;
    return {
        //drop a card to backyard 
        //@param info object same to returned value like Deck.draw , Hand.drop
        add : function( info ){
            list.push( info );
        }
    };
})();
