// ==UserScript==
// ==/UserScript==

if( typeof isChromeExtension == "undefined" ){ 
    init();
}else{
    function onReadyGM(){
        init();
    }
}

function init(){
% for line in lines :
${line|trim}
% endfor :
}
