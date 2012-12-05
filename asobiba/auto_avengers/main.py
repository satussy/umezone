# -*- coding: utf-8 -*-

import os
import cliclick
import capture
import template_matcing
import time
import json

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

  return json.JSONDecoder().decode( data )

# end working data
#============================================================================



startAt = time.strftime( "%Y%m%d_%H%M%S" )


# 実行中なら止める
if os.path.exists( LOCK_FILE ):
  print "previous script running: %s" % ( startAt )
  os.sys.exit(0)


# 前回実行時より21分経過していなければ止める
#   TODO 失敗だった場合は辞めなくてもいい
data = readData()
if ( time.time() - data.get("startAt") ) < 21 * 60 :
  print "not taken 21min: %s" % ( startAt )
  os.sys.exit(0)


createLockFile()


os.system("open /Applications/Google\ Chrome\ Dev.app")

print "start capture at %s" % startAt

SCREEN_CAPTURE_PATH = "working/screen.png" 

# アベンジャーズを開く
def clickBookmark():
  click( "templates/bookmark.png" )

# 画面をスクロールする
def clickScroll():
  click( "templates/scroll.png" )

def clickPlay():
  click("templates/play_button.png" )


#############################################################################
# 初期表示画面処理系
#----------------------------------------------------------------------------
def clickWellcomeClose():
  click("templates/wellcome_close_button.png" )

def clickCampaign():
  click( "templates/campain_close_button.png" , True )

def clickNotYet():
  click( "templates/not_yet_button.png" , True )


#############################################################################
# フライト帰還
#----------------------------------------------------------------------------

def clickFlightEndMark():
  return click( "templates/flight_end_mark.png" , True )

def clickCollectAll():
  click( "templates/collect_all_button.png" )

# end 帰還
#============================================================================


#############################################################################
# フライト関連
#----------------------------------------------------------------------------

# フライト任務開始ボタン
#   どうも認識率が高くないので、1回までリトライする
def clickFlightStart( retry = False ):
  skip = click( "templates/flight_start_button.png" , True )

  if skip and not retry:
    skip = clickFlightStart( True )

  return skip 


# フライト開始ボタンが無事押せたらヒーローを送り出す
def clickSendHero():
  click( "templates/send_hero_button.png" )

def detectFlightDestination():
  return detect( "templates/3min.png" )

def click20min():
  click( "templates/20min.png" )

def clickSelectHeroButton():
  click( "templates/select_button.png" )

def clickHeroConfirm():
  click( "templates/confirm_button.png" )

def clickNextHeroPage():
  click( "templates/next_hero_page.png" )

# end fright
#============================================================================




#############################################################################
# 経験値がMAXのヒーロの時に出るダイアログ
#----------------------------------------------------------------------------
def detectTrainingRequired():
  return detect( "templates/training_required.png" )

def clickSelectBox():
  click( "templates/select_box.png" )

def clickContinue():
  click( "templates/continue_button.png" )

# end 経験値MAXダイアログ
#============================================================================


def detectChapter1():
  return detect( "templates/chapter1_mark.png" )

def clickPrevChapter():
  click( "templates/prev_chapter_button.png" )

def clickMission1_1():
  click( "templates/mission1-1.png")

def clickPlayMission():
  click( "templates/play_mission_button.png" )

def detectAbortMission():
  return detect( "templates/abort_mission_dialogue.png" )

def clickAbortMissionYes():
  click( "templates/abort_mission_yes.png" )


def clickMissionTextNext():
  return click( "templates/mission_text_next.png" , True)

def clickMissionTextOK():
  return click( "templates/mission_text_ok.png" )

def clickMission():
  return click( "templates/mission.png" , True )

# battle
def clickFightStart():
  click( "templates/fight_start_button.png" )


def clickAttackTumble():
  return click( "templates/attack_tumble.png" , True )

def clickAttackMultiStrike():
  return click( "templates/attack_multi_strike.png", True )

def clickAttackTwinStrike():
  return click( "templates/attack_twin_strike.png" , True )

def clickAttackFaulteater():
  return click( "templates/attack_faulteater.png" , True )

