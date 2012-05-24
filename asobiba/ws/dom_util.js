function leaveNode( elem ){
    if( elem.parentNode ){
        elem.parentNode.removeChild( elem );
    }
}
