<?php
$chat_id = '#umezone/$6db691f30d315b8a';
define( "SKYPE_SEND_SCRIPT" , dirname( __FILE__ )."/hello.scpt" );
define( "VERSION_FILE" , dirname( __FILE__ )."/version" );

$prev_version = null ;
if( file_exists( VERSION_FILE ) ){
    $prev_version = file_get_contents( VERSION_FILE );
}

$latest_version = `curl http://dl.bukkit.org/downloads/craftbukkit/ | grep "th.*a href" | grep '_.*"' -o | sed -e "s/^.//" -e "s/..$//" | uniq | head -n 1`;
if( $prev_version != $latest_version ){
    sendMessage( $chat_id , "Bukkit sever was updated !!! {$latest_version}" );
    file_put_contents( VERSION_FILE , $latest_version );
}


function sendMessage( $chat_id , $message ){
    $cmd = sprintf( "osascript %s %s %s" , escapeshellarg( SKYPE_SEND_SCRIPT ) ,  escapeshellarg( $chat_id ) , escapeshellarg( $message ) );
    `$cmd`;
}
