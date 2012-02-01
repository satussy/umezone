var bindOnce = (function(){
    var binded = false ;
    return function(){
        if( binded ){ return; }

        $(window).bind( "beforeunload" , function( e ){
            return "ページを閉じると作業の途中経過は保存されません。\nページをとじてもいいですか？" ;
        });

        binded = true ;
    };
})();


$("#content table tr th.edit").live("click" , function (e){
    var t = $(e.target) , weekRoot = t.parentsUntil("div.week").last() , cmd ;
    if( t.hasClass("menu") ) {
        cmd = t.attr( "cmd" );
        window[cmd]( weekRoot );

        bindOnce();
    }else if( !weekRoot.hasClass( "edit" ) ){
        weekRoot.addClass("edit");
    }
});

$("#content table tr td.time").live("change" , function (e){
    updateList( $(e.target).parentsUntil("div.week").last() );
    bindOnce();
});

function check( weekRoot ){
    var reg = request( "正規表現でチェックを入れます" ) ;

    reg = new RegExp( reg );

    $( weekRoot ).find("tr.dataRow").each( function(i,e){
        e = $(e);
        var text = e.find( "td.detail input" ).val() ;
        if( text.match( reg ) ){
            e.find("td.edit input").attr("checked",true);
        }
    });
}

function cancel( weekRoot ){
    weekRoot.removeClass( "edit" );
}

function remove( weekRoot ){
    var list = weekRoot.find( "input[checked]" );
    if( list.length == 0 ){
        info( "削除するスケジュールをチェックしてください" );
    }else{
        if( ask( list.length + "件のスケジュールを削除してもいいですか？\nこの操作はやり直せません。" ) ){
            list.parent().parent().remove();
            updateList( weekRoot );
        }
    }
}

function merge( weekRoot ){
    var list = weekRoot.find( "input[checked]" );
    if( list.length == 0 ){
        info( "マージするスケジュールをチェックしてください" );
    }else{
        if( ask( list.length + "件のスケジュールをマージしてもいいですか？\nこの操作はやり直せません。" ) ){
            (function( list ){
                var targets = list.parent().parent() , 
                    listTime   = targets.find( ".time input" ) ,
                    listDetail = targets.find( ".detail input" ) ,
                    time = 0 , detail = "" ; 
                    
                listTime.each( function(){
                    time += parseFloat( this.value )
                });

                listDetail.each( function(){
                    if( detail != "" ){
                        detail += ",";
                    }
                    detail += this.value ;
                });

                listTime.first().val( time.toFixed( 1 ) );
                listDetail.first().val( detail );
                list.first().attr( "checked" , false );
                list.filter( function( index ){
                    return index != 0;
                }).parent().parent().remove();

            })( list );
        }
    }
}

function updateList( weekRoot ){


    var list = weekRoot.find( ".time input" ) ,
        weekTime = parseFloat( weekRoot.find( "span.weekTime").html() );
    list.each( function(){
        weekTime -= $(this).val();
    });

    if( weekTime.toFixed(1) != 0 ){
        addRow( weekRoot , weekTime );
    }

    (function( list ){
        console.log(list);
        if( list.length == 1 ){ return; }
        var targets = list.parent().parent() , 
            listTime   = targets.find( ".time input" ) ,
            time = 0 ;
                    
        listTime.each( function(){
            time += parseFloat( this.value )
        });

        listTime.last().val( time.toFixed( 1 ) );

        list.filter( function( index ){
            return index != list.length - 1 ;
        }).parent().parent().remove();

    })( $(weekRoot).find( ".detail input").filter( function(){
        console.log( $(this).val() );
        return $(this).val() == "" ;
    }) );

    console.log( weekTime );
}

function addRow( weekRoot , time ){
    $( template.tr({
        schedule_time : parseFloat( time ).toFixed( 1 ) ,
        schedule_name : ""
    }) ).insertBefore( $(weekRoot).find("tr").last() ) ;
}

function info( title ){
    startOverlay();
    alert( title );
    endOverlay();
}

function ask( title ){
    startOverlay();
    var a = confirm( title );
    endOverlay();

    return a;
}

function request( title , def ){
    startOverlay();
    var a = prompt( title );
    endOverlay();

    return a;
}

function startOverlay(){ $("#overlay").addClass("on"); }
function   endOverlay(){ $("#overlay").removeClass("on"); }

