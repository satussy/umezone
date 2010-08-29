package in.tsuyabu.umezo.android.widget;

import android.view.LayoutInflater;

import android.widget.ArrayAdapter;

import android.view.View;
import android.widget.TextView;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams ;

import android.content.Context;
import android.content.ContentResolver;
import android.provider.MediaStore;
import android.database.Cursor;

import java.util.List;
import java.util.HashMap;
import java.io.File;


import in.tsuyabu.umezo.android.directron.R;

@SuppressWarnings("unchecked")
public class PlayListAdapter extends ArrayAdapter {
    private LayoutInflater inflater;
    private HashMap map;

    public PlayListAdapter(Context context, int textViewResourceId, List<File> list ){
		super(context, textViewResourceId, list);
		this.inflater = (LayoutInflater)context.getSystemService( Context.LAYOUT_INFLATER_SERVICE );
        this.map = new HashMap( list.size() );
	}


    @Override
    public View getView( int position , View v , ViewGroup parent ){
        if( v == null ){
            v = inflater.inflate( R.layout.playlist_item , null );
        }

        this.setInfo( position , v );

//        album.setLayoutParams( new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.WRAP_CONTENT) ) ;


        return v;

    }

	private void setInfo( int position , View v ){
        String []label = (String[])map.get( position );

        if( label == null ){

            File f = (File)this.getItem( position);
            if( f == null ){return;}
            ContentResolver resolver = this.getContext().getContentResolver();
            Cursor cursor = resolver.query(
                    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI , 
                    new String[]{
                            MediaStore.Audio.Media.ALBUM ,
                            MediaStore.Audio.Media.ARTIST ,
                            MediaStore.Audio.Media.TITLE , 
                            MediaStore.Audio.Media.TRACK
                    },    // keys for select. null means all
                    MediaStore.Audio.Media.DISPLAY_NAME + "=?",
                    new String[]{
                        f.getName()
                    },
                    null
            );

            if(cursor == null){
                return;
            }
            cursor.moveToFirst();
            String album  = cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ALBUM  ) );
            String artist = cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.ARTIST ) );
            String title  = cursor.getString( cursor.getColumnIndex( MediaStore.Audio.Media.TITLE  ) );
            int    track  = cursor.getInt   ( cursor.getColumnIndex( MediaStore.Audio.Media.TRACK  ) );

            label = new String[]{
                album ,
                title + " / " + artist 
            };

            map.put( position , label );
        }



        TextView titleText = (TextView)v.findViewById( R.id.PlayListItemTitle );
        titleText.setText( label[1] );

        TextView albumText = (TextView)v.findViewById( R.id.PlayListItemAlbum );

        String []prevLabel = (String[])map.get( position - 1 );
        if( prevLabel != null && prevLabel[0].equals( label[0] ) ){
            albumText.setVisibility( View.INVISIBLE );
            albumText.setHeight( 0  );
//            albumText.setText( label[0] );
        } else {
            albumText.setVisibility( View.VISIBLE );
            albumText.setHeight( 60 );
            albumText.setText( label[0] );
        }

	}


}
