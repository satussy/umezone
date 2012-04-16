var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
                    "use strict";

                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    if (typeof Date.prototype.toJSON !== 'function') {

                        Date.prototype.toJSON = function (key) {

                            return isFinite(this.valueOf()) ?
                                this.getUTCFullYear()     + '-' +
                                f(this.getUTCMonth() + 1) + '-' +
                                f(this.getUTCDate())      + 'T' +
                                f(this.getUTCHours())     + ':' +
                                f(this.getUTCMinutes())   + ':' +
                                f(this.getUTCSeconds())   + 'Z' : null;
                        };

                        String.prototype.toJSON      =
                            Number.prototype.toJSON  =
                            Boolean.prototype.toJSON = function (key) {
                                return this.valueOf();
                            };
                    }

                    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        gap,
                        indent,
                        meta = {    // table of character substitutions
                            '\b': '\\b',
                            '\t': '\\t',
                            '\n': '\\n',
                            '\f': '\\f',
                            '\r': '\\r',
                            '"' : '\\"',
                            '\\': '\\\\'
                        },
                        rep;


                    function quote(string) {

                // If the string contains no control characters, no quote characters, and no
                // backslash characters, then we can safely slap some quotes around it.
                // Otherwise we must also replace the offending characters with safe escape
                // sequences.

                        escapable.lastIndex = 0;
                        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                            var c = meta[a];
                            return typeof c === 'string' ? c :
                                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        }) + '"' : '"' + string + '"';
                    }


                    function str(key, holder) {

                // Produce a string from holder[key].

                        var i,          // The loop counter.
                            k,          // The member key.
                            v,          // The member value.
                            length,
                            mind = gap,
                            partial,
                            value = holder[key];

                // If the value has a toJSON method, call it to obtain a replacement value.

                        if (value && typeof value === 'object' &&
                                typeof value.toJSON === 'function') {
                            value = value.toJSON(key);
                        }

                // If we were called with a replacer function, then call the replacer to
                // obtain a replacement value.

                        if (typeof rep === 'function') {
                            value = rep.call(holder, key, value);
                        }

                // What happens next depends on the value's type.

                        switch (typeof value) {
                        case 'string':
                            return quote(value);

                        case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                            return isFinite(value) ? String(value) : 'null';

                        case 'boolean':
                        case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                            return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

                        case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                            if (!value) {
                                return 'null';
                            }

                // Make an array to hold the partial results of stringifying this object value.

                            gap += indent;
                            partial = [];

                // Is the value an array?

                            if (Object.prototype.toString.apply(value) === '[object Array]') {

                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-JSON values.

                                length = value.length;
                                for (i = 0; i < length; i += 1) {
                                    partial[i] = str(i, value) || 'null';
                                }

                // Join all of the elements together, separated with commas, and wrap them in
                // brackets.

                                v = partial.length === 0 ? '[]' : gap ?
                                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                                    '[' + partial.join(',') + ']';
                                gap = mind;
                                return v;
                            }

                // If the replacer is an array, use it to select the members to be stringified.

                            if (rep && typeof rep === 'object') {
                                length = rep.length;
                                for (i = 0; i < length; i += 1) {
                                    if (typeof rep[i] === 'string') {
                                        k = rep[i];
                                        v = str(k, value);
                                        if (v) {
                                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                        }
                                    }
                                }
                            } else {

                // Otherwise, iterate through all of the keys in the object.

                                for (k in value) {
                                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                                        v = str(k, value);
                                        if (v) {
                                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                        }
                                    }
                                }
                            }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                            v = partial.length === 0 ? '{}' : gap ?
                                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                                '{' + partial.join(',') + '}';
                            gap = mind;
                            return v;
                        }
                    }

                // If the JSON object does not yet have a stringify method, give it one.

                    if (typeof JSON.stringify !== 'function') {
                        JSON.stringify = function (value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                            var i;
                            gap = '';
                            indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                            if (typeof space === 'number') {
                                for (i = 0; i < space; i += 1) {
                                    indent += ' ';
                                }

                // If the space parameter is a string, it will be used as the indent string.

                            } else if (typeof space === 'string') {
                                indent = space;
                            }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                            rep = replacer;
                            if (replacer && typeof replacer !== 'function' &&
                                    (typeof replacer !== 'object' ||
                                    typeof replacer.length !== 'number')) {
                                throw new Error('JSON.stringify');
                            }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                            return str('', {'': value});
                        };
                    }


                // If the JSON object does not yet have a parse method, give it one.

                    if (typeof JSON.parse !== 'function') {
                        JSON.parse = function (text, reviver) {

                // The parse method takes a text and an optional reviver function, and returns
                // a JavaScript value if the text is a valid JSON text.

                            var j;

                            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                                var k, v, value = holder[key];
                                if (value && typeof value === 'object') {
                                    for (k in value) {
                                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                                            v = walk(value, k);
                                            if (v !== undefined) {
                                                value[k] = v;
                                            } else {
                                                delete value[k];
                                            }
                                        }
                                    }
                                }
                                return reviver.call(holder, key, value);
                            }


                // Parsing happens in four stages. In the first stage, we replace certain
                // Unicode characters with escape sequences. JavaScript handles many characters
                // incorrectly, either silently deleting them, or treating them as line endings.

                            text = String(text);
                            cx.lastIndex = 0;
                            if (cx.test(text)) {
                                text = text.replace(cx, function (a) {
                                    return '\\u' +
                                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                                });
                            }

                // In the second stage, we run the text against regular expressions that look
                // for non-JSON patterns. We are especially concerned with '()' and 'new'
                // because they can cause invocation, and '=' because it can cause mutation.
                // But just to be safe, we want to reject all unexpected forms.

                // We split the second stage into 4 regexp operations in order to work around
                // crippling inefficiencies in IE's and Safari's regexp engines. First we
                // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                // replace all simple value tokens with ']' characters. Third, we delete all
                // open brackets that follow a colon or comma or that begin the text. Finally,
                // we look to see that the remaining characters are only whitespace or ']' or
                // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                            if (/^[\],:{}\s]*$/
                                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                                return typeof reviver === 'function' ?
                                    walk({'': j}, '') : j;
                            }

                // If the text is not JSON parseable, then a SyntaxError is thrown.

                            throw new SyntaxError('JSON.parse');
                        };
                    }
}());
///------------ end json library ----------------------------------------

