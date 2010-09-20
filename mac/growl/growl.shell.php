<?php
require( dirname( __FILE__ )."/netgrowl.php" );
define( "IP"      , "IP_ADDRESS_TO_GROWL_HOST" );
define( "PASS"    , "PASSWORD_FOR_GROWL" );
define( "APP_NAME", "APPLICATION_NAME_OF_THIS_SCRIPT"   );

function send( $title , $body ){
    $s = socket_create( AF_INET, SOCK_DGRAM, SOL_UDP );


    $p = new GrowlRegistrationPacket( APP_NAME , PASS );
    $p->addNotification("Informational");
    $szBuffer = $p->payload();
    socket_sendto( $s, $szBuffer, strlen($szBuffer), 0x100,IP , GROWL_UDP_PORT );
    $p = new GrowlNotificationPacket( APP_NAME , "Informational", $title , $body , -2, false , PASS );
    $szBuffer = $p->payload();
    socket_sendto( $s, $szBuffer, strlen($szBuffer), 0x100, IP , GROWL_UDP_PORT );
    socket_close( $s );
}


if( $argc != 0 ){
    if( $argc == 2 ){
        $argv[2] = "";
    }
    send( $argv[1] , $argv[2] );
}

