package in.tsuyabu.umezo.android.io;

import java.io.File;
import java.io.FilenameFilter;


public class AndroidAudioFilenameFilter implements FilenameFilter {
	
	private String [] list ;
	public AndroidAudioFilenameFilter( String [] list ) {
		this.list = list ;
	}

	@Override
	public boolean accept(File dir, String filename) {
		File f = new File( dir , filename );
		
		if( f.isDirectory() ){
			if( filename.startsWith( "." )){
				return filename.startsWith( ".." ) && filename.length() == 2 ;
			}
			return true ;
		}

        if( filename.startsWith(".") ){
            return false;
        }
		
		for( int i = 0 , n = list.length ; i < n ; i++ ){
			if( filename.endsWith( list[i]) ){ return true ; }
		}

		return false;
	}
}
