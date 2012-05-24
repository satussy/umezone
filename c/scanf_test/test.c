#include <stdio.h>
int main (void)
{
   unsigned long num;
   int dig;


   do {
       printf("非負の整数を入力してください");
       scanf("%ld", &num);
       if (num < 0) {
           printf("負の値として : %ld\n\n", num);
           puts("\a負の値を入力しないでください");
       }
   } while (num < 0);

   dig = 0;

   do {
       printf("認識: %ld\n", num);
       num = num / 10;
       dig = dig + 1;
   } while(num > 0);

   printf ("その数は%d桁です\n", dig);

   return (0);
}
