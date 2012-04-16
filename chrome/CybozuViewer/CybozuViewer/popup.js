chrome.browserAction.setIcon({path:"getting.ico"});
var url = "http://intra.klab.org/cgi-bin/klcb/ag.cgi?page=ScheduleUserDay" ;

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", url , true);
xhr.send();

function handleStateChange(){
    if( this.readyState == 1 ){
        //show disable icon
    }else if( this.readyState == 4 ){
        chrome.browserAction.setIcon({path:"loading.ico"});

        var temp = document.createElement( "div" );
        temp.innerHTML = this.responseText;
        temp = temp.getElementsByClassName( "schedule userday" )
        if( temp.length == 0 ){
            //ÉçÉOÉCÉìÇµÇƒÇ»Ç¢
            chrome.tabs.create({
                   url : "http://intra.klab.org/cgi-bin/klcb/ag.cgi?page=UserListIndex" 
            });
            return ;
        }

        temp = temp[0];
        var list = temp.getElementsByTagName("a");
        for( var i = 0 , n = list.length ; i < n ; i++ ){
            var item = list[i];
            item.addEventListener( "click" , function (){
	            chrome.tabs.create({
	                   url : "http://intra.klab.org/cgi-bin/klcb/" + this.getAttribute("href")
	            });
            });
        }
        document.getElementById("container").appendChild( temp ) ;

        setBar( temp );
        chrome.browserAction.setIcon({path:"cybozuoffice.ico"});

    }
}

function setBar ( table ) {
        var 
            bar     =  document.getElementById("bar")  ,
            rows    = table.getElementsByTagName("tr") , 
            topY    = rows[ 1 ].offsetTop , 
            bottomY = (function(row){
                return row.offsetTop + row.offsetHeight ;
            })(rows[ rows.length - 1 ]) ,

            barY = (function( bar , top , bottom ){
                var height = bottom - top ,
                    d = new Date() , 
                    h = d.getHours() - 8 ,
                    m = d.getMinutes() / 60 ;
                return height * ( h + m ) / ( 20 - 8 ) + top - bar.offsetHeight ;
            })( bar , topY , bottomY );
       bar.style.display = "block" ;
       bar.style.top = barY + "px" ;
}
