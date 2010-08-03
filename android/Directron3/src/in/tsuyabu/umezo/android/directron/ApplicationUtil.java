package in.tsuyabu.umezo.android.directron;



import java.io.File;
import java.io.FilenameFilter;

import java.util.Arrays;
import java.util.Comparator;



public class ApplicationUtil {
	private static FilenameFilter filter ;
	private static Comparator<File> comparator;
	
	public static void initialize( FilenameFilter filter , Comparator<File> comparator ){
		ApplicationUtil.filter = filter;
		ApplicationUtil.comparator = comparator ;
	}
	public static File[] listFiles( File f ){
		File [] list ;
		if( f.isDirectory() ){
			list = f.listFiles(filter);
			if( list != null ){
				Arrays.sort( list , comparator );
			}
		}else{
			list= new File[]{};
		}
		return list;
	}
	
	
	public static String getTimeText( int sec ){
		sec = (int)sec/1000;
		int minutes = (int)sec/60;
		sec = sec % 60 ;
		
		return String.format( "%02d:%02d" , minutes , sec );
	}


}
