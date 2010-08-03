package in.tsuyabu.umezo.android.widget;

import in.tsuyabu.umezo.android.directron.ApplicationUtil;
import in.tsuyabu.umezo.android.directron.R;

import java.io.File;
import java.util.List;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

@SuppressWarnings("unchecked")
public class FileAdapter extends ArrayAdapter {
	private LayoutInflater inflater ;
//	private FilenameFilter filter ;
	public FileAdapter(Context context, int textViewResourceId, List<File> list2 /*, FilenameFilter filter*/ ) {
		super(context, textViewResourceId, list2);
//		this.list = list2 ;
		this.inflater = (LayoutInflater)context.getSystemService( Context.LAYOUT_INFLATER_SERVICE );
//		this.filter = filter;
	}
	@Override
	public View getView( int position , View convertView , ViewGroup parent ){
		View view = convertView;
		if( view == null ){
			view  = inflater.inflate( R.layout.file_list_item , null );
		}
		
		File f = (File)this.getItem( position );
		if( f != null ){
			TextView name  = ((TextView)view.findViewById(R.id.fileName));
			TextView count = ((TextView)view.findViewById(R.id.fileCount));
			
			if( f.isDirectory() ){
				name.setTextColor ( this.getResouceColor( R.color.directory ) );
				count.setTextColor( this.getResouceColor( R.color.directory ) );
				
				//Parent directory ".."
				if( position == 0 ){
					count.setText( "" );
				}else{
					File listFiles[] = ApplicationUtil.listFiles(f);//f.listFiles( this.filter );
					if( listFiles != null ){
						count.setText( listFiles.length + "" );
					}else{
						count.setText( "0" );
					}
				}
			}else{
				name.setTextColor( this.getResouceColor( R.color.file ) );
				name.setText( "" );
				count.setText( "" );
			}
			name.setText( f.getName() );
		}
		
		
		
		return view ;
	}
	
	private int getResouceColor ( int id ){
		return getContext().getResources().getColor(id);
	}
	
	
}
