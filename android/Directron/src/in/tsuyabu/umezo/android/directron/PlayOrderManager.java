package in.tsuyabu.umezo.android.directron;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class PlayOrderManager {

	private List<File> list = new ArrayList<File>();
	private ListIterator<File> iter ;
	
	public PlayOrderManager( File f ){
		this.setFileList(f, list);
		iter = list.listIterator();
	}
	
	private void setFileList( File f , List<File> list ){
		if( f.isFile() ){
			list.add( f );
		}else if( f.isDirectory() ){
			File children [] = ApplicationUtil.listFiles( f );
			for( int i = 0 , n = children.length ; i < n ; i++ ){
				setFileList( children[i] , list); 
			}
		}
	}

	
	public File getNext( ){
		if( !iter.hasNext() ){
			return null;
		}
		return iter.next();
	}


    public File getPrev(){
    	if( !iter.hasPrevious() ){
    		return null;
    	}
        return iter.previous();

    }


}
