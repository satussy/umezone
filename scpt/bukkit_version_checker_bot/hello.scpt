on run argv
    tell application "Skype"
        #send command "SEARCH RECENTCHATS" script name "My Script"
        send command "CHATMESSAGE " & item 1 of argv & " " & item 2 of argv script name "My Script"
    end tell
end run
