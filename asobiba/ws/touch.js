var TOUCH_ENABLED = (function() {
    var div = document.createElement('div');
    div.setAttribute('ontouchstart', 'return');
    return typeof div.ontouchstart == 'function';
})();

var INPUT_DEVICE_START = TOUCH_ENABLED ? "touchstart" : "mousedown";
var INPUT_DEVICE_END   = TOUCH_ENABLED ? "touchend"   : "mouseup"  ;
var INPUT_DEVICE_MOVE  = TOUCH_ENABLED ? "touchmove"  : "mousemove";

function getInputPositionFromEvent( e ){
    if( TOUCH_ENABLED ){
        return { x : e.touches[0].pageX , y:e.touches[0].pageY };
    }else{
        return { x : e.clientX , y:e.clientY };
    }

}
