##############################################
# export
#---------------------------------------------
#export LANG=ja_JP.UTF-8
export EDITOR=vim
export LD_LIBRARY_PATH="$HOME/local/lib"
export EDITOR=vim
#export LSCOLORS=ExFxCxdxBxegedabagacad
export LS_COLORS='di=01;34:ln=01;35:so=01;32:ex=01;31:bd=46;34:cd=43;34:su=41;30:sg=46;30:tw=42;30:ow=43;30'
zstyle ':completion:*' list-colors 'di=;34;1' 'ln=;35;1' 'so=;32;1' 'ex=31;1' 'bd=46;34' 'cd=43;34'

export PATH=/usr/local/bin:$PATH

export MANPATH=/opt/local/man:$MANPATH
export JAVA_HOME=/Library/Java/Home/

##############################################
# alias
#---------------------------------------------

#alias ls='ls -F --color'
alias ls='ls -G'
alias lsa="ls -la"
alias lf="ls -F"
alias ll="ls -l"
alias su="su -l"
alias gh="history 0 | grep" 
alias where="command -v"
alias ,q='exit'
alias vi='vim'
alias grep="egrep -ir --color"
#alias j="jobs -l"
#alias gd='dirs -v;echo -n "select number: "; read newdir; cd -"$newdir"'
#alias du="du -h"
#alias df="df -h"
alias smb='convert_smb_url'

##############################################
# prompt 
#---------------------------------------------
autoload colors
colors

local COMMAND=""
local COMMAND_TIME=""
local CURRENT_BRANCH=""
precmd() { 
    if [ "$COMMAND_TIME" -ne "0" ] ; then 
        local d=`date +%s`
        d=`expr $d - $COMMAND_TIME`
        if [ "$d" -ge "3" ] ; then
            COMMAND="$COMMAND "
            growlnotify -t "${${(s: :)COMMAND}[1]}" -m "$COMMAND" 
        fi
    fi
    COMMAND="0"
    COMMAND_TIME="0"


    CURRENT_BRANCH=`git symbolic-ref --short HEAD 2>/dev/null`
    if [ -z "${CURRENT_BRANCH}" ] ; then
      CURRENT_BRANCH=
    else
      CURRENT_BRANCH="[${CURRENT_BRANCH}]"
    fi

}
preexec () {
    COMMAND="${1}"
    COMMAND_TIME=`date +%s`
}

AGENT_MARK="A"
if [ -z "$SSH_AGENT_PID" ] ; then
    AGENT_MARK=":"
fi

local GRAY=$'%{\e[1;30m%}'
local LIGHT_GRAY=$'%{\e[0;37m%}'
local DEFAULT=$'%{\e[1;37m%}'

local CYAN=$'%{\e[1;36m%}'
local YELLOW=$'%{\e[1;33m%}'
local PURPLE=$'%{\e[1;35m%}'
local GREEN=$'%{\e[1;32m%}'
local BLUE=$'%{\e[1;34m%}'



HOSTNAME=`hostname`
PROMPT=$DEFAULT'[$CYAN${USER}$DEFAULT@$CYAN${HOSTNAME}$DEFAULT]$CYAN$AGENT_MARK''$YELLOW$TITLE$DEFAULT%(!.#.$) '
RPROMPT=$PURPLE'[%~]${CYAN}${CURRENT_BRANCH}'${DEFAULT}
if [ -z "$SSH_CLIENT" ] ; then
    HOSTNAME=""
    PROMPT=$DEFAULT'[$GREEN${USER}$DEFAULT@$GREEN${HOSTNAME}${DEFAULT}]${AGENT_MARK}''%(!.#.$) '
    RPROMPT=$CYAN'[%~]${PURPLE}${CURRENT_BRANCH}'${DEFAULT}
fi


setopt PROMPT_SUBST


##############################################
# set options
#---------------------------------------------
setopt auto_pushd
setopt correct
setopt list_packed
#setopt auto_cd
#setopt noautoremoveslash # no remove postfix slash of command line
#setopt nolistbeep # no beep sound when complete list displayed

##############################################
# history
#---------------------------------------------
bindkey -e

autoload history-search-end
zle -N history-beginning-search-backward-end history-search-end
zle -N history-beginning-search-forward-end history-search-end
bindkey "^p" history-beginning-search-backward-end
bindkey "^n" history-beginning-search-forward-end
bindkey "\\ep" history-beginning-search-backward-end
bindkey "\\en" history-beginning-search-forward-end

HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt hist_ignore_all_dups hist_save_no_dups
setopt share_history # share command history data
setopt auto_list

##############################################
# Completion configuration
#---------------------------------------------
autoload -U compinit
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

## Alias configuration
#
# expand aliases before completing
#
setopt complete_aliases # aliased ls needs if file/dir completions work

compinit



#export TERM=xterm-16color

function convert_smb_url() {
  local file_path=''
  if [ -n "$1" ] ; then
    file_path=$1
  else
    file_path=`print -R $(pbpaste)`
  fi

  if [ -n $file_path ] ; then
    local prefix=`echo $1|egrep "^smb://" -o`
    local direction=''
    local sed1=''
    local sed2=''

    print -R convert $file_path
    # case samba to win
    if [ -n "$prefix" ] ; then
      direction="mac–>win"
      sed1='s/\//\\/g'
      sed2='s/smb://'
    # case win to samba 
    else
      direction="win->mac"
      sed1='s/\\/\//g'
      sed2='s/^/smb:/' 
    fi

    #echo $direction
    #print -R "$file_path" | sed -e "$sed1" -e "$sed2"
    print -R "$file_path" | sed -e "$sed1" -e "$sed2" | pbcopy

    #print convert result will be copied into clipboard
  fi
}

function up() {
  to=$(perl -le '$p=$ENV{PWD}."/";$d="/".$ARGV[0]."/";$r=rindex($p,$d);$r>=0 && print substr($p, 0, $r+length($d))' $1)
  if [ "$to" = "" ]; then
    echo "no such file or directory: $1" 1>&2
    return 1
  fi
  cd $to
}


local WORK_ROOT=${HOME}/Work
local DEV_ROOT=${WORK_ROOT}/watch
alias cdr='cd ${WORK_ROOT}'
alias cddev='cd ${DEV_ROOT}'
alias cdcss='cd ${DEV_ROOT}/web/css/watch_zero'

fpath=(~/.functions ${fpath})
