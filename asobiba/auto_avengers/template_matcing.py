import cv


def detect ( templatePath, targetPath, threshold = 0.8 ):

  target = cv.LoadImage( targetPath )
  template = cv.LoadImage( templatePath )

  dstSize = (target.width - template.width + 1, target.height - template.height + 1)
  dstImg = cv.CreateImage(dstSize, cv.IPL_DEPTH_32F, 1)

  cv.MatchTemplate (target, template, dstImg , cv.CV_TM_CCOEFF_NORMED);
  minMaxLoc = cv.MinMaxLoc (dstImg);
  print "%s, %s" % ( templatePath, minMaxLoc )
  if minMaxLoc[1] < threshold :
    return False

  maxLoc = minMaxLoc[3]



  
  x = maxLoc[0] + template.width/2 
  y = maxLoc[1] + template.height/2

  return (x,y)

