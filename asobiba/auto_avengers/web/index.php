<?php
define( "PROJECT_ROOT" , realpath( dirname(__FILE__)."/.." ));
define( "LIB_DIR" , PROJECT_ROOT."/lib" );
define( "TEMPLATE_DIR" , PROJECT_ROOT."/tpl" );
define( "DATA_DIR" , PROJECT_ROOT."/working" );
define( "LOG_DIR" , PROJECT_ROOT."/log" );
define( "ERROR_LOG" , LOG_DIR."/error" );
define( "NORMAL_LOG" , LOG_DIR."/log" );
define( "ERROR_DIR" , PROJECT_ROOT."/error" );
ini_set("date.timezone", "Asia/Tokyo");
umask( 0666 );



class Page {
  function __construct(){ }
  function render( $params ){
    require_once LIB_DIR.'/Twig/lib/Twig/Autoloader.php';
    Twig_Autoloader::register();

    $loader = new Twig_Loader_Filesystem( TEMPLATE_DIR );
    $twig = new Twig_Environment($loader, array());
    $template_name = str_replace( "php" , "tpl" , basename(__FILE__) );
    echo $twig->render( $template_name, $params );

  }
}

class AvengersStatus {
  private $status = null ;
  private $data = null ;
  private $cleared = null ;
  function __construct(){
    $this->status = file_exists( DATA_DIR."/lock" );
    $this->data = json_decode( file_get_contents( DATA_DIR."/data" ) , true );
    $this->data["startAt"] = (int)$this->data["startAt"];
    $this->cleared = strlen( file_get_contents( DATA_DIR."/data" ) ) === 0 ;
  }

  public function isRunning(){
    return $this->status ;
  }
  public function getData(){
    return $this->data ;
  }
  public function isCleared(){
    return $this->cleared;
  }
}

class Log {
  private $log = null ;
  private $error = null;
  private $img = null;
  function __construct(){
    $this->log=array();
    exec( sprintf( "tail -n 10 %s" , escapeshellarg( NORMAL_LOG ) ) , $this->log["list"] );
    $this->log["modified"] = filemtime( NORMAL_LOG );

    $this->error = array();
    exec( sprintf( "tail -n 10 %s" , escapeshellarg( ERROR_LOG ) ) , $this->error["list"] );
    $this->error["modified"] = filemtime( ERROR_LOG );

    exec( sprintf( "ls -1 %s|tail -n 3" , escapeshellarg(ERROR_DIR) ) , $images);
    $this->img = $images;

  }

  public function getLog(){
    return $this->log ;
  }

  public function getError(){
    return $this->error;
  }

  public function getImage(){
    return $this->img;
  }
}


class Service{
  private $cmd = null;
  private $result = null;
  function __construct(){
    $this->cmd = isset( $_GET["cmd"] ) ? $_GET["cmd"] : "noop" ;
    $this->result = array();
  }

  function noop(){}
  function clear(){
    $data_path = DATA_DIR."/data";
    file_put_contents( $data_path , "");
    $this->result["message"] = "cleared";
  }

  public function doCommand(){
    $cmd = $this->cmd;
    $this->$cmd();
  }

  public function getMessage(){
    return $this->result["message"];
  }
}



$page = new Page();
$status = new AvengersStatus();
$log = new Log();
$service = new Service();
$service->doCommand();

$params = array( 
  "isRunning" => $status->isRunning() ,
  "isCleared" => $status->isCleared() ,
  "data" => $status->getData(),
  "now" => time() ,
  "log" => array(
    "image" => $log->getImage(),
    "log" => $log->getLog(),
    "error" => $log->getError()
  ) ,
  "cmd" => array(
    "message" => $service->getMessage()
  )
);
$page->render( $params );
