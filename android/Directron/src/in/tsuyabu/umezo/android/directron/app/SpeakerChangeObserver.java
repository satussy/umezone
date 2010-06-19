package in.tsuyabu.umezo.android.directron.app;

import in.tsuyabu.umezo.android.directron.MP;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.IBinder;

public class SpeakerChangeObserver extends Service {

	@Override
	public IBinder onBind(Intent intent) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public void onStart( Intent intent , int startId ){
		registerReceiver(onBecomingNoisy, filter);
	}
	
	@Override
	public void onDestroy(){
		unregisterReceiver(onBecomingNoisy);
	}
    private static IntentFilter filter = new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);    
    private static BroadcastReceiver onBecomingNoisy = new BroadcastReceiver() {
		
		@Override
		public void onReceive(Context context, Intent intent) {
			MP.pause();
			
		}
	};
	
}
