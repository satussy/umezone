var CSV = require("csv") , csv = CSV() ;

var tableData = {
  columnNames : {} ,
  rowNames : {} ,
  data : {} 
} ;
csv.fromPath("./temp",{delimiter:"\t"}).on("data",parseLine).on("end", printTable );



//process each line of csv
function parseLine( data ){
  //depends on format of csv read
  var c = data[0] , r = data[2] , d = parseInt( data[3] ) , td = tableData.data ;

  //uniq column and row names
  tableData.columnNames[ c ] = c ;
  tableData.rowNames[ r ] = r ;

  //initialize
  if( !td[ c ] ){
    td[c] = {};
  }

  //store data in table
  td[c][r] = d ;
}



//show table data
function printTable( ){
  var column = keys( tableData.columnNames ) , row = keys( tableData.rowNames ) , d = tableData.data ;


  //print row names
  console.log( "env\t" + row.join("\t") );

  for( var i = 0 , n = column.length ; i < n ; i++ ){
    var c = column[i];
    var printLine = [] ;

    //ready column name
    printLine.push( c );
    for( var j = 0 , m = row.length ; j < m ; j++ ){
      var r = row[j];

      //make line data
      printLine.push( d[ c ][ r ] || "--" );
    }
    console.log( printLine.join("\t") );
  }
}


//return keys array object has
function keys( object ){
  var keys = [] ;
  for( var i in object ){
    keys.push( i );
  }

  return keys ;
}
