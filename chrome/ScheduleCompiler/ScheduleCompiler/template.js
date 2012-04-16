function gottenUserId( uid ){
    var URL_SCHEDULE = "http://intra.klab.org/cgi-bin/klcb/ag.cgi?page=ScheduleUserDay" ,
        targetKey = location.href.split("#").pop() ;

    message( "勤怠データ取得中..." );

    chrome.extension.sendRequest( { 
        action : "get" , 
        args   : [ targetKey ] ,
    } , function( list ){
        list = list.values ;

        message( "スケジュールデータ取得中..." );

        getSchedules( list , function( list ){

            hideMessage();

            //デイリーからウィークィに変換
            list = convertTimecard( list );
    
            saveList( targetKey , list );
            list = loadList( targetKey );
    
            //スケジュール名が一致するときは予め1件にまとめておく
            uniqByScheduleName( list );
    
            renderAll( list , template );
        });
    } );

    //サイボウズから会議予定を取得
    //@param list zaionでパースしたデータ
    function getSchedules( list , callback ){
        var i = 0 , n = list.length , target = null ;
        var xhr = new XMLHttpRequest();

        //ページを取得したらパースして次のページを取得
        xhr.onreadystatechange = function(){
            if( xhr.readyState == 4 ){
                parseSchedule( xhr.responseText );
                get();
            }
        }

        //予定ページのパース
        function parseSchedule( html ){
            var i , n , 

                //表中の予定データを取得
                match = html.match( /<span *class="eventTitle">([^<]*)<\/span>/g ) , 
                event , time , timeStr ;


            if( !match ){ return; }

            for( i = 0 , n = match.length ; i < n ; i++ ){
                try{
                    //予定名を取得
                    event = $( match[i] ).html().split( "&nbsp;" );
                    timeStr = event[0].split( "-" );

                    //予定の専有時間を取得
                    time = strToMinutes( timeStr[1] ) - strToMinutes( timeStr[0] );
                }catch(e){
                    continue;
                }

                target.schedule.push( {
                    date : target.date , 
                    name : event[1] ,
                    time : time ,
                    start: timeStr[0] ,
                    end  : timeStr[1] 
                });
            }
        }

        //予定ページを取得するリクエストを送信
        function get( ){
            message( "スケジュールデータ取得中... " + i + "/" + list.length );
            
            //全日程をクロールしたらコールバックを呼んで終了
            if( i >= n ){ callback( list ); return; }


            target = list[i] ;
            target.schedule = [] ;

            if( target.paid ){ //有休を取得している場合
                target.schedule.push({
                    date : target.date , 
                    name : "有給取得" ,
                    //有給は8h働いたことにする
                    time : 8 * 60 ,
                    start: "09:30"  ,
                    end  : "18:30" 
                });
                setTimeout( get , 1 );
            }if( target.comp ) { //代休を取得している場合

                target.schedule.push({
                    date : target.date , 
                    name : "代休取得" ,
                    //有給は0h働いたことにする
                    time : 0 ,
                    start: "09:30"  ,
                    end  : "09:30" 
                });
                setTimeout( get , 1 );
            }else{
                xhr.open( "GET" , getScheduleURL( target ) , true );
                xhr.send();
            }
            i++;
        }

        get();
    }


    //ザイオンのデータからサイボウズのデイリィ予定ページのURLを生成
    function getScheduleURL( d ){
        d = new Date( d.date );

        var yy = d.getFullYear() ,
            mm = d.getMonth() + 1 ,
            dd = d.getDate() ;
        return URL_SCHEDULE + "&GID=&UID=" + uid + "&Date=da." + [ yy , mm , dd ].join( "." );
    }
}



function message( text ){ $("#message").show().html( text ); }
function hideMessage(  ){ $("#message").slideUp(); }

function uniqByScheduleName( list ){
    var i , n , t , temp = {} ;
    for( i = 0 , n = list.length ; i < n ; i++ ){
        t = list[i];
        t.schedule = innerUniq( t.schedule , t );
    }

    function innerUniq( list , target ){
        var i , n , t , temp = {} , newList = [] , dummy , key , val , _date ;
        for( i = 0 , n = list.length ; i < n ; i++ ){
            t = list[i];

            if( !temp[ t.name ] ){
                dummy = {};
                for( key in t ){
                    dummy[key] = t[key];
                }

                dummy.isUnique = true;

                temp[ t.name ] = dummy ;
              
            }else{
                dummy = temp[ t.name ];
                if( dummy.isUnique ){
                    dummy.isUnique = false;
                    _date = new Date( dummy.date );
                    dummy.name = dummy.name + " " + (_date.getMonth()+1)+"/"+_date.getDate() ;
                }

                _date = new Date( t.date );
                dummy.name += " " + (_date.getMonth()+1) +"/"+ _date.getDate() ;
                dummy.time += t.time ;
            }
        }

        for( i in temp ){
            newList.push( temp[i] );
        }

        return newList ;
    }
}

