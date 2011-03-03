
" error log
imap <buffer> <C-e> foreach(explode("\n",print_r( ,true)) as $line){error_log("{OSUGA}::".get_class()."::L".__line__."::".$line);}<ESC>0WWi

" run php by F5
nmap <buffer> <F5> :!php -n %<CR>

" syntax check
nmap <buffer> <F6> :!php -l %<CR>

