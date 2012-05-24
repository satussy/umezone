#include <stdio.h>
#include <limits.h>
int main (void) {
    printf( "%d\n" , INT_MAX );
    printf( "%d\n" , INT_MIN );
    printf( "%d\n" , 0xFFFFFFFF >> 1 );
    printf( "%d\n" , 1 << 31 );

   return (0);
}


