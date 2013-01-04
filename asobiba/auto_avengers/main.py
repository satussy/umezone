# -*- coding: utf-8 -*-

import os
import time
import json

import batch_core as core
import batch as bat

currentDir = os.path.dirname(__file__)  
if not currentDir == "" :
  os.chdir( currentDir )


success = False

#############################################################################
# lockfile
#----------------------------------------------------------------------------
LOCK_FILE = "working/lock"
def createLockFile():
  fp = open( LOCK_FILE , "w" )
  fp.close()

def cleanLoclFile():
  os.remove( LOCK_FILE )
# end LOCK_FILE
#============================================================================


#############################################################################
# working data
#----------------------------------------------------------------------------
DATA_FILE = "working/data"
def storeData( success ):
  fp = open( DATA_FILE , "w" )
  fp.write( json.JSONEncoder().encode( { "startAt" : time.time() , "success" : success } ) )
  fp.close()
  

def readData():
  if not os.path.exists( DATA_FILE ):
    return { "startAt" : 0 , "success" : True }

  fp = open( DATA_FILE , "r" )
  data = fp.readline()
  fp.close()

  try:
    data = json.JSONDecoder().decode( data )
  except ValueError:
    data = { "startAt":0 , "success":True }

  return data 

# end working data
#============================================================================



startAt = time.strftime( "%Y%m%d_%H%M%S" )


# 実行中なら止める
if os.path.exists( LOCK_FILE ):
  print "previous script running: %s" % ( startAt )
  os.sys.exit(0)

# 一時停止要求があれば止める
if os.path.exists( "working/pause" ):
  print "script is paused: %s" % ( startAt )
  os.sys.exit(0)


# 前回実行時より21分経過していなければ止める
#   TODO 失敗だった場合は辞めなくてもいい
data = readData()
if ( time.time() - data.get("startAt") ) < 21 * 60 :
  print "not taken 21min: %s" % ( startAt )
  os.sys.exit(0)


createLockFile()


#os.system("open /Applications/Google\ Chrome\ Dev.app")
os.system("open /Applications/Google\ Chrome.app")

print "start capture at %s" % startAt

core.SCREEN_CAPTURE_PATH = "working/screen.png" 




try:

  # 少し間を開けて開始
  time.sleep(5) 

  bat.clickBookmark()
  # ページが表示されるまで適当に待つ
  time.sleep(10)

  bat.clickScroll()

  bat.clickPlay()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  bat.clickCampaign()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  bat.clickWellcomeClose()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  bat.clickNotYet()

  # 完了済みフライトがあれば処理
  skip = bat.clickFlightEndMark()

  if skip :
    skip = bat.clickFlightEndMark()

  if skip :
    skip = bat.clickFlightEndMark()

  if skip :
    skip = bat.clickFlightEndMark()

  if not skip :
    #前回実行時に1人しか飛ばせなかったときここで無限につむ、一旦スキップを許容
    skip = bat.clickCollectAll( )

    #3回までリトライしよう
    if skip :
      skip = bat.clickCollectAll( )

    if skip :
      skip = bat.clickCollectAll( )

    if skip :
      skip = bat.clickCollectAll( )

    # 飛行機が返ってくるまで時間がかかります
    time.sleep(5)


  # フライト任務ループ
  flightTryCount = 0
  flightCount = 0
  while True:
    # なかなか見つからなかったらいい加減諦める
    if flightTryCount >= 100:
      break

    # もう全部出勤しましたよ
    if flightCount >= 8:
      break

    skip = bat.clickFlightStart()
    time.sleep(1)

    if skip :
      flightTryCount += 1
      time.sleep(3)
      continue


    skip = bat.clickSendHero()
    if skip :
      flightTryCount += 1
      time.sleep(3)
      continue

    time.sleep(1)

    # 強制的出勤先選択画面処理
    if bat.detectFlightDestination():
      bat.click20min()
      time.sleep(1)

    # 適当にヒーロー出勤
    while True:
      skip = bat.clickSelectHeroButton()
      if not skip:
        break

      time.sleep(1)

    # おっけおっけ
    bat.clickHeroConfirm()

    bat.doTrainingRequired()

    flightCount += 1


except ValueError:
  print ValueError.message 
  print "Error at:%s" % ( startAt )
  os.system( "cp %s error/%s.png" % ( SCREEN_CAPTURE_PATH , startAt ) )

  storeData( False )

else:
  storeData( True )

finally:
  cleanLoclFile()

  # flash表示しっぱなしは重いのでnew tabでもだしとけ
  bat.clickEndBookmark()


