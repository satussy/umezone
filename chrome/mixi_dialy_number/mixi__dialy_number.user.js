// ==UserScript==
// @name           mixi : dialy number
// @namespace      http://cocoromi.sakura.ne.jp/
// @include        http://mixi.jp/add_diary.pl?*
// ==/UserScript==

var API = "http://mixi.jp/list_diary.pl";
var ID = "bodyMainAreaMain";
var METHOD = "GET";
var LENGTH = 3;

//util function 
function getTags(html, tagName, className){
  var cls = "";
  if(className){
    cls = "[^>]*?class=\"" + className + "\"";
  }
  var reg = new RegExp("<" + tagName + cls + "(\\s|.)*?>([^<]*)</" + tagName + ">", "ig");
  return html.match(reg);
}

function getTag(html, tagName, className){
  var tags = getTags(html, tagName, className);
  return (tags && tags.length) ? tags[0] : "";
}

function log( obj ) {
  unsafeWindow.console.log( obj );
}

function xpath(node , query) {
  return document.evaluate(query, node , null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

//main 
function init(){
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) { 
            var list = getTag( xhr.responseText , "dl" );
            var reg = new RegExp("\\[([0-9][0-9][0-9])\\]");
            list.match( reg );
            var num = new String( parseInt( RegExp.$1 , 10 ) + 1 );
            var input = xpath( document , './/input[@name="diary_title"]' );
            input = input.snapshotItem( 0 );
            input.value = "[" + formatWithZero( num , LENGTH ) + "] ";
        }
    }
    xhr.open( METHOD , API , true)
    xhr.send(null)
    return xhr
}

function formatWithZero(str,length){
  var strlen = str.length;
  for(var i = strlen ; i < length ; i++){
    str = "0" + str;
  }
  return str;
}


window.addEventListener('load', init , false);


