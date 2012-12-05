import os
def click( point ):
  os.system( "cliclick c:%d,%d" % point )
  wait( 500 )


def move( point ):
  os.system( "cliclick m:%d,%d" % point )
  wait( 500 )



def wait( time ):
  os.system( "cliclick w:%d" % time )


