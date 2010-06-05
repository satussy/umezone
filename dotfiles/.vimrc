colorscheme asmdev                                            " color setting
syntax on                                                     " enable syntax hilighting

filetype plugin on                                            " enable filetype plugin

let g:user_zen_expandabbr_key = '<TAB>'                       " set TAB key to trigger for zen coding

set hlsearch                                                  " hilight words in search
set incsearch                                                 " use incremental search
set ruler                                                     " show ruler
set showmatch                                                 " hilight bracket when a bracket is inserted
set showmode                                                  " shoe current editor mode in status line

set encoding=utf-8                                            " set encoding 
set termencoding=utf-8                                        " set terminal encoding
set fileencoding=utf-8                                        " set file encoding
set fileencodings=utf-8,euc-jp,iso-2022-jp,ucs2le,ucs-2       " set priority to detect file encoding 
set fileformat=unix                                           " set line break charactor


set nocompatible                                              " disable vi compatibility
set number                                                    " show line number on left side
set noswapfile                                                " disable swap file
set nobackup                                                  " disable backup
set ignorecase                                                " ignore case in search
set smartindent                                               " enable smart indent
set autoindent                                                " enable auto indent
set tabstop=4                                                 " set tab stop to 4
set sts=2                                                     " soft tab stop
set sw=4                                                      " shift width 
set splitright                                                " split window to right   (:sp
set splitbelow                                                " split window to bellow  (:vs
set backspace=2                                               " delete indent , eol and start by Back space
set expandtab                                                 " use space instead of tab
set nowrap                                                    " disable line wrapping

set statusline=%<%f\%m%r%h%w%{'['.(&fenc!=''?&fenc:&enc).']['.&ff.']'}%=%l,%c%V%8P
set laststatus=2                                              " always show status line

" start search by Space
nmap <Space> /

" short cuts
nmap ,q :q<CR>
nmap ,w :w<CR>


" open current directory in tab (need push enter
nmap t :tabedit .

" open current directory in current buffer (need push enter
nmap e :e .

" move to next tab
nmap <C-p> :tabnext<CR>

" move to previous tab
nmap <C-n> :tabprevious<CR>

" off search hiligh
nmap <C-h> :nohl<CR>

" window expanding
nmap > <C-w>>

" window collapse
nmap < <C-w><

" scroll down without cursor moving
nmap <C-j> <C-e>

" scroll up without cursor moving
nmap <C-k> <C-y>

" insert comment out
nmap <silent> q 0i//<ESC>

" remove comment out
nmap <silent> Q 0xx<ESC>

" insert comment out to multi line
vmap <silent> Q :s/^\/\///g<CR>:nohl<CR>

" remove comment out from multi line
vmap <silent> q :s/^/\/\//g<CR>:nohl<CR>

" show undo list by F2
nmap <F2> :undolist<CR>

" run php by F5
nmap <F5> :!php -n %<CR>

" open home directory in new tab by F9
nmap <F9> :tabedit ~/<CR>

" check syntax for javascript by F11
nmap <F11> :!jslint -l %<CR>

" check syntax for php by F12
nmap <F12> :!php -l %<CR>

" move cursor by jkhl with Control holding in insert mode
imap <C-j> <Down>
imap <C-k> <Up>
imap <C-h> <Left>
imap <C-l> <Right>

" use C-y and C-u as BS and Del in insert mode
imap <C-y> <BS>
imap <C-u> <Del>

" insert line to next line in insert mode
imap <C-o> <ESC>o


""""""""""""""""""""""""""""""""""
" experimental setting
"_________________________________
inoremap (<CR> (<CR><C-t>




