// ==UserScript==
// @name         Simple YourFileHost
// @namespace    Yamamaya
// @include      http://www.yourfilehost.com/media.php?cat=*
// @version      2.00
// ==/UserScript==

GM_getValue = function ( a , b ){ return b; } ;
GM_setValue = function (){};
GM_addStyle = function(){}
GM_xmlhttpRequest = function(opt) {
    var req = new XMLHttpRequest()
    req.open('GET', opt.url, true)
    req.overrideMimeType(opt.overrideMimeType)
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                opt.onload(req)
            }
            else {
                opt.onerror()
            }
        }
    }
    req.send(null)
}



 var r = [];
 var AutoPlayFlag = GM_getValue("AutoPlay",true); 
 var embed = document.getElementsByTagName("embed")[0];
 
 yourFileHost(); 
 	
 function yourFileHost(){
   var player = document.getElementById("objectPlayer") || document.getElementById("VIDEO");
   var mainDiv = document.createElement("div");
   mainDiv.style.textAlign = "center";
   mainDiv.style.margin = "40px 30px";
   mainDiv.appendChild(player);
   
   var remove = (function(){
       $x(".//script").forEach(function(e){
	   	 e.parentNode.removeChild(e);
	   });
       var html = document.getElementsByTagName("html")[0];
       html.removeChild(html.childNodes.item(1));
   })();
   
   var body = document.createElement("div");
   body.id = "simple"
   var table = document.createElement("table");
	   table.align = "center";
	   table.style.backgroundColor = "#fff";
	   table.style.marginTop = "30px";
	   table.style.marginBottom = "10px";
   var tbody = document.createElement("tbody");
   var tr = document.createElement("tr");
   var td = document.createElement("td");
	   td.width = "754";
	   td.vAlign = "middle";
	   td.style.border = "1px solid #ccc";
	table.appendChild(tbody);
	tbody.appendChild(tr);
	tr.appendChild(td);
	td.appendChild(mainDiv);
	body.appendChild(table);
	var html = document.getElementsByTagName("body")[0];
	html.appendChild(body);
	
 var addStyle = (function(){ 	 
  var style = "a {color: #3472D0; font-size: 17px; text-decoration: none; padding: 2px; background: #d5eaff;}";
      style+= "a:visited {color: #CCC;}"
      style+= "a:hover {color: #FFFFFF; background: #3472D0;}";
	  style+= "input {margin: 0px 5px;}"
      GM_addStyle(style);
  })();
  
	sizeChange(mainDiv);
	downLoadLink(mainDiv);
	deleteCookie();
    if(AutoPlayFlag) window.addEventListener("load", autoPlay, false);	
 };

 function autoPlay(){ 	
   var param = xpathSingle("//param[@name='movie']");
   param.value = param.value.replace("autoStart=0","autoStart=1");
   embed.src = embed.src.replace("autoStart=0","autoStart=1");
 };

 function sizeChange(mainDiv){
 	var gm = GM_getValue("AutoPlayValue","AutoPlayOff");
    var createDiv = document.createElement("div");
	    createDiv.style.margin = "10px 0px 0px 0px";
	    createDiv.innerHTML = '<input type="button" value="Replay">'
		                    + '<input type="button" value="400x300">'
		                    + '<input type="button" value="640x480">'
							+ '<input type="button" value="800x600">'
							+ '<input type="button" value="1024x768">'	
							+ '<input type="button" value='+ gm +'>';
      mainDiv.appendChild(createDiv);
	  var input = document.getElementsByTagName("input");				
          embed.width = GM_getValue("player_width","640");
		  embed.height = GM_getValue("player_height","480");
		  
		  input[0].addEventListener('click', autoPlay, false);
		   		   
		  input[1].addEventListener('click', function(){
			embed.width = "400";
		    embed.height = "300";
			setPlayerSize();
		  }, false);
		   
		  input[2].addEventListener('click', function(){
			embed.width = "640";
			embed.height = "480";
			setPlayerSize();
		  }, false);
		   
		  input[3].addEventListener('click', function(){
		   	embed.width = "800";
			embed.height = "600";
			setPlayerSize();
		  }, false);
		   
		  input[4].addEventListener('click', function(){
		   	embed.width = "1024";
			embed.height = "768";
			setPlayerSize();
		  }, false);      
		  
		  input[5].addEventListener('click',function(){
		  	if (this.value.match(/AutoPlayOff/i)) {
				this.value = "AutoPlayOn";
				GM_setValue("AutoPlayValue",this.value);
				GM_setValue("AutoPlay", false);
			}
			else {
				this.value = "AutoPlayOff";
				GM_setValue("AutoPlayValue",this.value);
				GM_setValue("AutoPlay", true);
			}
		  }, false);	
	
	function setPlayerSize(){
			GM_setValue("player_width",embed.width);
			GM_setValue("player_height",embed.height);
	};
 };

 function downLoadLink(mainDiv){
	var DLlink = document.createElement("div");
	    DLlink.id = "DLlinkBox";
	    DLlink.style.paddingTop = "20px";
		DLlink.style.clear = "both";
	var url = encodeURIComponent(location.href);
	    DLlink.innerHTML = '<a href="http://yourfilehostwmv.com/video?url='+ url +'" target="_blank" title="Get wmv file" style="margin: 0px 10px 0px 0px;">DownLoad Link <b>WMV</b></a>';
	    mainDiv.appendChild(DLlink);
    
	if (document.getElementById("VIDEO")) {
		url = embed.src.match(/vidlink\=http:\/\/[^&]*\.wmv/).toString().replace("vidlink=", "");
		var a = document.createElement("a");
		a.href = url;
		a.target = "_blank";
		a.title = "download wmv file";
		a.innerHTML = url;
		mainDiv.appendChild(a);
		DLlink.style.padding = "20px 0 15px 0";
	} 
	else {
	var api = decodeURIComponent(embed.src).match(/\&video\=.*/).toString().replace("&video=","");
		GM_xmlhttpRequest({
			method: "GET",
			url: api,
			headers: {
				"User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
				"Accept": "application/xml"
			},
			onload: function(req){
				var download_link = decodeURIComponent(req.responseText).match(/http:\/\/[^&]*\.flv/);
				var a = document.createElement("a");
				a.href = download_link;
				a.target = "_blank";
				a.title = "download flv file";
				a.innerHTML = "DownLoad Link <b>FLV</b>";
				DLlink.appendChild(a);
				a.addEventListener("click", function(){
	              location.href = document.location.href;
				}, false);
			},
		});
	} 		
	
	linkCheck(DLlink);		
 };
 
 function httpRequest(URL, div){
  GM_xmlhttpRequest({
			method: "GET",
			url: URL,
			headers: {
	            'User-agent': 'Mozilla/5.0 (compatible)',
		        'Accept': 'application/atom+xml, application/xml, text/xml',
			},
			onload: function(x){
				     var html = x.responseText;
					 var matchHtml = html.match(/Error/);
					  if(!matchHtml){ 
					   var number = URL.slice(-5); 
					   var a = "<a href="+URL+" style='margin-right:5px; padding:5px;'>"+number+"</a>";
					   if (location.href == URL)
					   	a = "<a href=" + URL + " style='margin-right:5px; padding:5px; background:#000;'>" + number + "</a>";
					   r.push(a);
					   div.innerHTML = r.sort().join("");
				     }
			},
		  });	   
 };
 
 function linkCheck(ele){
 	var location = window.location.href;
 	var number = location.slice(-5, -4);
	var exten = location.slice(-4);
	var noNumber = isNaN(number);
	var a_z = number.match(/[a-z]/);
	var A_Z = number.match(/[A-Z]/);
	 var div = document.createElement("div");
	 div.style.marginTop = "20px";
	 ele.parentNode.insertBefore(div,ele);
    var URL;
	var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	var ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];	  
	if (a_z) {
	  for(var i in alphabet){
	  		URL = location.replace(number + exten, alphabet[i] + exten);
			httpRequest(URL, div);		
	  };
	};
	if (A_Z){
	  for(var i in ALPHABET){
	  		URL = location.replace(number + exten, ALPHABET[i] + exten);
			httpRequest(URL, div);	  	
	  }; 	
	}
	else {
		for (var i = 1; i < 10; i++) {
			URL = location.replace(number + exten, i + exten);
			httpRequest(URL, div);
		}
	}
 };

 function getCookie(name){
    var regexp = new RegExp('; ' + name + '=(.*?);');
    var match  = ('; ' + document.cookie + ';').match(regexp);
    return match ? decodeURIComponent(match[1]) : null;
 }; 

 function deleteCookie(){
    var name = ["session","yfh_cids","yfh_ac","yfh_af","yfh_views"];
	var domain = "; domain= .yourfilehost.com;";
	var expires = "expires= Thu, 1-Jan-1970 00:00:00 GMT;";
	for(var i in name)
	document.cookie = name[i] + "=" + getCookie(name[i]) + domain + expires;  	
 };
 
 function $x(exp, ctx){
  var xp = (ctx && ctx.ownerDocument || document).evaluate(exp, ctx || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  var r = [];
  for (var i = 0;i < xp.snapshotLength;++i) r.push(xp.snapshotItem(i));
  return r;
 };

 function xpathSingle(query){
	 return document.evaluate(
	        query, 
	        document, 
		    null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
		    null).singleNodeValue;
 };
 
