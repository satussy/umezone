function getTemplate( list ){
    var id = {} , key , val , doc = document , i , n ;
    for( i = 0 , n = list.length ; i < n ; i++ ){
        key = list[i];
        val = doc.getElementById( key ).innerHTML.split("<!--")[1].split("-->")[0];
        id[key] = parseTemplate( val );
    }

    function parseTemplate( temp ){ 
        var reg = /{{([^}}]+)}}/g , 
            parts = temp.split( reg ) ,
            src = [] ,
            i , n , t ;

        for( i = 0 , n = parts.length ; i < n ; i++ ){
            t = parts[i].replace(/\n/g,"") ;
            if( t.indexOf("$") == 0 ){
                src.push( "param." + t.replace( "$" , "" ) );
            }else{
                src.push( "'" + t + "'" ) ;
            }
        }

        src = src.join( "+" ) ;

        return new Function( "param" , "return " + src  );
    }

    return id;
}




//--------- sample code
var template = getTemplate(["template_content","template_tr"]) ,
    table_content = template.template_tr({
        time : 10 ,
        detail : "shopping"
    }) ,
    template_content = template.template_content({
        title : "my schedule" ,
        table_content : table_content
    });

document.getElementById( "render" ).innerHTML = template_content ;


/*****
<!-- sample template -->
<div id="template" style="display:none;">
    <div id="template_content">
    <!--
        <div>
            <header>{{$title}}</header>
            <table cellspacing=0 cellpadding=0 border=0 class="list" >
                <tr class="head" >
                    <th class="numeric time" >Time</th>
                    <th class="detail" >Detail</th>
                </tr>
                {{$table_content}}
            </table>
        </div>
    -->
    </div>

    <div id="template_tr">
    <!--
        <tr>
            <td>{{$time}}h</td>
            <td>{{$detail}}</td>
        </tr>
    -->
    </div>
</div>
<div id="render"></div>
***/
