package in.tsuyabu.umezo.android.directron.app;

import java.io.File;
import java.util.Arrays;

import in.tsuyabu.umezo.android.directron.PlayOrderManager;
import in.tsuyabu.umezo.android.directron.Main;
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
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.widget.ImageView;
import android.widget.RemoteViews;
import android.widget.TextView;



public class PlayerActivity extends Activity{
    private File currentFile;
    private int  currentOption;
    private void setCurrentSetting( File f , int option ){
        currentFile = f;
        currentOption = option;
    }

	private static boolean isSeeking = false ;
	private static int[] listBtnID = {
		R.id.PlayerPlay  ,
		R.id.PlayerPause ,
		R.id.PlayerPrev  ,
		R.id.PlayerNext  ,
		R.id.PlayerStop  
	};
	
    public PlayerActivity (){
        super();
//        Log.d("LIFECICLE", "PlayerActivity construct---------------------------------------------");
    }

	@Override
	protected void onDestroy(){
		super.onDestroy();
//        Log.d("LIFECICLE", "PlayerActivity onDestroy");

	}


	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        Log.d("LIFECICLE", "PlayerActivity onCreate");
//        Log.d("UMEZO"    , "PlayerActivity onCreate");
        if( savedInstanceState != null){
//            Log.d("UMEZO","PlayerActivity:" + savedInstanceState.getString("path"));
        }

        setContentView( R.layout.player_activity );
        
        Intent myIntent = getIntent();

        File f = (File)    myIntent.getSerializableExtra( "path" ) ;
        int  o = (Integer) myIntent.getSerializableExtra( "option" ) ;

        setCurrentSetting( f,o);
        
    	Intent service = new Intent( this , DirectronMusicService.class );
    	service.setAction(DirectronMusicService.ACTION_INIT);
    	service.putExtra( "path"   , f);
    	service.putExtra( "option" , o);
    	startService(service);

        

	}
	
	@Override
	protected void onResume() {
        super.onResume();
//        Log.d("LIFECICLE", "PlayerActivity onResume");
    }

	@Override
	protected void onPause() {
        super.onPause();
//        Log.d("LIFECICLE", "PlayerActivity onPause");
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);        
//        Log.d("LIFECICLE","PlayerActivity onSaveInstanceState--------------------------");
//        Log.d("UMEZO"    ,"PlayerActivity onSaveInstanceState--------------------------");
        if( currentFile != null ){
            outState.putString("path"  ,currentFile.getAbsolutePath());
            outState.putInt   ("option",currentOption);
        }
    }


    @Override
    public boolean dispatchKeyEvent( KeyEvent e ){
//        Log.d("UMEZO","PlayerActivity dispatchKeyEvent");
        int keyCode = e.getKeyCode();
//        Log.d("UMEZO","PlayerActivity dispatchKeyEvent keyCode = " + keyCode );
        boolean through = false;
        if( KeyEvent.KEYCODE_MENU == keyCode ){
//            Log.d("UMEZO","------------------- menu key was pressed ");
            Intent intent = new Intent(this,PlaylistActivity.class);
            startActivity( intent ); 

            return through = false;
        }else if( KeyEvent.KEYCODE_BACK == keyCode ){
//            Log.d("UMEZO","------------------- back key was pressed ");
//            Intent intent = new Intent(this,FileListActivity.class);
//            startActivity( intent ); 
        }else{
        }
        return super.dispatchKeyEvent( e );
    
    }
}
