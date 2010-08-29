/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package in.tsuyabu.umezo.android.directron;

import in.tsuyabu.umezo.android.directron.app.DirectronMusicService;
import in.tsuyabu.umezo.android.directron.view.FileListView;
import in.tsuyabu.umezo.android.directron.view.PlayListView;
import in.tsuyabu.umezo.android.io.AndroidAudioFilenameFilter;
import in.tsuyabu.umezo.util.FileComparator;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Comparator;
import java.util.Timer;
import java.util.TimerTask;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.widget.SeekBar;
import android.widget.ViewFlipper;
import android.widget.SeekBar.OnSeekBarChangeListener;

/**
 * This class provides a basic demonstration of how to write an Android
 * activity. Inside of its window, it places a single view: an EditText that
 * displays and edits some internal text.
 */
public class Main extends Activity {
	
	private boolean isSeeking = false;
	private SeekBar seekBar ;

    private static ViewFlipper flipper;
    
    private static TimerTask timertask = null;
    private static Timer     timer = null;

    private static final Animation inFromLeft = AnimationHelper.inFromLeftAnimation();
    private static final Animation outToRight = AnimationHelper.outToRightAnimation();
    private static final Animation inFromRight = AnimationHelper.inFromRightAnimation();
    private static final Animation outToLeft = AnimationHelper.outToLeftAnimation();
    
    private static int [] listBtn = {
		R.id.btnHeadphone ,
		R.id.btnFolder ,
		R.id.btnNote
    };
    
    
    public Main(){
        super();
//        Log.d("LIFECICLE", "FileListActivity construct---------------------------------------------");
    }

    /** Called with the activity is first created. */
    @SuppressWarnings("unchecked")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.main);
        ApplicationUtil.initialize( 
        		new AndroidAudioFilenameFilter( 
        				getResources().getStringArray( R.array.mediaFilenameFilter ) ) ,
        		new FileComparator() );
        
        ///////////////////////////////
        //Initialze control of view
        //-----------------------------
        flipper =  (ViewFlipper)findViewById(R.id.container);
        
        final OnClickListener onClick = new OnClickListener() {
			@Override
			public void onClick(View v) {

				int tag = (Integer)(v.getTag());
				if( tag == 0){
					flipper.setInAnimation(inFromLeft);
					flipper.setOutAnimation(outToRight);
		            flipper.showPrevious();
				}else if( tag == 1){
				}else if( tag == 2){
					flipper.setInAnimation(inFromRight);
					flipper.setOutAnimation(outToLeft);
		            flipper.showNext();
				}
				
				rotateBtn(v);
				
				updateView(v);
			}
		};

        int length = listBtn.length;
        for( int i = 0 ; i < length ; i++ ){
        	View v = findViewById(listBtn[i]);
        	v.setTag(i);
        	v.setOnClickListener( onClick );
        }
        
        
        ///////////////////////////////
        //Initialze folder view
        //-----------------------------
        String startPath = getResources().getString( R.string.defaultPath ) ;
        //if( savedInstanceState != null){
        //    startPath = savedInstanceState.getString("path");
        //}

        FileListView folderView = (FileListView) findViewById(R.id.folderView);
        folderView.setCurrentDirectory(startPath);
        folderView.setOnItemSelectedListener( new FileListView.OnItemSelectedListener() {
			@Override
			public void onItemSelected(File f, int o ) {
		    	Intent service = new Intent( Main.this , DirectronMusicService.class );
		    	service.setAction(DirectronMusicService.ACTION_INIT);
		    	service.putExtra( "path"   , f);
		    	service.putExtra( "option" , o);
		    	startService(service);
		    }
		});
        
        
        ///////////////////////////////
        //Initialze seek bar
        //	set timer for automatic update
        //-----------------------------
		seekBar = (SeekBar)findViewById(R.id.seekBar);
		seekBar.setOnSeekBarChangeListener( seekOnChange );

		final android.os.Handler handler = new android.os.Handler();
        final Runnable timer = new ProgressTimer();
        
        Main.timertask = new TimerTask() {

			@Override
			public void run() {
				handler.post( timer );
			}
		};
		
		Main.timer = new Timer( );
		
		
		
		
		
		Main.startTimer();

		

    }
    
    private static void startTimer(){
    	if( Main.timer != null && Main.timertask != null ){
    		Main.timer.schedule( Main.timertask , 100 , 500 );
    	}
    }
    
    private static void stopTimer(){
    	if( Main.timer != null ){
    		Main.timer.cancel();
    	}
    }
    
    /**
     * change order of button , if button of tab was clicked
     * @param v
     */
    private void rotateBtn( View v ){
		int dir = (Integer)(v.getTag());
		if( dir == 1 ){return;}
		
		v = (View) v.getParent();
		ViewGroup p = (ViewGroup)v.getParent();
		

    	if( dir == 0 ){
    		dir = 1;

    		v = p.getChildAt( p.getChildCount() - 1 );
    		p.removeView(v);
    		p.addView(v, 0);
    	}else if( dir == 1){
    	}else if( dir == 2){
    		dir = -1;

    		v = p.getChildAt( 0 );
    		p.removeView(v);
    		p.addView(v);
    	}
    	
    	

        int length = listBtn.length;
        for( int i = 0 ; i < length ; i++ ){
        	View btn = findViewById(listBtn[i]);
        	int tag = (Integer)btn.getTag();
        	btn.setTag( (tag+dir+length) % length );
        }
    }
    
    
    /**
     * update view that clicked button
     * @param v
     */
    private void updateView( View v ){
    	if( v.getId() == R.id.btnNote ){
    		((PlayListView)(this.findViewById(R.id.playListView))).updateList();
    	}
    }

	/////////////////////////////////////////////////////////////////////
	// LIFE CICLE
	/////////////////////////////////////////////////////////////////////
    @Override
    public void onDestroy( ){
        super.onDestroy();
        //Log.d("LIFECICLE","FileListActivity onDestroy");
    }

    /**
     * Called when the activity is about to start interacting with the user.
     */
    @Override
    protected void onResume() {
        super.onResume();
        //Log.d("LIFECICLE","FileListActivity onResume");
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        //Log.d("LIFECICLE","FileListActivity onSaveInstanceState--------------------------");
        //Log.d("UMEZO","FileListActivity onSaveInstanceState--------------------------");
    }
    
    
    
    
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
    
    
    
    /**
     * Timer for updating seekBar
     * @author umezo
     *
     */
	private class ProgressTimer implements Runnable{

		@Override
		public void run() {
			if( !isSeeking ){
				Main.this.updateSeekbar();
			}
		}

	}

	/**
	 * update seekbar to current position of music
	 */
	private void updateSeekbar() {
		// TODO Auto-generated method stub
		seekBar.setMax( MP.getDuration() );
		seekBar.setProgress( MP.getPosition() );
		this.onPause();
	}
	
	private void seekTo( int pos ){
		MP.seekTo( pos );		
	}
	
	
	
	protected void onStop(){
		super.onStop();
		Main.stopTimer();
		
	}


}





