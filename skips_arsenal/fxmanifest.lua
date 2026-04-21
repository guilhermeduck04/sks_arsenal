
fx_version "adamant"
 game "gta5" 


 ui_page "nui/index.html"
 ui_page_preload 'yes'
 
 client_scripts {
     "@vrp/lib/utils.lua",
     "client.lua"
 }
 
 server_scripts {
     "@vrp/lib/utils.lua",
     "server.lua"
 }
 
 files {
     "nui/font1.ttf",
     "nui/font2.ttf",
     "nui/index.html",
     "nui/script.js",
     "nui/style.css",
     "nui/transition.css",

     "nui/images/*.png",

 }