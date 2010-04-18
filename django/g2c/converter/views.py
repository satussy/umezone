from django.http import HttpResponseRedirect
from django.template import loader 
from django.views.generic import simple as SimpleView

from g2c.converter.models import *

from g2c.converter import GreaseMonkeyConverter
from os import path


#loader.render_to_string ( String template_path , Dict context )
#simple.redirect_to
#simple.direct_to_template



def test( req ):
    return SimpleView.direct_to_template( req , "test/test.html" )


def convert( req ):
    form = ConverterForm( req.GET )
    result = form.is_valid()
    

    message = ""
    if result :
        try:
            target = GreaseMonkeyConverter.saveByURL( req.GET.get("url") )
            return HttpResponseRedirect( "/g2c/dl/" + path.dirname( target + "/" ).split( "/" )[-1] + ".crx" ) 
        except SyntaxError , ( msg ):
            result = False
            message = msg 



    return SimpleView.direct_to_template( req , "convert/result.html" , extra_context={ "result" : result , "form" : form , "message" : message } )




