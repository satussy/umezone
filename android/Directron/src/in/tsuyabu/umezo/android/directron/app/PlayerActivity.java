package in.tsuyabu.umezo.android.directron.app;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;

import in.tsuyabu.umezo.android.directron.ApplicationUtil;
import in.tsuyabu.umezo.android.directron.MP;
import in.tsuyabu.umezo.android.directron.PlayOrderManager;
import in.tsuyabu.umezo.android.directron.R;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.SeekBar.OnSeekBarChangeListener;
import android.content.Context;
import android.database.Cursor;

public class PlayerActivity extends Activity{
	private static boolean isSeeking = false ;

	private static PlayOrderManager list ;
	
	@Override
	protected void onDestroy(){
		super.onDestroy();
        Log.d("UMEZO", "onDestroy");

	}


	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d("UMEZO", "onCreate");
        
        startService( new Intent(this,SpeakerChangeObserver.class ));
        
        
        setContentView( R.layout.player_activity );
        Intent intent = getIntent();
        
        File f = (File)intent.getSerializableExtra( "path" );
        PlayerActivity.list = new PlayOrderManager( f.isFile() ? f : f.getParentFile() );
        f = PlayerActivity.list.getNext();

        
        final android.os.Handler handler = new android.os.Handler();
        final Runnable timer = new ProgressTimer();
		Timer t = new Timer( );
		t.schedule( new TimerTask() {
			
			@Override
			public void run() {
				handler.post( timer );
				
			}
		} , 100 , 100 );

        changeSource( this , f );
        
        MP.setOnCompletionListener( onComplete );

        findViewById( R.id.PlayerStop  ).setOnClickListener( stopOnClick );
        findViewById( R.id.PlayerPlay  ).setOnClickListener( playOnClick );
        findViewById( R.id.PlayerNext  ).setOnClickListener( nextOnClick );
        findViewById( R.id.PlayerPrev  ).setOnClickListener( prevOnClick );
        findViewById( R.id.PlayerPause ).setOnClickListener( pauseOnClick );
        
		SeekBar skb = (SeekBar)findViewById(R.id.PlayerSeek);
        skb.setOnSeekBarChangeListener( seekOnChange );
        

	}
	

	
	/////////////////////////////////////////////////////////////////////
	// PREV
	/////////////////////////////////////////////////////////////////////
	private OnClickListener prevOnClick = new OnClickListener() {
		@Override
		public void onClick(View v) {
			File f = PlayerActivity.list.getPrev();
            changeSource( v.getContext() , f );
        }
    };
	
	/////////////////////////////////////////////////////////////////////
	// NEXT
	/////////////////////////////////////////////////////////////////////
	private OnClickListener nextOnClick = new OnClickListener() {
		
		@Override
		public void onClick(View v) {
			File f = PlayerActivity.list.getNext();
            changeSource( v.getContext() , f );
		}
	};
	
	
	
	
	/////////////////////////////////////////////////////////////////////
	// STOP
	/////////////////////////////////////////////////////////////////////
	private OnClickListener stopOnClick = new OnClickListener() {
		
		@Override
		public void onClick(View v) {
			MP.stop();

		}
	};
	
	/////////////////////////////////////////////////////////////////////
	// PLAY
	/////////////////////////////////////////////////////////////////////
	private OnClickListener playOnClick = new OnClickListener() {
		
		@Override
		public void onClick(View v) {
			MP.start();
		}
	};
	
	/////////////////////////////////////////////////////////////////////
	// PAUSE
	/////////////////////////////////////////////////////////////////////
	private OnClickListener pauseOnClick = new OnClickListener() {
		
		@Override
		public void onClick(View v) {
			MP.pause();
		}
	};
	
	/////////////////////////////////////////////////////////////////////
	// COMPLETE
	/////////////////////////////////////////////////////////////////////
	private OnCompletionListener onComplete = new OnCompletionListener() {
		@Override
		public void onCompletion(MediaPlayer mp) {
			File f = PlayerActivity.list.getNext();
            changeSource( PlayerActivity.this , f );			
		}
	};
	
	/////////////////////////////////////////////////////////////////////
	// SEEK
	/////////////////////////////////////////////////////////////////////
	private OnSeekBarChangeListener seekOnChange  = new OnSeekBarChangeListener() {
		
		@Override
		public void onStopTrackingTouch(SeekBar seekBar) {
			isSeeking = false;
			seekTo( seekBar.getProgress() );			
		}
		
		@Override
		public void onStartTrackingTouch(SeekBar seekBar) {
			// TODO Auto-generated method stub
			isSeeking = true;
			
		}
		
		@Override
		public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
			// TODO Auto-generated method stub
			
		}
	};
	
	
	
	/////////////////////////////////////////////////////////////////////
	// UI Control
	/////////////////////////////////////////////////////////////////////
	private void updateSeekbar(){
		SeekBar skb = (SeekBar)findViewById(R.id.PlayerSeek);
		skb.setProgress( MP.getPosition() );
        skb.setMax( MP.getDuration() );
        
        TextView txt = (TextView)findViewById( R.id.PlayerTextDuration );
        txt.setText( ApplicationUtil.getTimeText( MP.getDuration() ) );
		
        txt = (TextView)findViewById( R.id.PlayerTextNow );
        txt.setText( ApplicationUtil.getTimeText( MP.getPosition() ) );
		
	}
	
	private void seekTo( int pos ){
		MP.seekTo(pos);
	}

    private void changeSource( Context c , File f ){
        if( f == null ){ return ; }
        
        ContentResolver resolver = c.getContentResolver();
        Cursor cursor = resolver.query(
        		MediaStore.Audio.Media.EXTERNAL_CONTENT_URI , 
        		new String[]{
        				MediaStore.Audio.Media.ALBUM ,
        				MediaStore.Audio.Media.ARTIST ,
        				MediaStore.Audio.Media.TITLE
        		},    // keys for select. null means all
        		MediaStore.Audio.Media.DISPLAY_NAME + "=?",
        		new String[]{
        			
        			f.getName()
        		},
        		null
        );
        cursor.moveToFirst();
        
        ((TextView)findViewById( R.id.PlayerTextArtist )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ARTIST ) ));
        ((TextView)findViewById( R.id.PlayerTextAlbum  )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ALBUM  ) ));
        ((TextView)findViewById( R.id.PlayerTextTitle  )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.TITLE  ) ));        
        
        MP.setDataSource( c , Uri.fromFile(f));
        MP.prepare();
        MP.start();
        
    }
    
    
	
	private class ProgressTimer implements Runnable{

		@Override
		public void run() {
			if( !isSeeking ){
				PlayerActivity.this.updateSeekbar();
			}
		}
		
	}

}