def clickAttackPhenixPinion():
  return click( "templates/attack_phenix_pinion.png", True)

def clickAttackSureShot():
  return click( "templates/attack_sure_shot.png", True )

def clickEnemy1():
  return click( "templates/enemy1.png" , True )

def clickEnemy2():
  return click( "templates/enemy2.png" , True )

def clickEnemy3():
  return click( "templates/enemy3.png" , True )

def clickBossViper():
  return click( "templates/enemy_viper.png" , True )

def clickMission1_1_Boss():
  return click( "templates/mission_1_1_boss.png" , True )

def detectYourScore():
  return detect( "templates/your_score.png" )

def clickBattleResultSkip():
  click( "templates/battle_result_skip.png" )

def clickBattleResultContinue():
  click( "templates/battle_result_continue.png" )



# boss reward

def clickRewardOpen():
  click( "templates/reward_open.png" )

def clickRewardGo():
  click( "templates/reward_go.png" )

def clickRewardAccept():
  click( "templates/reward_accept.png" )

def clickRewardDone():
  click( "templates/reward_done.png" )


def doReward():
  clickRewardOpen()
  time.sleep(3)

  clickRewardGo()
  time.sleep(5)

  clickRewardAccept()
  time.sleep(1)

  clickRewardDone()



# mission exit

def clickMissionExit():
  return click( "templates/mission_exit.png", True )

def clickMissionClose():
  click( "templates/mission_close.png" )


def doMissionExit():
  try_count = 0
  while clickMissionExit():
    try_count += 1
    if try_count >= 30:
      print "Error: mission exit not found"
      raise ValueError

  clickMissionClose()




def clickEndBookmark():
  click( "templates/end_bookmark.png" )



def doBattleLoop():
  while True:
    if detectYourScore():
      print "Battle End"
      break

    attack_count = 0
    while True:
      #if not clickAttackTumble():
      #  break

      #if not clickAttackTwinStrike():
      #  break

      if not clickAttackFaulteater():
        break

      #if not clickAttackPhenixPinion():
      #  break

      if not clickAttackMultiStrike():
        break

      if not clickAttackSureShot():
        break

      attack_count += 1
      if attack_count >= 30 :
        print "Error: attack not found"
        raise ValueError
        break

      time.sleep(5)

    enemy_count = 0
    while True:
      if not clickEnemy1():
        break

      if not clickEnemy2():
        break

      if not clickEnemy3():
        break

      if not clickBossViper():
        break

      enemy_count += 1
      if enemy_count >= 30:
        print "Error: enemy not found"
        raise ValueError
        break

      time.sleep(5)


    time.sleep( 10 )



def doStartMission1_1():
  chapter_try_counter = 0
  while( True ):
    if detectChapter1() :
      print "Chapter1"
      break
    else:
      clickPrevChapter()
 
    chapter_try_counter += 1 
    if chapter_try_counter > 100 :
      print "not found"
      break
 
  clickMission1_1()
  clickPlayMission()
 
  time.sleep(1) 
 
  if detectAbortMission() :
    clickAbortMissionYes()
 
  while not clickMissionTextNext() :
    pass
 
  clickMissionTextOK()
 

def doSelectBattle():
  missionTryCount = 0
  isBossBattle = False
  while True :
    if not clickMission():
      break
      
    if not clickMission1_1_Boss():
      isBossBattle = True
      break

    missionTryCount += 1
    if missionTryCount > 20 :
      print "Error: mission start fail"
      break
 
  time.sleep(5)
  clickFightStart()

  doTrainingRequired()

  return isBossBattle

def doBossText():
  while not clickMissionTextNext() :
    pass
 
  clickMissionTextOK()


def doMission():
  mission_count = 0

  doStartMission1_1()

  while True:

    isBossBattle = doSelectBattle()

    if isBossBattle:
      time.sleep(1)
      doBossText()

    time.sleep(10)

    doBattleLoop()

    clickBattleResultSkip()
    clickBattleResultContinue()

    if isBossBattle:
      time.sleep(3)
      doReward()
      doBossText()

      time.sleep(3)
      doMissionExit()

      print "Mission complete"
      break


    mission_count += 1

    if mission_count >= 20:
      print "Error: mission main loop"
      raise ValueError


