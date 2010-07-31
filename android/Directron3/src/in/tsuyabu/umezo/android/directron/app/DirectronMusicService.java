package in.tsuyabu.umezo.android.directron.app;

import java.io.File;

import in.tsuyabu.umezo.android.directron.MP;
import in.tsuyabu.umezo.android.directron.PlayOrderManager;
import in.tsuyabu.umezo.android.directron.R;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.Service;
import android.app.Instrumentation.ActivityMonitor;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.net.Uri;
import android.os.Handler;
import android.os.IBinder;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.RemoteViews;
import android.os.Bundle;
import java.util.List;

public class DirectronMusicService extends Service {
	public  static final String ACTION_INIT      = "0";
	private static final int    ACTION_CODE_INIT =  0 ;
	
	public  static final String ACTION_NEXT      = "1";
	private static final int    ACTION_CODE_NEXT =  1 ;
	
	public  static final String ACTION_PREV      = "2";
	private static final int    ACTION_CODE_PREV =  2 ;
	
	public  static final String ACTION_STOP      = "3";
	private static final int    ACTION_CODE_STOP =  3 ;
	
	public  static final String ACTION_PLAY      = "4";
	private static final int    ACTION_CODE_PLAY =  4 ;

	public  static final String ACTION_PLAY_AT      = "5";
	private static final int    ACTION_CODE_PLAY_AT =  5 ;


    public static final int    OPTION_PLAY_THIS          = 0; //play specified file
    public static final int    OPTION_PLAY_DIR           = 1; //play directory including specified file
    public static final int    OPTION_PLAY_DIR_FROM_THIS = 2; //play directory including specified file and start with it

	
	private static PlayOrderManager list ;
	
	private static Handler handler ;
	
	private static File currentFile ;

    public DirectronMusicService(){
        super();
//        Log.d("LIFECICLE", "DirectronMusicService construct---------------------------------------------");
    }

	@Override
	public IBinder onBind(Intent intent) {
//		Log.d("LIFECICLE","DirectronMusicService onBind");

		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void onStart( Intent intent , int startId ){
		super.onStart(intent, startId);
//		Log.d("LIFECICLE","DirectronMusicService onStart");
		
		registerReceiver(onBecomingNoisy, filter);
		
		
		MP.setOnCompletionListener( this.onComplete );

		

        if( intent != null){
            String intentAction = (String)intent.getAction();

            switch( Integer.parseInt( intentAction ) ){
                case ACTION_CODE_INIT:
                    File f = (File)intent.getSerializableExtra( "path" );
                    File target = null;
                    if( f == null ){
                        Log.w("UMEZO","--------------- error on Play : param is null");
                    }

                    int option = (Integer)intent.getSerializableExtra( "option" );
    //				Log.d("UMEZO","--------------- " + option );
                    switch( option ){
                        case OPTION_PLAY_THIS : break;

                        case OPTION_PLAY_DIR :
                            f = f.getParentFile();
                        break;

                        case OPTION_PLAY_DIR_FROM_THIS :
                            target = f ;
                            f = f.getParentFile();
                        break;
                    }



                    setCurrentList( f , target );
                    next();

                break;

                case ACTION_CODE_PLAY_AT:
                    int at = (Integer)intent.getSerializableExtra("at");
                    list.setAt( at );
                    next();


                break;

                case ACTION_CODE_NEXT: next(); break;
                case ACTION_CODE_PREV: prev(); break;
                case ACTION_CODE_STOP: stop(); break;
                case ACTION_CODE_PLAY: play(); break;

            }
        }
	}
	
	@Override
	public void onDestroy(){
		super.onDestroy();
//		Log.d("LIFECICLE","DirectronMusicService onDestroy");
		unregisterReceiver(onBecomingNoisy);
	}

	
    private static IntentFilter filter = new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);    
    private static BroadcastReceiver onBecomingNoisy = new BroadcastReceiver() {
		
		@Override
		public void onReceive(Context context, Intent intent) {
			MP.pause();
			
		}
	};
    private void changeSource( File f ){
    	Context c = this;
        if( f == null ){ return ; }
        
        currentFile = f ;
        
        if( handler != null ){
        	handler.sendMessage( handler.obtainMessage( 0 , f ) );
        }

        MP.setDataSource( c , Uri.fromFile(f));
        MP.prepare();
        MP.start();
       
    }
    
    private static boolean wasPrev = false ;
    
    public static void stop(){
//    	Log.d("UMEZO","Service:stop");
    	MP.stop();
    }
    public static void play(){
//    	Log.d("UMEZO","Service:play");
    	MP.start();    	
    }
    public void next(){
//    	Log.d("UMEZO","Service:next");
    	if( wasPrev ){
    		list.getNext();
    	}
        if( isLoopEnabled() && !list.hasNext() ){
            list.gotoHead();
        }
    	changeSource( list.getNext() );
    	
    	wasPrev = false;
    }
    public void prev(){
//    	Log.d("UMEZO","Service:next");
        
        if( isLoopEnabled() && !list.hasPrevious() ){
            list.gotoTail();
        }

    	changeSource( list.getPrev() );
    	
    	wasPrev = true;
    }
	/////////////////////////////////////////////////////////////////////
	// COMPLETE
	/////////////////////////////////////////////////////////////////////
	private OnCompletionListener onComplete = new OnCompletionListener() {
		@Override
		public void onCompletion(MediaPlayer mp) {
			DirectronMusicService.this.next();			
		}
	};
	
	
    private boolean isLoopEnabled(){
        return true;
    }
    
    
    
    private static void setCurrentList(File dir , File target ){
//		list = new PlayOrderManager( f.isFile() ? f : f.getParentFile() );    	
		list = new PlayOrderManager( dir , target );    	
    }
    
    public static void setOnChangeSouce( Handler h ){
    	handler = h ;
    }
    
    public static File getCurrentFile( ){
    	return currentFile;
    }

    public static List getCurrentList(){
        return list.getCurrentList();
    }
}

