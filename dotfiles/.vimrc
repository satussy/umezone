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

let g:use_xhtml = 1
let g:html_use_css = 1
let g:html_no_pre = 1


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


"set foldmethod=marker
set foldmethod=indent
set foldminlines=10
set foldlevel=1
set foldnestmax=2
set foldtext=MyFoldText()
set fillchars=fold:\ ,vert:\|
function! MyFoldText()
    "let line = getline(v:foldstart)
    "let sub = substitute( line , ' *', '', '')
    return '        {{{{{{{{{{{{{{{{{{{{{ (>_< ) }}}}}}}}}}}}}}}}}}}}}'
endfunction

" start search by Space
nmap <Space> /

" short cuts
nmap <silent> ,q :q<CR>
nmap <silent> ,w :w<CR>


" open current directory in tab (need push enter
nmap t :tabedit +tabmove .

" open current directory in current buffer (need push enter
nmap e :e .

" move to next tab
nmap <silent> <C-p> :tabnext<CR>

" move to previous tab
nmap <silent> <C-n> :tabprevious<CR>

" off search hiligh
nmap <silent> <C-h> :nohl<CR>

" window expanding
nmap > <C-w>>

" window collapse
nmap < <C-w><

" scroll down without cursor moving
nmap <C-j> <C-e>

" scroll up without cursor moving
nmap <C-k> <C-y>

" insert comment out
nmap <silent> q I//<ESC>

" remove comment out
nmap <silent> Q ^xx<ESC>

" cd to directory containing current file
nmap <silent> <C-c><C-d> :cd %:h<CR>

" insert comment out to multi line
vmap <silent> Q :s/^\/\///g<CR>:nohl<CR>

" remove comment out from multi line
vmap <silent> q :s/^/\/\//g<CR>:nohl<CR>

" show undo list by F2
" nmap <F2> :undolist<CR>

" open home directory in new tab by F9
nmap <silent> <F9>  :tabedit ~/<CR>
nmap <silent> <F10> :tabedit ~/.vimrc<CR>
"nmap <silent> <F11> :source ~/.vimrc<CR>:echo "updated"<CR>
nnoremap  <F11> :source ~/.vimrc<CR>:echo "updated"<CR>

" move cursor by jkhl with Control holding in insert mode
imap <C-j> <Down>
imap <C-k> <Up>
imap <C-h> <Left>
imap <C-l> <Right>

" use C-y and C-u as BS and Del in insert mode
imap <C-u> <BS>
imap <C-i> <Del>

" insert line to next line in insert mode
imap <C-o> <ESC>o






""""""""""""""""""""""""""""""""""
" experimental setting
"_________________________________
inoremap (<CR> (<CR><C-t>




colorscheme asmdev                                            " color setting
