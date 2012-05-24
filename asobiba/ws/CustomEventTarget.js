var CustomEventTarget = (function(){

    function CustomEventTarget( name ){
        this.eventTarget = document.createElement( (name || "") + "event_target" );
    }

    mix( CustomEventTarget.prototype , {
        addEventListener : function(){
            var et = this.eventTarget ;
            et.addEventListener.apply( et , arguments );
        } ,
        removeEventListener : function(){
            var et = this.eventTarget ;
            et.removeEventListener.apply( et , arguments );
        } ,
        dispatchEvent : function(){
            var et = this.eventTarget ;
            et.dispatchEvent.apply( et , arguments );
        } ,
        appendChild : function(){
            var et = this.eventTarget ;
            et.appendChild.apply( et , arguments );
        } ,
        removeChild : function(){
            var et = this.eventTarget ;
            et.removeChild.apply( et , arguments );
        }
    } );

    return CustomEventTarget;
})();
