# -*- coding: utf-8 -*-

import argparse
import logging
import os
import time
import json

import batch_core as core
import batch as bat

parser = argparse.ArgumentParser(description='Avengers auto flight manager')
parser.add_argument( "--force" , action="store_true" );
options = parser.parse_args()



currentDir = os.path.dirname(__file__)  
if not currentDir == "" :
  os.chdir( currentDir )

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)-8s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S',
                    filename='log/log.txt',
                    filemode='w')

console = logging.StreamHandler()
console.setLevel(logging.DEBUG )
formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s','%Y-%m-%d %H:%M:%S') 
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)

logger = logging;


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
  logger.debug( "previous script running: %s" % ( startAt ))
  os.sys.exit(0)

if options.force :
  logger.debug( "script will run with force option: %s" % ( startAt ))

# 一時停止要求があれば止める
elif os.path.exists( "working/pause" ):
  logger.debug( "script is paused: %s" % ( startAt ))
  os.sys.exit(0)

# 前回実行時より11分経過していなければ止める
#   TODO 失敗だった場合は辞めなくてもいい
data = readData()
if not options.force :
  if ( time.time() - data.get("startAt") ) < 11 * 60 :
    logger.debug( "not taken 11min: %s" % ( startAt ))
    os.sys.exit(0)


createLockFile()


os.system("open /Applications/Google\ Chrome.app")

logger.debug( "start capture at %s" % startAt)

core.SCREEN_CAPTURE_PATH = "working/screen.png" 



fp = open( "working/priority.json", "r" )
priority = fp.readline()
fp.close()

try:
  priority = json.JSONDecoder().decode( priority )
except ValueError:
  pass

priority.reverse();



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
    logger.debug( "Flight Try %d" % flightTryCount )
    # なかなか見つからなかったらいい加減諦める
    if flightTryCount >= 30:
      break

    # もう全部出勤しましたよ
    if flightCount >= 8:
      break

    skip = bat.clickFlightStart()
    time.sleep(.5)

    if skip :
      flightTryCount += 1
      time.sleep(.5)
      continue


    skip = bat.clickSendHero()
    if skip :
      flightTryCount += 1
      time.sleep(.5)
      continue

    time.sleep(.5)

    # 強制的出勤先選択画面処理
    bat.click10min()
    time.sleep(.5)


    hero = priority.pop()
    logger.debug( hero )
    heroSelectTryCount = 0

    try:
      # 適当にヒーロー出勤
      while True:
        logger.debug( "click templates/charas/%s.png" % hero ) 
        skip = core.click( "templates/charas/%s.png" % hero , True )
        if not skip :
          break

        logger.debug( "%s not found" % hero ) 

        logger.debug( "search next page" )
        bat.clickNextHeroPage()
        heroSelectTryCount += 1

        if heroSelectTryCount >= 5 :
          raise Exception( "try 5 times" )

        logger.debug( "sleep .5" )
        time.sleep(.5)
    except Exception:
      logger.debug( Exception.message )
    except ValueError:
      logger.debug( ValueError.message )

    else:
      # おっけおっけ
      bat.clickHeroConfirm()

      bat.doTrainingRequired()



    flightCount += 1


except ValueError:
  logger.error( ValueError.message )
  os.system( "cp %s error/%s.png" % ( SCREEN_CAPTURE_PATH , startAt ) )

  storeData( False )

else:
  storeData( True )

finally:
  cleanLoclFile()

  # flash表示しっぱなしは重いのでnew tabでもだしとけ
  bat.clickEndBookmark()


