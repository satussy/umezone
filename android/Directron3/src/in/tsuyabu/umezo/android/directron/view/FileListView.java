package in.tsuyabu.umezo.android.directron.view;

import in.tsuyabu.umezo.android.directron.ApplicationUtil;
import in.tsuyabu.umezo.android.directron.R;
import in.tsuyabu.umezo.android.directron.app.DirectronMusicService;
import in.tsuyabu.umezo.android.widget.FileAdapter;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import android.app.AlertDialog;
import android.app.Application;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Environment;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;

public class FileListView extends ListView {
	public interface OnItemSelectedListener{
		public void onItemSelected(File f,int option);
	}	
	private OnItemSelectedListener onItemSelectedListener;
	public void setOnItemSelectedListener( OnItemSelectedListener l ){
		this.onItemSelectedListener = l;
	}


	public FileListView(Context context, AttributeSet attrs) {
		super(context, attrs);
		this.setScrollingCacheEnabled(false); 

        this.setLongClickable( true );
        this.setOnItemLongClickListener( new OnItemLongClickListener() {

			@Override
			public boolean onItemLongClick(AdapterView<?> arg0, View arg1,	int arg2, long arg3) {
				FileListView.this.onListItemLongClick( (ListView) arg0 , arg1 , arg2 , arg3 );

				return false;
			}
		});
        
        this.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> arg0, View v, int position , long id) {
				onListItemClick(v, position, id);
			}
		});
        
	}

//////////////////////////////////////////////
	
	
	
	
	private final static int DIALOG_ID_CONTROLER = 0 ;
    private File currentFile;
    private int  currentOption;
    
    public void setCurrentDirectory( String path ){ this.setCurrentDirectory( new File( path )); }
    public void setCurrentDirectory( File f ){
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
        FileAdapter adapter = new FileAdapter( this.getContext() , android.R.layout.simple_list_item_1 , list );

        this.setAdapter(adapter);
    }

    
    protected void onListItemClick(View v, int position, long id) {
        Adapter adapter = this.getAdapter();
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
    	onItemSelectedListener.onItemSelected( f , option );
//        this.setCurrentSetting( f, option);
//
//    	Intent intent = new Intent( this , PlayerActivity.class );
//    	intent.putExtra( "path"   , f      );
//    	intent.putExtra( "option" , option );
//    	startActivity( intent );
    	
    }

//    private void setCurrentSetting( File f , int option ){
//        currentFile = f;
//        currentOption = option;
//    }
    
    
    File selected ;
    protected void onListItemLongClick(ListView l, View v, int position, long id) {
    	Dialog d = this.getControllerDialog();
    	d.show();
		selected = (File) this.getAdapter().getItem( position );
    }
    
    protected Dialog onCreateDialog(int id) {
    	Dialog d = null ;


    	switch( id ){
    		case DIALOG_ID_CONTROLER :
    			d = this.getControllerDialog();
    	}
    	
    	
    	return d;
    }
    
    
    private Dialog getControllerDialog(){
		AlertDialog.Builder builder = new AlertDialog.Builder( this.getContext() );
        LayoutInflater inflater = LayoutInflater.from( this.getContext() );
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

//    @Override
//    public boolean dispatchKeyEvent( KeyEvent e ){
////        Log.d("UMEZO","PlayerActivity dispatchKeyEvent");
//        int keyCode = e.getKeyCode();
////        Log.d("UMEZO","PlayerActivity dispatchKeyEvent keyCode = " + keyCode );
//        boolean through = false;
//        if( KeyEvent.KEYCODE_MENU == keyCode ){
////            Log.d("UMEZO","------------------- menu key was pressed ");
////            Intent intent = new Intent(this,PlaylistActivity.class);
////            startActivity( intent ); 
////
////            return through = false;
//        }else if( KeyEvent.KEYCODE_BACK == keyCode ){
//            if( e.getAction() == KeyEvent.ACTION_UP ){
////                Log.d("UMEZO","------------------- back key was pressed ");
////                String f1 = null , f2 = null ;
////                try{
////                    f1 = ((File)this.getListAdapter().getItem(0)).getCanonicalPath();
////                    f2 = new File( getResources().getString( R.string.defaultPath ) ).getCanonicalPath();
////                }catch(IOException ex){
////
////                }
////                Log.d("UMEZO","FileListActivity : release back button : " + f1 );
////                Log.d("UMEZO","FileListActivity : release back button : " + f2 );
////    
////                if( f1.equals( f2 ) ){
////                    return super.dispatchKeyEvent( e );
////                }else{
////                }
//                    this.setCurrentDirectory( (File)this.getListAdapter().getItem(0) );
//            }
//            return false;
//        }else{
//        }
//        return super.dispatchKeyEvent( e );
//    
//    }
	
	/////////////////////////////////////////////////////
}
