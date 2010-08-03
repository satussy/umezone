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
import in.tsuyabu.umezo.android.io.AndroidAudioFilenameFilter;
import in.tsuyabu.umezo.android.widget.FileAdapter;
import in.tsuyabu.umezo.util.FileComparator;

import java.io.File;
import java.io.IOException;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;


import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.view.LayoutInflater;
//import android.view.Menu;
//import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.KeyEvent ;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.AdapterView.OnItemLongClickListener;

import android.util.Log;

/**
 * This class provides a basic demonstration of how to write an Android
 * activity. Inside of its window, it places a single view: an EditText that
 * displays and edits some internal text.
 */
public class FileListActivity extends ListActivity {
	private final static int DIALOG_ID_CONTROLER = 0 ;
	private FilenameFilter filter ;
	private Comparator<File> comparator ;
    private File currentFile;
    private int  currentOption;

    public FileListActivity(){
        super();
//        Log.d("LIFECICLE", "FileListActivity construct---------------------------------------------");
    }

    /** Called with the activity is first created. */
    @SuppressWarnings("unchecked")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        Log.d("LIFECICLE","FileListActivity onCreate");


        String startPath = getResources().getString( R.string.defaultPath ) ;
        if( savedInstanceState != null){
            startPath = savedInstanceState.getString("path");
        }
//        Log.d("UMEZO","FileListActivity:" + startPath);

        this.comparator = new FileComparator();
        this.filter     = new AndroidAudioFilenameFilter( getResources().getStringArray( R.array.mediaFilenameFilter )) ;
        
        ApplicationUtil.initialize( this.filter , this.comparator );
        this.setCurrentDirectory( startPath );
        
        this.getListView().setLongClickable( true );
        this.getListView().setOnItemLongClickListener( new OnItemLongClickListener() {

			@Override
			public boolean onItemLongClick(AdapterView<?> arg0, View arg1,	int arg2, long arg3) {
				FileListActivity.this.onListItemLongClick( (ListView) arg0 , arg1 , arg2 , arg3 );

				return false;
			}
		});
    }

    @Override
    public void onDestroy( ){
        super.onDestroy();
//        Log.d("LIFECICLE","FileListActivity onDestroy");
    }

    /**
     * Called when the activity is about to start interacting with the user.
     */
    @Override
    protected void onResume() {
        super.onResume();
//        Log.d("LIFECICLE","FileListActivity onResume");
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);        
//        Log.d("LIFECICLE","FileListActivity onSaveInstanceState--------------------------");
//        Log.d("UMEZO","FileListActivity onSaveInstanceState--------------------------");
        if( currentFile != null ){
            outState.putString("path"  ,currentFile.getAbsolutePath());
            outState.putInt   ("option",currentOption);
        }
    }
    
    private void setCurrentDirectory( String path ){ this.setCurrentDirectory( new File( path )); }
    private void setCurrentDirectory( File f ){
        if( !f.exists() ){
            f = Environment.getExternalStorageDirectory();
            if( !f.exists() ){
                f = new File("/");
            }
        }

        
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
        startPlayerActivity( f , DirectronMusicService.OPTION_PLAY_THIS );
    }

    private void startPlayerActivity( File f , int option ){
        this.setCurrentSetting( f, option);

    	Intent intent = new Intent( this , PlayerActivity.class );
    	intent.putExtra( "path"   , f      );
    	intent.putExtra( "option" , option );
    	startActivity( intent );
    	
    }

    private void setCurrentSetting( File f , int option ){
        currentFile = f;
        currentOption = option;
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


        final Dialog d = builder.create();

        OnClickListener onClick = new OnClickListener() {
			@Override
			public void onClick(View v) {
//                Log.d("UMEZO","FileListActivity Dialog:onClick");
				d.dismiss();

                int option = DirectronMusicService.OPTION_PLAY_THIS ;

                switch( v.getId() ){
//                    case R.id.fileListDialogPlay :
//                    break;

                    case R.id.fileListDialogPlayFromThis :
                        option = DirectronMusicService.OPTION_PLAY_DIR_FROM_THIS ;
                    break;
                }

                startPlayerActivity( selected , option );

				selected = null ;
			}
		};

        int listId[] = {
            R.id.fileListDialogPlay ,
            R.id.fileListDialogPlayFromThis
        };

        for( int i = 0 ; i < listId.length ; i++){
            Button btn = ( Button )layout.findViewById( listId[i] );
            btn.setOnClickListener( onClick );
            
        }

        return d ;
    }
//    @Override
//    public boolean dispatchKeyEvent( KeyEvent e ){
//        Log.d("UMEZO","dispatchKeyEvent");
//        if( KeyEvent.KEYCODE_MENU == e.getKeyCode() ){
//            Log.d("UMEZO","------------------- menu key was pressed ");
//        }
//        return false;
//    
//    }
    
    
//    /**
//     * Called when your activity's options menu needs to be created.
//     */
//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        super.onCreateOptionsMenu(menu);
//
//        return true;
//    }

//    /**
//     * Called right before your activity's option menu is displayed.
//     */
//    @Override
//    public boolean onPrepareOptionsMenu(Menu menu) {
//        super.onPrepareOptionsMenu(menu);
//
//
//        return true;
//    }

//    /**
//     * Called when a menu item is selected.
//     */
//    @Override
//    public boolean onOptionsItemSelected(MenuItem item) {
//
//
//
//        return super.onOptionsItemSelected(item);
//    }

//    /**
//     * A call-back for when the user presses the back button.
//     */
//    OnClickListener mBackListener = new OnClickListener() {
//        public void onClick(View v) {
//            finish();
//        }
//    };

    @Override
    public boolean dispatchKeyEvent( KeyEvent e ){
//        Log.d("UMEZO","PlayerActivity dispatchKeyEvent");
        int keyCode = e.getKeyCode();
//        Log.d("UMEZO","PlayerActivity dispatchKeyEvent keyCode = " + keyCode );
        boolean through = false;
        if( KeyEvent.KEYCODE_MENU == keyCode ){
//            Log.d("UMEZO","------------------- menu key was pressed ");
//            Intent intent = new Intent(this,PlaylistActivity.class);
//            startActivity( intent ); 
//
//            return through = false;
        }else if( KeyEvent.KEYCODE_BACK == keyCode ){
            if( e.getAction() == KeyEvent.ACTION_UP ){
//                Log.d("UMEZO","------------------- back key was pressed ");
//                String f1 = null , f2 = null ;
//                try{
//                    f1 = ((File)this.getListAdapter().getItem(0)).getCanonicalPath();
//                    f2 = new File( getResources().getString( R.string.defaultPath ) ).getCanonicalPath();
//                }catch(IOException ex){
//
//                }
//                Log.d("UMEZO","FileListActivity : release back button : " + f1 );
//                Log.d("UMEZO","FileListActivity : release back button : " + f2 );
//    
//                if( f1.equals( f2 ) ){
//                    return super.dispatchKeyEvent( e );
//                }else{
//                }
                    this.setCurrentDirectory( (File)this.getListAdapter().getItem(0) );
            }
            return false;
        }else{
        }
        return super.dispatchKeyEvent( e );
    
    }
}
