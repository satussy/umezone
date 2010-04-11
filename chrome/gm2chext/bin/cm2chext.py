import urllib
import re
import json
import os
import shutil

from mako.template import Template

from os import path
os.environ['DJANGO_SETTINGS_MODULE'] = '__main__'



APP_ROOT = path.dirname( path.abspath( __file__ ) ) + "/.."

def parseGM( file ):
    ###############################
    # Regex setting
    #_____________________________
    PATTERN_DIRECTIVE = "^// *@(name|namespace|description|include|exclude|resource|require|unwrap) +(.*)"
    GROUP_INDEX_META_KEY = 1
    GROUP_INDEX_META_VAL = 2
    matcher = re.compile( PATTERN_DIRECTIVE )

    ###############################
    # GM parsing setting
    #_____________________________
    STATUS_OUTOFMETA = 0 
    STATUS_INMETA    = 1
    STATUS_ENDOFMETA = 2

    status = STATUS_OUTOFMETA

    ###############################
    # working valiables
    #_____________________________
    gmmeta = {
        "include"  : [] ,
        "exclude"  : [] ,
        "resource" : [] ,
        "require"  : [] 
    }
    lines = [] 
    for line in f :
        if line.startswith( "//" ) :
            m = matcher.match( line ) 
            if m == None :
                continue 
            key = m.group( GROUP_INDEX_META_KEY )
            val = m.group( GROUP_INDEX_META_VAL ) 

            if key in gmmeta :
                if( val == "http://*" or val == "https://*" ):
                    val += "/*"
                gmmeta[ key ].append( val )
            else :
                gmmeta[ key ] = val
        else :
            lines.append( line )

    return { "meta" : gmmeta , "src" : lines }
#-------------------------------------------------------------------------------------------------------

def makeChromeMeta( gmmeta ) :
    return {
        "name"            : gmmeta.get( "name"        , "" ) ,
        "description"     : gmmeta.get( "description" , "" ) + "\nconverted by cm2chext" ,
        "version"         : "1.0" ,
        "permissions"     : [ "http://*/*" , "https://*/*" ] ,
        "background_page" : "background.html",
        "content_scripts" : [{
            "matches" : gmmeta.get( "include" , ["http://*/*"] ) ,
            "js": [ 
                "gmWrapper.js" , 
                getChromeScriptName( gmmeta.get( "name" , "" ) ) + ".user.js"
            ]
        }]
    }

def getChromeScriptName( name ):
    return name.lower().replace( " " , "_" )


def initScriptFiles( gmdata ):
    script_name = gmdata["meta"]["name"]
    DIR_NAME = getChromeScriptName( script_name )
    SRC_ROOT = APP_ROOT + "/var/" + DIR_NAME 
    TEMPLATE = APP_ROOT + "/dat/template" 
    shutil.copytree( TEMPLATE , SRC_ROOT )

    SCRIPT_NAME = SRC_ROOT + "/" + DIR_NAME + ".user.js" 

    os.rename( SRC_ROOT + "/template.user.js" , SCRIPT_NAME )

    initManifest  ( SRC_ROOT    , gmdata["meta"] )
    initUserScript( SCRIPT_NAME , gmdata["src"] )

    return SRC_ROOT

def initManifest( dir , gmmeta ):
    print dir + "/manifest.json" 
    f = open( dir + "/manifest.json" , "w" )
    f.write( json.dumps( makeChromeMeta( gmmeta ) ) )
    f.close()

def initUserScript( path , src ):
    src = Template( filename=path ).render( lines=src ) 
    f = open( path , "w" )
    f.write( src )
    f.close()




path = "http://coderepos.org/share/browser/lang/javascript/userscripts/fastlookupalc.user.js?format=txt" 

f = urllib.urlopen( path )

gmdata = parseGM( f )
src_dir = initScriptFiles( gmdata )








