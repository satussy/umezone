package in.tsuyabu.umezo.android.directron.view;

import in.tsuyabu.umezo.android.directron.R;
import in.tsuyabu.umezo.android.directron.app.DirectronMusicService;
import in.tsuyabu.umezo.android.widget.PlayListAdapter;

import java.io.File;
import java.util.List;

import android.content.Context;
import android.content.Intent;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListAdapter;
import android.widget.ListView;

public class PlayListView extends ListView {

	public PlayListView(Context context, AttributeSet attrs) {
		super(context, attrs);
		this.setScrollingCacheEnabled(false);
		
		this.setOnItemClickListener( new OnItemClickListener(){ 
            public void onItemClick(AdapterView<?> parent, View view, int position, long id){
//              Log.d("UMEZO","PlaylistActivity:onItemClick");
              Intent service = new Intent( PlayListView.this.getContext() , DirectronMusicService.class );
              service.setAction( DirectronMusicService.ACTION_PLAY_AT );
              service.putExtra( "at"   , position      );
              PlayListView.this.getContext().startService(service);
            }
		} );
	}
	
	public void updateList(){
		List<File> list = DirectronMusicService.getCurrentList();
		if( list == null ){ return; }
		
		
		ListAdapter adapter = new PlayListAdapter( this.getContext() , R.layout.rawtext , list );
		
		this.setAdapter( adapter );
	}

}