var console = (function(){
        var out = fl.outputPanel ;
        return {
            log : function (){
                var text = [].slice.apply( arguments ).join(",");
                out.trace( text );
            },
            clear : function ( ){
                out.clear();
            },
            save : function ( path ) {
                out.save( path );
            }

        };
})();

function each( list , func ){
        var i , n , e , result ;
        for( i = 0 , n = list.length ; i < n ; i++ ){
            e = list[i];
            if( func( e , i ) === false ){
                break;
            }







        }
}

function toObject( list , keys ){
        if( list.constructor == Array ){
            var val = [];
            for( var i = 0 , n = list.length ; i < n ; i++ ){
                val.push( toObject( list[i] , keys ) );
            }

            return val ;
        }else{
            var i , n , key , obj = {} ;
            for( i = 0 , n = keys.length ; i < n ; i++ ){
                key = keys[ i ];
                obj[ key ] = list[ key ];
            }

            return obj;
        }
}

function eachFrame( func ){
        var tl = doc.getTimeline();
        var layers = tl.layers , aLayer ;
        var i = 0 , n = 0 , j = 0 , m = 0;
        var resultLayer = [];
        for( i = 0 , n = layers.length ; i < n ; i++ ){
            aLayer = layers[i];
            var frames = aLayer.frames , aFrame ;

            resultLayer.push( func( frames , i , aLayer ) );
        }

        return resultLayer;
}

function getDocumentFolderURI( doc ){
    if( !doc ){
        doc = fl.getDocumentDOM();
    }
    var lastIndex = doc.pathURI.lastIndexOf( "/" );
    return doc.pathURI.substr( 0 , lastIndex );
}
///------------ end library      ----------------------------------------

