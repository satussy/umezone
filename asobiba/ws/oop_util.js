function mix( a , b ){
    for( i in b ){
        if( a.hasOwnProperty( i ) ){ 
            console.log( i );
            continue; 
        }
        a[i] = b[i];
    }

    return a ;
}
