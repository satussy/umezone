from django.db import models
from django    import forms


class ConverterForm( forms.Form ) :
    url = forms.URLField( 
            required=True , 
            verify_exists=True ,
        )
