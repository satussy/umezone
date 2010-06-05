colorscheme asmdev
syntax on

filetype plugin on

let g:user_zen_expandabbr_key = '<TAB>'  

set hlsearch
set incsearch
set ruler
set showmatch
set showmode


set encoding=utf-8
set termencoding=utf-8
set fileencoding=utf-8
set fileencodings=utf-8,euc-jp,iso-2022-jp,ucs2le,ucs-2
set fileformat=unix


set nocompatible
set number
set noswapfile
set nobackup
set ignorecase
set smartindent
set autoindent
set tabstop=4
set sts=2
set sw=4
set splitright
set splitbelow
set backspace=2
set expandtab
set nowrap

set statusline=%<%f\%m%r%h%w%{'['.(&fenc!=''?&fenc:&enc).']['.&ff.']'}%=%l,%c%V%8P
set laststatus=2

nmap <Space> /
nmap ,q :q<CR>
nmap ,w :w<CR>
nmap t :tabedit .
nmap e :e .
nmap <C-p> :tabnext<CR>
nmap <C-n> :tabprevious<CR>
nmap <C-h> :nohl<CR>


nmap > <C-w>>
nmap < <C-w><

nmap <C-j> <C-e>
nmap <C-k> <C-y>

nmap <silent> q 0i//<ESC>
nmap <silent> Q 0xx<ESC>

nmap <F2> :undolist<CR>
nmap <F5> :!php -n %<CR>
nmap <F9> :tabedit ~/<CR>
nmap <F11> :!jslint -l %<CR>
nmap <F12> :!php -l %<CR>

vmap <silent> Q :s/^\/\///g<CR>:nohl<CR>
vmap <silent> q :s/^/\/\//g<CR>:nohl<CR>


imap <C-j> <Down>
imap <C-k> <Up>
imap <C-h> <Left>
imap <C-l> <Right>

imap <C-y> <BS>
imap <C-u> <Del>

imap <C-o> <ESC>o



let g:snippetsEmu_key="<C-w>"

inoremap (<CR> (<CR><C-t>