//あるレイヤーのタイムライン上のフレームを処理する
//  JsonExport可能なオブジェクトに変換する
function processFrame( frame , layerIndex , layer ) {
    //とりあえず、表示物が置かれているレイヤーだけを対象とする
    if( !( layer.layerType == "normal" || layer.layerType == "guided" || layer.layerType == "masked" ) ){ return; }

    var 
    //Tweenの1フレームあたりの差分を計算する関数群
    Delta = {
            top               : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            left              : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            scaleX            : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            scaleY            : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            skewX             : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            skewY             : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            rotation          : function( p1 , p2 , duration ){ return (p2-p1)/duration    ; } ,
            colorAlphaPercent : function( p1 , p2 , duration ){ return (p2-p1)/duration/100; }
    } , 
    //Flashのプロパティ名とJSのプロパティ名の変換辞書
    JSProp = {
        top               : "y" ,
        left              : "x" ,
        scaleX            : "scaleX" ,
        scaleY            : "scaleY" ,
        skewX             : "skewX" ,
        skewY             : "skewY" ,
        rotation          : "rotation" ,
        colorAlphaPercent : "opacity" 
    } , 
    //FlashのプロパティでTweenの元にあたる値が設定されていない時に初期値として使う値
    Defaults = {
        top               : 0 ,
        left              : 0 , 
        scaleX            : 1 , 
        scaleY            : 1 , 
        skewX             : 0 ,
        skewY             : 0 ,
        rotation          : 0 , 
        colorAlphaPercent : 0
    } , 
    //JSにエクスポートするFlashのインスタンスのプロパティ
    ExportKeys = [ "top" , "left" , "x" , "y" , "skewX" , "skewY" , "scaleX" , "scaleY" , "height" , "width" , "name" , "colorAlphaPercent" , "rotation" ] , 
    //Tween対応するFlashインスタンスのプロパティ
    TweenKeys  = [ "top" , "left"             , "skewX" , "skewY" , "scaleX" , "scaleY" , "rotation"                  , "colorAlphaPercent" ] ;


    var 
        //@param Array< KeyFrame > return用の配列
        keyFrames = [] , 

        //ループ処理用の変数
        i , n , prevFrame 
    ;
    for( i = 0 , n = frame.length ; i < n ; i++ ){
        var aFrame = frame[i] ;

        //先頭のキーフレームでなければ、リストを連結する
        if( prevFrame ){ prevFrame.next = aFrame ; }

        //開始フレームと継続フレーム数をJS用に調整
        var startFrame = aFrame.startFrame+1 , duration = aFrame.duration - 1 ;

        //フレームに置かれているエレメントをJson変換可能なオブジェクトに変換
        var elements = [];
        each( aFrame.elements , function( e , i ){
            //instanceオブジェクトからJSで扱えるプロパティを抽出する
            var element = toObject( e , ExportKeys ) ;

            //高さと幅はオリジナルをエクスポートしておく
            //  JS都合
            element.height /= element.scaleY;
            element.width  /= element.scaleX; 

            element.frame = startFrame ;
            element.e     = e ;

            switch( e.constructor ){
                case SymbolInstance: 
                    var aSymbol = symbolList[ e.libraryItem.name ];
                    if( !aSymbol ){
                        aSymbol = symbolList[ e.libraryItem.name ] = { elements:[] };
                    }
                    aSymbol.item = e.libraryItem ;
                    aSymbol.elements.push( element );
                break;
            //    case          Shape: console.log("         Shape");break;
            //    case           Text: console.log("          Text");break;
            }

            elements.push( element );
        });


        //JSON 変換可能なオブジェクトとしてKeyFrameをエクスポート
        prevFrame = {
            start    : startFrame ,
            duration : duration ,
            end      : startFrame + duration ,
            isTween  : aFrame.tweenType == "motion" ,
            elements : elements 
        };

        keyFrames.push( prevFrame );



        //次のキーフレームへ
        //  not 次のフレーム
        i += duration ;
    }

    //KeyFrameにTweenが設定されている場合にTween用のプロパティを設定してエクスポート
    each( keyFrames , function ( key ){
        //tweenが設定されているフレームで
        //後続のキーフレームが存在し
        //キーフレームの長さが2以上
        //  長さが1の場合は実質補間が必要ない
        if( key.isTween && key.next != null && key.duration ){
            var next = key.next , tweenParam ;

            each( TweenKeys , function ( prop ){
                var p1 = key.elements[0][prop] , p2 = next.elements[0][prop] ;

                //値が入っていなければデフォルトを設定
                if( p1 == null ){ p1 = key .elements[0][prop] = Defaults[prop];}
                if( p2 == null ){ p2 = next.elements[0][prop] = Defaults[prop];}

                //パラメータに変化があればエクスポート
                if( p1 != p2 ){
                    if( !tweenParam ){ tweenParam = {}; }
                    tweenParam[ JSProp[prop] ] = Delta[prop]( p1 , p2 , key.duration );
                }
            } );

            //eachの結果 tweenParamが設定されていれば、エクスポート
            //  なければisTweenのフラグを折る
            if( tweenParam ){
                key.tween = tweenParam ;
            }else{
                key.isTween = false ;
            }
        }

        //連結リストはエクスポートする必要ないので、消しておく
        delete key["next"] ;
    } );

    return keyFrames ;
} 

