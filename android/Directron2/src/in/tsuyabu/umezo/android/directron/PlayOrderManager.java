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
	

	public PlayOrderManager( File dir , File target ){
		this.setFileList( dir , list );

        int i = 0 ;
        if( target != null ){
            i = list.lastIndexOf( getFirstFile( target ) );
        }

        setAt( i );
	}

    private File getFirstFile( File f ){
        if( f.isFile() ){
            return f;
        }
        File children [] = ApplicationUtil.listFiles( f );
        for( int i = 0 , n = children.length ; i < n ; i++ ){
            File _f = getFirstFile( children[i] );
            if( _f != null && _f.isFile() ){
                return _f;
            }
        }

        return null;
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


    public void setAt( int index ){
        iter = list.listIterator( index );
    }

    public void gotoHead(){
        setAt(0);
    }

    public void gotoTail(){
        setAt( list.size() );
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

    public boolean hasNext    (){ return iter.hasNext    (); }
    public boolean hasPrevious(){ return iter.hasPrevious(); }

    public List getCurrentList(){
        return list;
    }

}
