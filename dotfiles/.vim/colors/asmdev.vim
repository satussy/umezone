" Vim color file
" Maintainer:   Hans Fugal <hans@fugal.net>
" Last Change:  $Date: 2003/05/06 16:37:49 $
" URL:		http://hans.fugal.net/vim/colors/desert.vim

" cool help screens
" :he group-name
" :he highlight-groups
" :he cterm-colors

set background=dark
if version > 580
    " no guarantees for version 5.8 and below, but this makes it stop
    " complaining
    hi clear
    if exists("syntax_on")
	syntax reset
    endif
endif
let g:colors_name="desert"

" color terminal definitions
hi SpecialKey	            ctermfg=darkgreen
hi NonText	     cterm=bold ctermfg=darkblue
hi Directory	            ctermfg=cyan
hi ErrorMsg	     cterm=bold ctermfg=white   ctermbg=darkred
hi IncSearch	 cterm=NONE ctermfg=yellow  ctermbg=green
hi Search	     cterm=NONE ctermfg=darkred ctermbg=red
hi MoreMsg	                ctermfg=darkgreen
hi ModeMsg       cterm=NONE ctermfg=darkmagenta
hi LineNr	                ctermfg=magenta
hi Question	                ctermfg=green
hi VertSplit	 cterm=reverse
hi Title	                ctermfg=5
hi Visual	     cterm=bold
hi VisualNOS	 cterm=bold,underline
hi WarningMsg	            ctermfg=darkmagenta
hi WildMenu                 ctermfg=0        ctermbg=3
hi Folded	                ctermfg=darkcyan ctermbg=black
hi FoldColumn	            ctermfg=darkgray ctermbg=darkgray
hi DiffAdd	                                 ctermbg=red
hi DiffChange	                             ctermbg=darkgray
hi DiffDelete	 cterm=bold ctermfg=4        ctermbg=cyan
hi DiffText	     cterm=bold                  ctermbg=black
hi Comment	                ctermfg=darkgreen
hi Constant	                ctermfg=brown
hi Special	                ctermfg=5
hi Identifier	            ctermfg=darkcyan
hi Statement	            ctermfg=darkcyan
hi PreProc	                ctermfg=5
hi Type		                ctermfg=darkcyan
hi Underlined	 cterm=underline ctermfg=5
hi Ignore	     cterm=bold ctermfg=7
hi Error	     cterm=bold ctermfg=7 ctermbg=1

" color popup window
hi Pmenu    ctermfg=darkred ctermbg=black
hi PmenuSel ctermfg=white   ctermbg=red

" color tabbar
hi TabLine    ctermfg=white ctermbg=black
hi TabLineSel ctermfg=white ctermbg=darkmagenta

" color status
hi StatusLine	 cterm=NONE ctermbg=darkmagenta ctermfg=white
hi StatusLineNC  cterm=reverse

hi phpComment        ctermfg=darkgreen    "comment
hi phpStringDouble   ctermfg=darkyellow   "string
hi phpStringSingle   ctermfg=yellow       "string
hi phpConditional    ctermfg=darkmagenta  "if
hi phpRepeat         ctermfg=darkmagenta  "foreach
hi phpKeyword        ctermfg=darkmagenta  "const
hi phpClasses        ctermfg=darkgray     "Exception
hi phpType           ctermfg=darkmagenta  "null
hi phpStructure      ctermfg=darkmagenta  "self class extends
hi phpStorageClass   ctermfg=darkmagenta  "class
hi phpIdentifier     ctermfg=darkcyan     "variable name
hi phpVarSelector    ctermfg=darkblue     "$
hi phpException      ctermfg=darkmagenta  "throw
hi phpFunction       ctermfg=darkred      "is_numeric
hi phpComparison     ctermfg=white        "== >= <=
hi phpBoolean        ctermfg=darkyellow   "true false
hi phpFunctions      ctermfg=darkgray     "is_numeric
hi phpOperator       ctermfg=darkgray     "! = :: isset
hi phpDefine         ctermfg=darkmagenta  "function
hi phpLabel          ctermfg=darkyellow   "case
hi phpMemberSelector ctermfg=darkgray
hi phpRelation       ctermfg=darkgray     "moge '=>' moge
hi phpStateMent      ctermfg=darkyellow   "break continue
"hi phpHereDoc        ctermfg=cyan

"hi phpBacktick      ctermfg=white
"hi phpFCKeyword     ctermfg=magenta
"hi phpSCKeyword     ctermfg=magenta

hi htmlTagName     ctermfg=darkgreen
hi htmlTag         ctermfg=darkgreen
hi htmlEndTag      ctermfg=darkgreen
hi htmlLink        cterm=none ctermfg=darkred 
hi htmlString      ctermfg=darkgray
hi htmlArg         ctermfg=white
hi htmlComment     ctermfg=cyan
hi htmlCommentPart ctermfg=cyan

hi javascriptOperator ctermfg=darkgray




















"""""""""""""""""""""""""""""""""""""""""""""""""""""
hi Normal	guifg=white guibg=#304050

" highlight groups
hi Cursor	guibg=khaki guifg=slategrey
"hi CursorIM
"hi Directory
"hi DiffAdd
"hi DiffChange
"hi DiffDelete
"hi DiffText
"hi ErrorMsg
hi VertSplit	guibg=#102030 guifg=#102030 gui=none
hi Folded	guifg=#203040 guibg=#405060
hi FoldColumn	guibg=grey30 guifg=tan
hi IncSearch	guifg=slategrey guibg=khaki
"hi LineNr
hi ModeMsg	guifg=goldenrod
hi MoreMsg	guifg=SeaGreen
hi NonText	guifg=LightBlue guibg=grey30
hi Question	guifg=springgreen
hi Search	guibg=peru guifg=wheat
hi SpecialKey	guifg=yellowgreen
hi StatusLine	guibg=#102030 guifg=grey70 gui=none
hi StatusLineNC	guibg=#203040 guifg=grey50 gui=none
hi Title	guifg=indianred
hi Visual	gui=none guifg=khaki guibg=olivedrab
"hi VisualNOS
hi WarningMsg	guifg=salmon
"hi WildMenu
"hi Menu
"hi Scrollbar
"hi Tooltip

" syntax highlighting groups
hi Comment	 guifg=#8090a0
hi Constant	 guifg=#ff6070
hi Identifier	 guifg=#70d080 gui=bold
hi Statement	 guifg=khaki
hi PreProc	 guifg=indianred
hi Type		 guifg=darkkhaki
hi Special	 guifg=navajowhite
"hi Underlined
hi Ignore	 guifg=grey40
"hi Error
hi Todo		 guifg=white guibg=#8090a0

