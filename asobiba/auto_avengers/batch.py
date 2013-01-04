# -*- coding: utf-8 -*-
import batch_core as core
import time
import logging as logger

# アベンジャーズを開く
def clickBookmark():
  core.click( "templates/bookmark.png" )

# 画面をスクロールする
def clickScroll():
  core.click( "templates/scroll.png" )

def clickPlay():
  core.click("templates/play_button.png" )


#############################################################################
# 初期表示画面処理系
#----------------------------------------------------------------------------
def clickWellcomeClose():
  core.click("templates/wellcome_close_button.png" )

def clickCampaign():
  core.click( "templates/campain_close_button.png" , True )

def clickNotYet():
  core.click( "templates/not_yet_button.png" , True )


#############################################################################
# フライト帰還
#----------------------------------------------------------------------------

def clickFlightEndMark():
  return core.click( "templates/flight_end_mark.png" , True )

def clickCollectAll():
  return core.click( "templates/collect_all_button.png" , True )

# end 帰還
#============================================================================


#############################################################################
# フライト関連
#----------------------------------------------------------------------------

# フライト任務開始ボタン
#   どうも認識率が高くないので、1回までリトライする
def clickFlightStart( retry = False ):
  skip = core.click( "templates/flight_start_button.png" , True )

  if skip and not retry:
    skip = clickFlightStart( True )

  return skip 


# フライト開始ボタンが無事押せたらヒーローを送り出す
def clickSendHero():
  return core.click( "templates/send_hero_button.png" , True )

def detectFlightDestination():
  return core.detect( "templates/3min.png" )

def click20min():
  core.click( "templates/20min.png" )

def clickSelectHeroButton():
  core.click( "templates/select_button.png" )

def clickHeroConfirm():
  core.click( "templates/confirm_button.png" )

def clickNextHeroPage():
  core.click( "templates/next_hero_page.png" )

# end fright
#============================================================================




#############################################################################
# 経験値がMAXのヒーロの時に出るダイアログ
#----------------------------------------------------------------------------
def detectTrainingRequired():
  return core.detect( "templates/training_required.png" )

def clickSelectBox():
  core.click( "templates/select_box.png" )

def clickContinue():
  core.click( "templates/continue_button.png" )

# end 経験値MAXダイアログ
#============================================================================


def detectChapter1():
  return core.detect( "templates/chapter1_mark.png" )

def clickPrevChapter():
  core.click( "templates/prev_chapter_button.png" )

def clickMission1_1():
  core.click( "templates/mission1-1.png")

def clickPlayMission():
  core.click( "templates/play_mission_button.png" )

def detectAbortMission():
  return core.detect( "templates/abort_mission_dialogue.png" )

def clickAbortMissionYes():
  core.click( "templates/abort_mission_yes.png" )


def clickMissionTextNext():
  return core.click( "templates/mission_text_next.png" , True)

def clickMissionTextOK():
  return core.click( "templates/mission_text_ok.png" )

def clickMission():
  return core.click( "templates/mission.png" , True )

# battle
def clickFightStart():
  core.click( "templates/fight_start_button.png" )


def clickAttackTumble():
  return core.click( "templates/attack_tumble.png" , True )

def clickAttackMultiStrike():
  return core.click( "templates/attack_multi_strike.png", True )

def clickAttackTwinStrike():
  return core.click( "templates/attack_twin_strike.png" , True )

def clickAttackFaulteater():
  return core.click( "templates/attack_faulteater.png" , True )

def clickAttackPhenixPinion():
  return core.click( "templates/attack_phenix_pinion.png", True)

def clickAttackSureShot():
  return core.click( "templates/attack_sure_shot.png", True )

def clickEnemy1():
  return core.click( "templates/enemy1.png" , True )

def clickEnemy2():
  return core.click( "templates/enemy2.png" , True )

def clickEnemy3():
  return core.click( "templates/enemy3.png" , True )

def clickBossViper():
  return core.click( "templates/enemy_viper.png" , True )

def clickMission1_1_Boss():
  return core.click( "templates/mission_1_1_boss.png" , True )

def detectYourScore():
  return core.detect( "templates/your_score.png" )

def clickBattleResultSkip():
  core.click( "templates/battle_result_skip.png" )

def clickBattleResultContinue():
  core.click( "templates/battle_result_continue.png" )



# boss reward

def clickRewardOpen():
  core.click( "templates/reward_open.png" )

def clickRewardGo():
  core.click( "templates/reward_go.png" )

def clickRewardAccept():
  core.click( "templates/reward_accept.png" )

def clickRewardDone():
  core.click( "templates/reward_done.png" )


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
  return core.click( "templates/mission_exit.png", True )

def clickMissionClose():
  core.click( "templates/mission_close.png" )


def doMissionExit():
  try_count = 0
  while clickMissionExit():
    try_count += 1
    if try_count >= 30:
      logger.error( "Error: mission exit not found")
      raise ValueError

  clickMissionClose()




def clickEndBookmark():
  core.click( "templates/end_bookmark.png" )



def doBattleLoop():
  while True:
    if detectYourScore():
      logger.debug( "Battle End")
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
        logger.error( "Error: attack not found")
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
        logger.error( "Error: enemy not found")
        raise ValueError
        break

      time.sleep(5)


    time.sleep( 10 )



def doStartMission1_1():
  chapter_try_counter = 0
  while( True ):
    if detectChapter1() :
      logger.debug( "Chapter1")
      break
    else:
      clickPrevChapter()
 
    chapter_try_counter += 1 
    if chapter_try_counter > 100 :
      logger.debug( "not found")
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
      logger.error( "Error: mission start fail")
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

      logger.debug( "Mission complete")
      break


    mission_count += 1

    if mission_count >= 20:
      logger.error( "Error: mission main loop")
      raise ValueError


def doTrainingRequired():
  # 経験値が満タンだってよ？
  if detectTrainingRequired():
    clickSelectBox()
    time.sleep(.5)

    clickContinue()
    time.sleep(.5)