def doTrainingRequired():
  # 経験値が満タンだってよ？
  if detectTrainingRequired():
    clickSelectBox()
    time.sleep(.5)

    clickContinue()
    time.sleep(.5)


#############################################################################
# スクリーンキャプチャからテンプレート画像の座標を返す
# @param templatePath {String} テンプレート画像
# @param skip=False {Boolean} テンプレート画像が見つからなかった時に例外にするかどうか. Trueだと例外は投げられない
# @return {Tuple} or False テンプレートの中心座標。パラメータskipがTrueでテンプレートが見つからなかったときFalse
def getPoint(templatePath,skip=False):
  captureScreen()
  point = template_matcing.detect( templatePath , SCREEN_CAPTURE_PATH )

  if not point:
    if skip:
      return False
    else:
      raise ValueError

  return point

# スクリーンキャプチャからテンプレート画像の位置をクリックします
# @param templatePath {String} テンプレート画像
# @param skip=False {Boolean} テンプレート画像が見つからなかった時に例外にするかどうか. Trueだと例外は投げられない
# @return {Boolean} クリックをスキップしたかどうか. skipしてればTrue = clickしたらFalse
def click( templatePath ,skip=False):
  point = getPoint( templatePath, skip )

  if not point:
    return True

  cliclick.click( point )

  #マウスの位置がそのままだと、画面が変化しマウスオーバーが発生したりするので逃がす
  cliclick.move( (5,5) )

  #気休め
  #これを入れとくと精度が上がる気がする
  cliclick.wait( 200 )
  return False

# スクリーンキャプチャからテンプレート画像の位置にマウスを移動する
# @param templatePath {String} テンプレート画像
# @param skip=False {Boolean} テンプレート画像が見つからなかった時に例外にするかどうか. Trueだと例外は投げられない
# @return {Boolean} 移動をスキップしたかどうか. skipしてればTrue = moveしたらFalse
def move( templatePath ,skip=False):
  point = getPoint( templatePath, skip )

  if not point:
    return True 

  cliclick.move( point )
  return False

# templatePathで指定された画像がスクリーンキャプチャに存在するかどうか返す
# @param templatePath {String} テンプレート画像
# @return {Boolean} テンプレートが存在したかどうか
def detect(templatePath):
  point = getPoint( templatePath , True )

  if not point:
    return False
  else:
    return True

# 画面をキャプチャする
def captureScreen():
  capture.capture( SCREEN_CAPTURE_PATH )


try:

  # 少し間を開けて開始
  time.sleep(5) 

  clickBookmark()
  # ページが表示されるまで適当に待つ
  time.sleep(10)

  clickScroll()

  clickPlay()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  clickCampaign()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  clickWellcomeClose()
  # ゲームが始まるまでしばらくお待ちください
  time.sleep(3)

  clickNotYet()

  # 完了済みフライトがあれば処理
  skip = clickFlightEndMark()
  if not skip :
    clickCollectAll()

    # 飛行機が返ってくるまで時間がかかります
    cliclick.wait( 5000 )


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

    skip = clickFlightStart()
    time.sleep(1)

    if skip :
      flightTryCount += 1
      time.sleep(3)
      continue


    clickSendHero()
    time.sleep(1)

    # 強制的出勤先選択画面処理
    if detectFlightDestination():
      click20min()
      time.sleep(1)

    # 適当にヒーロー出勤
    while True:
      skip = clickSelectHeroButton()
      if not skip:
        break

      time.sleep(1)

    # おっけおっけ
    clickHeroConfirm()

    doTrainingRequired()

    flightCount += 1


except:
  print "Error at:%s" % ( startAt )
  os.system( "cp %s error/%s.png" % ( SCREEN_CAPTURE_PATH , startAt ) )

  storeData( False )

else:
  storeData( True )

finally:
  # flash表示しっぱなしは重いのでnew tabでもだしとけ
  clickEndBookmark()
  cleanLoclFile()


