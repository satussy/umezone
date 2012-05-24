/*
<div class="attack front_attack">
    FRONT<br/>
    <span>ATTACK</span>
</div>

<div class="attack side_attack">
    SIDE<br/>
    <span>ATTACK</span>
</div>
*/
(function(){
    return;

document.body.addEventListener( "mousedown" , onFocusStart , false );
document.addEventListener( "mouseup"   , onFocusEnd   , false );

var focused_node = null;


var front_attack;
function getFrontAttack(){
    if( !front_attack ){
        front_attack = document.querySelector( ".front_attack" );
        front_attack.addEventListener( "webkitTransitionEnd" , frontAttackTransitionEnd , false );
    }


    function frontAttackTransitionEnd( e ){
        if( front_attack.classList.contains( "in" ) ){
            return;
        }

        front_attack.style.top  = "-999999px";
        front_attack.style.left = "-999999px";
    }

    return front_attack ;
}

var side_attack;
function getSideAttack(){
    if( !side_attack ){
        side_attack = document.querySelector( ".side_attack" );
        side_attack.addEventListener( "webkitTransitionEnd" , sideAttackTransitionEnd , false );
    }


    function sideAttackTransitionEnd( e ){
        if( side_attack.classList.contains( "in" ) ){
            return;
        }

        side_attack.style.top  = "-999999px";
        side_attack.style.left = "-999999px";
    }

    return side_attack ;
}

function onFocusStart( e ){
    var target = searchCardNode( e.target );
    if( !target ){ return; }

    focused_node = target ;

    document.addEventListener( "mousemove" , onMove , false );

    e.preventDefault();

    target.classList.add( "focus" );
    var front_attack = getFrontAttack();
    front_attack.classList.add( "in" );

    front_attack.style.top  = target.offsetTop  + (target.offsetHeight - front_attack.offsetHeight )/2 + "px" ;
    front_attack.style.left = (target.offsetLeft + target.offsetWidth )   + "px" ;




    var side_attack = getSideAttack();
    side_attack.classList.add( "in" );

    side_attack.style.top  = target.offsetTop  + (target.offsetHeight - side_attack.offsetHeight )/2 + "px" ;
    side_attack.style.left = (target.offsetLeft - side_attack.offsetWidth )   + "px" ;

    is_focusing = true;
}

function onFocusEnd(e){
    document.removeEventListener( "mousemove" , onMove , false );
    if( !focused_node ){ return; }

    var target = focused_node ;
    focused_node = null;


    e.preventDefault();

    target.classList.remove( "focus" );
    var front_attack = getFrontAttack();
    var side_attack = getSideAttack();

    if( front_attack.classList.contains( "hilight" ) || side_attack.classList.contains( "hilight" ) ){
        target.classList.add("rotate");
    }



    front_attack.classList.remove( "in" );
    front_attack.classList.remove( "hilight" );

    side_attack.classList.remove( "in" );
    side_attack.classList.remove( "hilight" );
}

function onMove ( e ){
    var x = focused_node.offsetLeft + focused_node.offsetWidth/2 , pointerX = e.clientX ;
    if( Math.abs( pointerX - x ) < focused_node.offsetWidth/2 ){
        getSideAttack().classList.remove( "hilight" );
        getFrontAttack().classList.remove( "hilight" );
        //cancel
        return;
    }



    var hilight , opposite ;

    if( x < pointerX ){
        //front_attack
        hilight  = getFrontAttack();
        opposite = getSideAttack();
    }else if( pointerX < x ){
        //side_attack
        hilight  = getSideAttack();
        opposite = getFrontAttack();
    }

    hilight .classList.   add( "hilight" );
    opposite.classList.remove( "hilight" );

}

function searchCardNode( target ){
    while( target ){
        if( target.classList && target.classList.contains( "card" ) ){
            break;
        }
        target = target.parentNode ;
    }

    return target ;
}



})();
