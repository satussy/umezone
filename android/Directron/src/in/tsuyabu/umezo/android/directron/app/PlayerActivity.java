package in.tsuyabu.umezo.android.directron.app;

import java.io.File;
import java.util.Arrays;

import in.tsuyabu.umezo.android.directron.PlayOrderManager;
import in.tsuyabu.umezo.android.directron.R;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.widget.ImageView;
import android.widget.RemoteViews;
import android.widget.TextView;



public class PlayerActivity extends Activity{
	private static boolean isSeeking = false ;
	private static int[] listBtnID = {
		R.id.PlayerPlay  ,
		R.id.PlayerPause ,
		R.id.PlayerPrev  ,
		R.id.PlayerNext  ,
		R.id.PlayerStop  
	};
	
	@Override
	protected void onDestroy(){
		super.onDestroy();
        Log.d("UMEZO", "onDestroy");

	}


	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Log.d("UMEZO", "onCreate");

        setContentView( R.layout.player_activity );
        
        DirectronMusicService.setOnChangeSouce(this.handler);
        updateInfo( DirectronMusicService.getCurrentFile() );
        
        View v = findViewById(R.id.PlayerView );
        v.setOnTouchListener( new OnTouchPlayer( this ) );
        
        this.fitAlbumArt();
        

	}
	

	private void fitAlbumArt(){
		ImageView img = (ImageView)this.findViewById(R.id.InfoAlbumArt);
		img.setMinimumHeight(100);
		img.setMinimumWidth(100);
	}


	private class OnTouchPlayer implements OnTouchListener {
		private float x = 0 ;
    	private float y = 0 ;
    	private float l = 0 ;
    	private int position ;

    	private View c ;
    	
    	private static final int POSITION_CENTER = 0;
    	private static final int POSITION_NORTH  = 1;
    	private static final int POSITION_WEST   = 2;
    	private static final int POSITION_EAST   = 3;
    	private static final int POSITION_SOUTH  = 4;
    	
    	public OnTouchPlayer( Activity a ){
    		c = a.findViewById(R.id.PlayerViewController);

    	}
    	
    	
		
		@Override
		public boolean onTouch(View v, MotionEvent event) {
			//Log.d("UMEZO","onTouch");
			
		
			//boolean result;
			
			switch( event.getAction() ){
				case MotionEvent.ACTION_DOWN :
					Log.d("UMEZO","onTouch:Down");
					c.setVisibility( View.VISIBLE );

					//result = v.findViewById( R.id.PlayerViewController ).requestFocus();
					//Log.d("UMEZO","========= " + ( result ? "o" : "x"));
					//Touch start point origin mode
					//x = event.getX();
					//y = event.getY();
					
					//Screen center origin mode
					x =	v.getWidth()/2;
					y = v.getHeight()/2;
					l = Math.min(x, y);
					l = l * l / 3;
					

					break;
				case MotionEvent.ACTION_UP :
					Log.d("UMEZO","onTouch:UP");
					c.setVisibility( View.INVISIBLE );
					PlayerActivity.this.execControl( position );
					
					break;
				case MotionEvent.ACTION_MOVE:
					//Log.d("UMEZO","onTouch:MOVE");
					float dx = event.getX() - x;
					float dy = event.getY() - y;
					
					float L = dx*dx + dy*dy ;
					if( L < l ){
						//Log.d("UMEZO","--------- inside");
						position = POSITION_CENTER ;
					}else{
						//Log.d("UMEZO","--------- outside");
						double rad = ( Math.atan2(dx, dy) / Math.PI * 180 + 45 ) / 90 + 2 ;							
						if( 1 <= rad && rad < 2 ){
							position = POSITION_WEST ;
						}else if( 2 <= rad && rad < 3 ){
							position = POSITION_SOUTH ;
						}else if( 3 <= rad && rad < 4 ){
							position = POSITION_EAST ;
						}else{
							position = POSITION_NORTH ;
						}
					}
					PlayerActivity.this.focusButton( position );
					//result = this.v[position].requestFocusFromTouch();
					//Log.d("UMEZO","========= " + ( result ? "o" : "x"));
					
					break;
			}
			return true;
		}
	}


	public void execControl(int position) {
		Log.d("UMEZO","PlayerActivity:execControl : " + position );
    	String action = null;
		switch( listBtnID[position] ){
			case R.id.PlayerStop :
				Log.d("UMEZO" , "--------- stop");
				action = DirectronMusicService.ACTION_STOP;
				break;
			case R.id.PlayerPlay :
				Log.d("UMEZO" , "--------- play");
				action = DirectronMusicService.ACTION_PLAY;
				break;
			case R.id.PlayerNext :
				Log.d("UMEZO" , "--------- next");
				action = DirectronMusicService.ACTION_NEXT;
				break;
			case R.id.PlayerPrev :
				Log.d("UMEZO" , "--------- prev");
				action = DirectronMusicService.ACTION_PREV;
				break;
			
		}
		
		if(action!=null){
	    	Intent service = new Intent( this , DirectronMusicService.class );
			service.setAction(action);
			startService(service);
		}
		
	}
	
	private Handler handler = new Handler(){
		public void handleMessage( Message msg ){
			File f = (File)msg.obj;
			updateInfo(f);
		}
	};
	
	private void updateInfo( File f ){
		if( f == null ){return;}
        ContentResolver resolver = PlayerActivity.this.getContentResolver();
        Cursor cursor = resolver.query(
        		MediaStore.Audio.Media.EXTERNAL_CONTENT_URI , 
        		new String[]{
        				MediaStore.Audio.Media.ALBUM ,
        				MediaStore.Audio.Media.ARTIST ,
        				MediaStore.Audio.Media.TITLE , 
        				MediaStore.Audio.Media.ALBUM_ID 
        		},    // keys for select. null means all
        		MediaStore.Audio.Media.DISPLAY_NAME + "=?",
        		new String[]{
        			
        			f.getName()
        		},
        		null
        );
        cursor.moveToFirst();
        

        
        ((TextView)findViewById( R.id.InfoArtist )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ARTIST ) ));
        ((TextView)findViewById( R.id.InfoAlbum  )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ALBUM  ) ));
        ((TextView)findViewById( R.id.InfoTitle  )).setText(cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.TITLE  ) ));
        
        int albumId = cursor.getInt( cursor.getColumnIndex( MediaStore.Audio.Media.ALBUM_ID ));
        
        
        cursor = resolver.query(
        		MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI , 
        		new String[]{
        				MediaStore.Audio.Albums.ALBUM_ART
        		},    // keys for select. null means all
        		"_id=?",
        		//MediaStore.Audio.Albums.ALBUM_ID + "=?",
        		new String[]{        			
        			albumId+""
        		},
        		null
        );
        cursor.moveToFirst();
        String src = cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Albums.ALBUM_ART ));
        Log.d("UMEZO", "src = "+src);
    	ImageView img = (ImageView)findViewById( R.id.InfoAlbumArt );

        if( src != null ){
        	img.setVisibility( View.VISIBLE );
        	img.setImageURI( Uri.parse( src ));
        }else{
        	img.setVisibility( View.INVISIBLE );
        }

	}



	public void focusButton(int position) {
		this.findViewById( listBtnID[ position ] ).requestFocusFromTouch();
	}
}
