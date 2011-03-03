############################################## 
# bzr
#---------------------------------------------
alias bs="bzr status"
alias cdr='cd $(bzr root)'
alias cdmain='cd $(bzr root)/apps/main'
alias cdmodule='cd $(bzr root)/apps/main/modules'
alias cdsocial='cd $(bzr root)/plugins/social_game_platform_corePlugin/lib'
alias cdweb='cd $(bzr root)/web'
alias vischema='vi $(bzr root)/apps/main/config/schema.yml'
alias vitemplate='vi $(bzr root)/apps/main/config/template.yml'
alias visettings='vi $(bzr root)/apps/main/config/settings.yml'

alias cdr='cd ~/project'
alias cdmain='cd ~/project/apps/main'
alias cdmodule='cd ~/project/apps/main/modules'
alias cdsocial='cd ~/project/plugins/social_game_platform_corePlugin/lib'
alias vischema='vi ~/project/config/schema.yml'
alias vitemplate='vi ~/project/apps/main/config/template.yml'
alias visettings='vi ~/project/apps/main/config/settings.yml'
alias cdweb='cd ~/project/web'

local IP_KAMIYA=10.10.0.2
local IS_DESK=$(nslookup kamiya|tail -2|egrep -o $IP_KAMIYA)
if [[ $IS_DESK != $IP_KAMIYA ]]; then
    local BZR_HOST_PORT=20022
    local CHUCK_HOST_PORT=21022
    export IS_DESK=0
    export BZR_HOST=localhost:$BZR_HOST_PORT
    local CHUCK_HOST="localhost"
    alias sshchuck="ssh -fN chuck-user@$CHUCK_HOST -p $CHUCK_HOST_PORT -R 30602:localhost:80"
    alias sshkamiya="ssh osuga-h@gw1.klab.org -i ~/.ssh/id_rsa_kamiya -p 10022 -I osuga-h -L $BZR_HOST_PORT:fashion.dev.klabgames.net:22 -L $CHUCK_HOST_PORT:chuck.klab.org:22"
else
    export IS_DESK=1
    export BZR_HOST=fashion.dev.klabgames.net
    local CHUCK_HOST=chuck.klab.org
    alias sshchuck="ssh -fN chuck-user@$CHUCK_HOST -R 30602:localhost:80"
fi


##############################################
# export
#---------------------------------------------
export LANG=ja_JP.UTF-8
export EDITOR=vim
export PYTHONPATH=$HOME/local/lib/python
export PERL5LIB=/home/cocoromi/perl/lib/perl:/home/bashi/perl/share/perl
export LD_LIBRARY_PATH="$HOME/local/lib"
export EDITOR=vim
#export LSCOLORS=ExFxCxdxBxegedabagacad
export LS_COLORS='di=01;34:ln=01;35:so=01;32:ex=01;31:bd=46;34:cd=43;34:su=41;30:sg=46;30:tw=42;30:ow=43;30'
zstyle ':completion:*' list-colors 'di=;34;1' 'ln=;35;1' 'so=;32;1' 'ex=31;1' 'bd=46;34' 'cd=43;34'

export PATH=$HOME/.local/bin:$PATH
#export PATH=/opt/local/bin:/opt/local/sbin/:$PATH
export MANPATH=/opt/local/man:$MANPATH

##############################################
# alias
#---------------------------------------------

alias ls='ls -F --color=auto'
#alias ls='ls -G'
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

##############################################
# prompt 
#---------------------------------------------
autoload colors
colors

local COMMAND=""
local COMMAND_TIME=""
precmd() { 
    if [ "$COMMAND_TIME" -ne "0" ] ; then 
        local d=`date +%s`
        d=`expr $d - $COMMAND_TIME`
        if [ "$d" -ge "2" ] ; then
            COMMAND="$COMMAND "
            php /home/osuga-h/bin/growl.shell.php "${${(s: :)COMMAND}[1]}" "$COMMAND" 
        fi
    fi
    COMMAND=""
    COMMAND_TIME="0"
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
PROMPT=$DEFAULT'[$CYAN${USER}$DEFAULT@$CYAN${HOSTNAME}$DEFAULT]$CYAN$AGENT_MARK$YELLOW$TITLE$DEFAULT%(!.#.$) '
RPROMPT=$PURPLE'[%~]'$DEFAULT
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



export TERM=xterm-16color
