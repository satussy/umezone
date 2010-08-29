package in.tsuyabu.umezo.android.directron.appwidget;

import in.tsuyabu.umezo.android.directron.MP;
import in.tsuyabu.umezo.android.directron.R;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import android.widget.RemoteViews;

public class PlayerWidgetService extends Service {
	@Override
	public void onStart(Intent intent , int intentId ){
		super.onStart(intent, intentId);
//		Log.d("UMEZO","PlayerWidgetService.onStart");
		RemoteViews view = new RemoteViews( getPackageName() , R.layout.player_widget );
		
		view.setOnClickPendingIntent( R.id.PlayerNext  , PendingIntent.getService( this , 0, new Intent("NEXT" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerPause , PendingIntent.getService( this , 0, new Intent("PAUSE"), 0));
		view.setOnClickPendingIntent( R.id.PlayerPlay  , PendingIntent.getService( this , 0, new Intent("PLAY" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerPrev  , PendingIntent.getService( this , 0, new Intent("PREV" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerStop  , PendingIntent.getService( this , 0, new Intent("STOP" ), 0));
		
		if( "PAUSE".equals(intent.getAction())){
			MP.pause();
		}
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}



}