var template = (function getTemplate(){
    return;
    var id = { header : "#template_content" , tr : "#template_tr" } , key , val ;
    for( key in id ){
        var target = $( id[ key ] );
        if( !target || !target.html() ){ continue; }
        val = target.html().split("<!--")[1].split("-->")[0];
        id[key] = parseTemplate( val );
    }

    function parseTemplate( temp ){ 
        var reg = /{{([^}}]+)}}/g , 
            //matches = temp.match( reg ) ,
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
})();


function renderAll( list , template ){
    var i , n , t , head , table_content , table , html = "";
    for( i = 0 , n = list.length ; i < n ; i++ ){
        t = list[i];

        table_content = makeTableContent( t.schedule );
        table_content += template.tr({
            schedule_time : ((t.time - t.scheduleTime)/60).toFixed(1) ,
            schedule_name : ""
        });

        head = template.header( {
            start_date : timestamp2YYYYMMDD( t.range[0] ),
            end_date   : timestamp2YYYYMMDD( t.range[1] ) ,
            time       : (t.time / 60).toFixed(1),
            table_content : table_content 
        } );

        html += head ;
    }

    $("#content").html( html );

    function makeTableContent( list ){
        var i , n , t , table_content = "" ;
        for( i = 0 , n = list.length ; i < n ; i++ ){
            t = list[i];

            table_content += template.tr( {
                schedule_time : (t.time/60).toFixed(1) ,
                schedule_name : t.name
            });
        }
        return table_content;
    }
}


function timestamp2YYYYMMDD( timestamp ){
    var d = new Date( timestamp ),
        YYYY = d.getFullYear() ,
        MM = ("00" + (d.getMonth()+1)).substr(-2) ,
        DD = ("00" + d.getDate()).substr(-2);
    return YYYY + "/" + MM + "/" + DD ;
}


function loadList( key ){
    var data = localStorage[ key ] ;

    if( !data ){
        return null;
    }

    return JSON.parse( data );
}

function saveList( key , list ){
    var i , n , week , newList = [] ;
    for( i = 0,n = list.length ; i < n ; i++ ){
        week = list[i];

        newList[i] = { 
            range : [ Number( week.range[0] ) , Number( week.range[1] ) ] ,
            schedule : week.schedule ,
            scheduleTime : week.scheduleTime ,
            time : week.time 
        };
    }

    localStorage[ key ] = JSON.stringify( newList );
}


//デイリーで分かれているデータをweeklyに変換する
function convertTimecard( list ){
    var i , n , temp , d , data = [] , 

        //1週間分のデータ
        aData = {} , 

        //週の開始日と終了日
        aRange = [] ,

        //週の総労働時間
        aTime = 0 ,


        //
        aSchedule = [] ,
    x;

    for( i = 0 , n = list.length ; i < n ; i++ ){
        temp = list[i];
        temp.date = d = new Date( temp.date ) ;

        if( isWeekStart( d ) ){
            aData = {} ;
            aTime = 0;
            aRange = [ d ] ;
            aSchedule = [] ;
        }

        aTime += temp.time ;
        aRange[1] = d ;

        aSchedule = aSchedule.concat( temp.schedule );

        if( isWeekEnd( d ) ){
            aData.range = aRange ;
            aData.time = aTime ;
            aData.schedule = aSchedule ;
            aData.scheduleTime = (function( list ) {
                var i , n , temp , sum = 0;
                for( var i = 0 , n = list.length ; i < n ; i++ ){
                    sum += list[i].time ;
                }
                return sum ;
            })( aSchedule );
            data.push( aData );
        }
    }

    return data ;
}

function isWeekStart( d ){ return d.getDay() == 0 || d.getDate() == 1;      }
function isWeekEnd  ( d ){ return d.getDay() == 6 || isLastDayOfMonth( d ); }

function isLastDayOfMonth( d ){
    var yy = d.getFullYear() ,
        mm = d.getMonth() + 2 ,
        lastDay = getLastDayOfMonth( yy , mm );

    return Number( lastDay ) == Number( d );
}

function getLastDayOfMonth( yy , mm ){
    return new Date( Number( new Date( [yy,mm,1].join("/") ) ) - 24 * 3600 * 1000 );
}


/**
 * convert string formatted as "HH:MM" to minutes
 * @param String str formatted string "HH:MM"
 * @param Integer minutes
 */
function strToMinutes( str ){
    str = str.split( ":" );
    return parseInt( str[0] , 10 ) * 60 + parseInt( str[1] , 10 ) ;
}




