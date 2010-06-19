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

import in.tsuyabu.umezo.android.directron.R;
import in.tsuyabu.umezo.android.directron.app.DirectronMusicService;
import in.tsuyabu.umezo.android.directron.app.PlayerActivity;
import in.tsuyabu.umezo.android.directron.appwidget.PlayerWidgetService;
import in.tsuyabu.umezo.android.io.AndroidAudioFilenameFilter;
import in.tsuyabu.umezo.android.widget.FileAdapter;
import in.tsuyabu.umezo.util.FileComparator;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ListActivity;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.View.OnLongClickListener;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemLongClickListener;

/**
 * This class provides a basic demonstration of how to write an Android
 * activity. Inside of its window, it places a single view: an EditText that
 * displays and edits some internal text.
 */
public class FileListActivity extends ListActivity {
	private final static int DIALOG_ID_CONTROLER = 0 ;
	private FilenameFilter filter ;
	private Comparator<File> comparator ;

    private EditText mEditor;
    
    public FileListActivity() {
    }

    /** Called with the activity is first created. */
    @SuppressWarnings("unchecked")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.comparator = new FileComparator();
        this.filter     = new AndroidAudioFilenameFilter( getResources().getStringArray( R.array.mediaFilenameFilter )) ;
        
        ApplicationUtil.initialize( this.filter , this.comparator );
        this.setCurrentDirectory( getResources().getString( R.string.defaultPath ) );
        
        this.getListView().setLongClickable( true );
        this.getListView().setOnItemLongClickListener( new OnItemLongClickListener() {

			@Override
			public boolean onItemLongClick(AdapterView<?> arg0, View arg1,	int arg2, long arg3) {
				FileListActivity.this.onListItemLongClick( (ListView) arg0 , arg1 , arg2 , arg3 );

				return false;
			}
		});
		


        

    }

    /**
     * Called when the activity is about to start interacting with the user.
     */
    @Override
    protected void onResume() {
        super.onResume();
    }
    
    private void setCurrentDirectory( String path ){ this.setCurrentDirectory( new File( path )); }
    private void setCurrentDirectory( File f ){

        
        File[] fileArray = ApplicationUtil.listFiles(f);

        List<File> list = new ArrayList<File>( Arrays.asList( fileArray ) );
        if( f.getParentFile() != null){
       		list.add( 0 , new File( f , ".." ) );
        }
        FileAdapter adapter = new FileAdapter( this , android.R.layout.simple_list_item_1 , list , this.filter );

        this.setListAdapter(adapter);
    }

    
    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        super.onListItemClick(l, v, position, id);
        Adapter adapter = this.getListAdapter();
        File f = (File)adapter.getItem( position );
        if( f.isDirectory() ){
        	this.setCurrentDirectory(f);
        }else{
        	startPlayerActivity(f);
        }
    }
    
    private void startPlayerActivity( File f ){
    	Intent service = new Intent( this , DirectronMusicService.class );
    	service.setAction(DirectronMusicService.ACTION_INIT);
    	service.putExtra( "path" , f );
    	startService(service);

    	Intent intent = new Intent( this , PlayerActivity.class );
    	startActivity( intent );
    	
    }
    
    
    File selected ;
    protected void onListItemLongClick(ListView l, View v, int position, long id) {
		showDialog( DIALOG_ID_CONTROLER );
		selected = (File) this.getListAdapter().getItem( position );

    }
    
    @Override
    protected Dialog onCreateDialog(int id) {
    	Dialog d = null ;


    	switch( id ){
    		case DIALOG_ID_CONTROLER :
    			d = this.getControllerDialog();
    	}
    	
    	
    	return d;
    }
    
    
    private Dialog getControllerDialog(){
		AlertDialog.Builder builder = new AlertDialog.Builder( this );
        LayoutInflater inflater = LayoutInflater.from( this );
        View layout = inflater.inflate( R.layout.file_list_long_click_dialog , null );
        builder.setView( layout );
        
        Button b = ( Button )layout.findViewById( R.id.fileListDialogPlay );
        final Dialog d = builder.create();
        b.setOnClickListener( new OnClickListener() {
			@Override
			public void onClick(View v) {
				d.dismiss();
				startPlayerActivity( selected );
				selected = null ;
			}
		});
        
        return d ;
    }
    
    
    /**
     * Called when your activity's options menu needs to be created.
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);

        return true;
    }

    /**
     * Called right before your activity's option menu is displayed.
     */
    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        super.onPrepareOptionsMenu(menu);


        return true;
    }

    /**
     * Called when a menu item is selected.
     */
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {



        return super.onOptionsItemSelected(item);
    }

    /**
     * A call-back for when the user presses the back button.
     */
    OnClickListener mBackListener = new OnClickListener() {
        public void onClick(View v) {
            finish();
        }
    };

    /**
     * A call-back for when the user presses the clear button.
     */
    OnClickListener mClearListener = new OnClickListener() {
        public void onClick(View v) {
            mEditor.setText("");
        }
    };
}
