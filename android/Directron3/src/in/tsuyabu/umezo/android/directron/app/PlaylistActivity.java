package in.tsuyabu.umezo.android.directron.app;
import android.os.Bundle;
import android.app.Activity;
import android.util.Log;
import in.tsuyabu.umezo.android.directron.R;
import android.widget.ListView;
import android.widget.ListAdapter;
import android.widget.AdapterView.OnItemClickListener;
import in.tsuyabu.umezo.android.directron.app.DirectronMusicService;
import java.util.List;
import android.widget.AdapterView;
import android.view.View;

import android.content.Intent;

import in.tsuyabu.umezo.android.widget.PlayListAdapter ;


public class PlaylistActivity extends Activity{
    public PlaylistActivity (){
        super();
//        Log.d("LIFECICLE", "PlaylistActivity construct---------------------------------------------");
    }



    @SuppressWarnings("unchecked")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
//        Log.d("LIFECICLE", "PlaylistActivity onCreate");

        setContentView( R.layout.playlist_activity);

        ListView view = (ListView)this.findViewById( R.id.PlayListList );
        view.setOnItemClickListener( new OnItemClickListener(){ 
            public void onItemClick(AdapterView<?> parent, View view, int position, long id){
//                Log.d("UMEZO","PlaylistActivity:onItemClick");
                Intent service = new Intent( PlaylistActivity.this , DirectronMusicService.class );
                service.setAction( DirectronMusicService.ACTION_PLAY_AT );
                service.putExtra( "at"   , position      );
                PlaylistActivity.this.startService(service);
            }
        } );

        List list = DirectronMusicService.getCurrentList();
        
        ListAdapter adapter = new PlayListAdapter( this , R.layout.rawtext , list );
//        Log.d("UMEZO","PlaylistActivity:" + list    );
//        Log.d("UMEZO","PlaylistActivity:" + adapter );
        view.setAdapter( adapter );
        
//        DirectronMusicService.setOnChangeSouce(this.handler);
//        updateInfo( DirectronMusicService.getCurrentFile() );
//        
//        View v = findViewById(R.id.PlayerView );
//        v.setOnTouchListener( new OnTouchPlayer( this ) );
//        
//        this.fitAlbumArt();
	}

	@Override
	protected void onDestroy() {
        super.onDestroy();
//        Log.d("LIFECICLE", "PlaylistActivity onDestroy");
    }

	@Override
	protected void onResume() {
        super.onResume();
//        Log.d("LIFECICLE", "PlaylistActivity onResume");
    }
}
