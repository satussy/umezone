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
	
	private static PlayOrderManager list ;
	
	private static Handler handler ;
	
	private static File currentFile ;

	@Override
	public IBinder onBind(Intent intent) {
		Log.d("UMEZO","Service:onBind");

		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void onStart( Intent intent , int startId ){
		super.onStart(intent, startId);
		Log.d("UMEZO","Service:onStart");
		
		registerReceiver(onBecomingNoisy, filter);
		
		
		MP.setOnCompletionListener( this.onComplete );
		
		
		switch( Integer.parseInt(intent.getAction()) ){
		case ACTION_CODE_INIT:
			File f = (File)intent.getSerializableExtra( "path" );
			if( f == null ){
				Log.d("UMEZO","--------------- error on Play : param is null");
			}
			setCurrentList(f);
			next();

			break;

		case ACTION_CODE_NEXT:
			next();

			break;

		case ACTION_CODE_PREV:
			prev();

			break;

		case ACTION_CODE_STOP:
			stop();

			break;
			
		case ACTION_CODE_PLAY:
			play();

			break;

		}
		
		
	}
	
	@Override
	public void onDestroy(){
		super.onDestroy();
		Log.d("UMEZO","Service:onDestroy");
		
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
    	Log.d("UMEZO","Service:stop");
    	MP.stop();
    }
    public static void play(){
    	Log.d("UMEZO","Service:play");
    	MP.start();    	
    }
    public void next(){
    	Log.d("UMEZO","Service:next");
    	if( wasPrev ){
    		list.getNext();
    	}
    	changeSource( list.getNext() );
    	
    	wasPrev = false;
    }
    public void prev(){
    	Log.d("UMEZO","Service:next");
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
	
	
    
    
    
    private static void setCurrentList(File f){
		list = new PlayOrderManager( f.isFile() ? f : f.getParentFile() );    	
    }
    
    public static void setOnChangeSouce( Handler h ){
    	handler = h ;
    }
    
    public static File getCurrentFile( ){
    	return currentFile;
    }
}

