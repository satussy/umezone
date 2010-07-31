package in.tsuyabu.umezo.android.directron.appwidget;

import in.tsuyabu.umezo.android.directron.MP;
import in.tsuyabu.umezo.android.directron.R;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import android.util.Log;
import android.widget.RemoteViews;

public class PlayerWidget extends AppWidgetProvider {
	@Override
	public void onUpdate( Context context , AppWidgetManager mgr , int[] appWidgetIds ){
		super.onUpdate(context, mgr, appWidgetIds);
//		Log.d("UMEZO","PlayerWidget.onUpdate");
		context.startService( new Intent( context , PlayerWidgetService.class )); 
		
		
		
		RemoteViews view = new RemoteViews( context.getPackageName() , R.layout.player_widget );
		
		view.setOnClickPendingIntent( R.id.PlayerNext  , PendingIntent.getBroadcast( context , 0, new Intent("NEXT" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerPause , PendingIntent.getBroadcast( context , 0, new Intent("PAUSE"), 0));
		view.setOnClickPendingIntent( R.id.PlayerPlay  , PendingIntent.getBroadcast( context , 0, new Intent("PLAY" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerPrev  , PendingIntent.getBroadcast( context , 0, new Intent("PREV" ), 0));
		view.setOnClickPendingIntent( R.id.PlayerStop  , PendingIntent.getBroadcast( context , 0, new Intent("STOP" ), 0));
		
		
		mgr.updateAppWidget( new ComponentName( context , PlayerWidget.class ) , view );


		

	}
	
	@Override
	public void onReceive(Context context , Intent intent ){
		super.onReceive(context, intent);
//		Log.d("UMEZO","PlayerWidget.onReceive");
		if( "PAUSE".equals(intent.getAction())){
			MP.pause();
		}	
	}
	
	

}
