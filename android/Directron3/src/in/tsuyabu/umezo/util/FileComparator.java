package in.tsuyabu.umezo.util;

import java.io.File;

@SuppressWarnings("unchecked")
public class FileComparator implements java.util.Comparator{
	public int compare(Object o1 ,Object o2){
		if( !(o1 instanceof File) || !(o2 instanceof File)  ){
			return 0;
		}
		File f1 = (File)o1 ;
		File f2 = (File)o2 ;
		
		String n1 = f1.getName();
		String n2 = f2.getName();

		if( f1.isDirectory() && !f2.isDirectory() ){
			return -1;
		}
		
		if( !f1.isDirectory() && f2.isDirectory() ){
			return 1;
		}
		
		if( n1.compareToIgnoreCase( n2 ) != 0 ){
			return n1.compareToIgnoreCase( n2 );
		}
			
		return n1.compareTo( n2 );
	}
}