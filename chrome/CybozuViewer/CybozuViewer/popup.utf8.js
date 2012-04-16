var container = document.getElementById("container");
var prev = document.getElementById("prev");
var next = document.getElementById("next");

prev.addEventListener( "click" , function(){
    console.log(this , this.date );
    if( !this.date ){ return; }
    getScheduleBy( this.date );
});

next.addEventListener( "click" , function(){
    console.log(this , this.date );
    if( !this.date ){ return; }
    getScheduleBy( this.date );
});


//起動時は当日を読み込む
getScheduleBy( new Date() );


function getScheduleBy( d ){
    if( container.table ){
        container.removeChild( container.table );
    }

    container.table = null ;

    chrome.browserAction.setIcon({path:"getting.ico"});

    if( !d ){ d = new Date(); }

    var dt = d; 

    d = [ d.getFullYear() , d.getMonth()+1 , d.getDate() ].join( "." );
    var url = "http://intra.klab.org/cgi-bin/klcb/ag.cgi?page=ScheduleUserDay&Date=da." + d;
    document.getElementById("date").innerHTML = d;

    var xhr = new XMLHttpRequest();
    xhr.param = dt ;
    xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
    xhr.open("GET", url , true);
    xhr.send();
}

function handleStateChange(){
    if( this.readyState == 1 ){
        //show disable icon
    }else if( this.readyState == 4 ){

        chrome.browserAction.setIcon({path:"loading.ico"});

        var temp = document.createElement( "div" );
        temp.innerHTML = this.responseText;
        temp = temp.getElementsByClassName( "schedule userday" )
        if( temp.length == 0 ){
            //not logged in
            chrome.tabs.create({
                   url : "http://intra.klab.org/cgi-bin/klcb/ag.cgi?page=UserListIndex" 
            });
            chrome.browserAction.setIcon({path:"cybozuoffice.ico"});
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

        container.table = temp;
        container.appendChild( temp ) ;
        setBar( temp );

        prev.date = new Date( Number( this.param ) - 3600 * 24 * 1000 );
        next.date = new Date( Number( this.param ) + 3600 * 24 * 1000 );
        console.log( prev.date  );
        console.log( this.param );
        console.log( next.date );

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
            var 
                //スケジュール表の長さ
                height = bottom - top ,
                d = new Date() , 
                //8時からの予定なので8引く
                h = d.getHours() - 8 ,
                //1時間の割合にしておく
                m = d.getMinutes() / 60 ;
            //表のラストが20時なので20から引く
            //return height * ( h + m ) / ( 20 - 8 ) + top - bar.offsetHeight ;
            //このタイミングだとbar.offsetHeightが0なので固定値を引く
            return height * ( h + m ) / ( 20 - 8 ) + top - 17;
        })( bar , topY , bottomY );

    bar.style.display = "block" ;
    bar.style.top = barY + "px" ;
}