function exportSymbol( symbolList ){
    var k , v , item , elements , e , lib = doc.library , timeline = doc.getTimeline() , tempDoc , tempRect , img_dir = "images" ;
    if( lib.itemExists("________workingplace") ){
        lib.deleteItem("________workingplace");
    }
    lib.addNewItem( "movie clip" , "________workingplace");
    lib.editItem("________workingplace");
    for( k in symbolList ){
        v = symbolList[ k ];
        item = v.item ;
        lib.addItemToDocument( {x:0,y:0} , item.name );
        doc.selectAll();
        doc.clipCut();

        fl.createDocument();
        tempDoc = fl.getDocumentDOM();
        tempDoc.asVersion = 1 ;
        tempDoc.importPublishProfile( "file:///" + fl.configDirectory.replace( /\\/g ,"/" ).replace( ":" , "|") + "/Publish Profiles/PNG.xml" );
        tempDoc.currentProfile = "PNG" ;
        tempDoc.clipPaste();
        
        tempDoc.selectAll();
        tempRect = tempDoc.getSelectionRect();
        tempDoc.width  = tempRect.right  - tempRect.left ;
        tempDoc.height = tempRect.bottom - tempRect.top  ;
        tempDoc.moveSelectionBy( {x:-tempRect.left , y:-tempRect.top} );
        
        
        tempDoc.selectNone();

        var fileName = encodeURIComponent( item.name.replace(/\//g,"_") );
        fl.saveDocument( tempDoc , documentFolder + "/fla/" + fileName + ".fla" );

        tempDoc.exportPNG( documentFolder + "/" + img_dir + "/" + fileName + ".png" , true , true );

        v.imagePath = img_dir + "/" + fileName + ".png" ;
        imageList.push( img_dir + "/" + fileName+".png" );


        fl.openDocument( doc.pathURI );
        
    }
    doc.exitEditMode();
    lib.deleteItem("________workingplace");


    for( k in symbolList ){
        v = symbolList[ k ];
        each( v.elements , function( elem ){
            elem.image = v.imagePath ;
        })
    }
}




console.clear();


var doc = fl.getDocumentDOM() , documentFolder = getDocumentFolderURI( doc );
if( !FLfile.exists( documentFolder + "/data" ) ){
    FLfile.createFolder( documentFolder + "/data" );
}
if( !FLfile.exists( documentFolder + "/images" ) ){
    FLfile.createFolder( documentFolder + "/images" );
}
if( !FLfile.exists( documentFolder + "/fla" ) ){
    FLfile.createFolder( documentFolder + "/fla" );
}
var symbolList = {} ;
var imageList = [] ;

doc.exitEditMode();
var elemData = eachFrame( processFrame );

exportSymbol( symbolList );

var stageData = {
    width  : doc.width ,
    height : doc.height ,
    fps    : doc.frameRate ,
    layer  : elemData ,
    images : imageList 
};

console.clear();
console.log( "var stageData = " + JSON.stringify( stageData ) );
console.save( documentFolder + "/data/data.js" );








