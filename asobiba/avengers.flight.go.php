<?php
$BASE_FLIGHT_POSITION = array( 585 , 510 ) ;
$DELTA_BETWEEN_FLIGHTS = array( -34 ,  -21 ) ;


$LEFT_HERO_POSITION = array( 280 , 350 );
$DELTA_BETWEEN_HERO = array( 106 ,   0 );


$DEPLOY_CLOSE_BUTTON_POSITION = array( 850 , 200 );
     $CONFIRM_BUTTON_POSITION = array( 520 , 620 );
      $MISSION_20MIN_POSITION = array( 350 , 500 );
   $NEXT_PAGE_BUTTON_POSITION = array( 830 , 330 );
    $ALERT_OK_BUTTON_POSITION = array( 570 , 465);

define( "BASE_WAIT" , 500 );

$FLIGHT_NUM = 8 ;
$HEROS_PER_PAGE = 5 ;


function click( $pos , $wait = BASE_WAIT ){
  $cmd = "cliclick c:".implode( "," , $pos );
  `$cmd`;
  wait( $wait );
}

function move( $pos , $wait = BASE_WAIT ){
  $cmd = "cliclick m:".implode( "," , $pos );
  `$cmd`;
  wait( $wait );
}

function wait( $time ){
  $cmd = "cliclick w:{$time}" ;
  `$cmd`;
}


wait( 2000 );

$SCROLL_BUTTON_POSITION = array( 70 , 105 ) ;
click( $SCROLL_BUTTON_POSITION );

for( $i = 0 , $n = $FLIGHT_NUM ; $i < $n ; $i++ ){

  $flight_pos = array(
    $BASE_FLIGHT_POSITION[0] + $DELTA_BETWEEN_FLIGHTS[0] * $i ,
    $BASE_FLIGHT_POSITION[1] + $DELTA_BETWEEN_FLIGHTS[1] * $i 
  );

  click( $flight_pos , BASE_WAIT + 1000 );
  click( $flight_pos );

  if( $i === 0 ){
    click( $MISSION_20MIN_POSITION );
  }


  if( $i == $HEROS_PER_PAGE ){
    click( $NEXT_PAGE_BUTTON_POSITION , BASE_WAIT + 1000 );
  }


  click( $LEFT_HERO_POSITION );
  click( $CONFIRM_BUTTON_POSITION );

  //click( $ALERT_OK_BUTTON_POSITION );
}

