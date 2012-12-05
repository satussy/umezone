import os

def capture( path ):
  os.system( "screencapture -x %s" % path )
  #os.system( "screencapture %s" % path )
