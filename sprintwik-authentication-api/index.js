/*
 ____                               __                    __                                   
/\  _`\                  __        /\ \__              __/\ \                            __    
\ \,\L\_\  _____   _ __ /\_\    ___\ \ ,_\  __  __  __/\_\ \ \/'\          __     _____ /\_\   
 \/_\__ \ /\ '__`\/\`'__\/\ \ /' _ `\ \ \/ /\ \/\ \/\ \/\ \ \ , <        /'__`\  /\ '__`\/\ \  
   /\ \L\ \ \ \L\ \ \ \/ \ \ \/\ \/\ \ \ \_\ \ \_/ \_/ \ \ \ \ \\`\     /\ \L\.\_\ \ \L\ \ \ \ 
   \ `\____\ \ ,__/\ \_\  \ \_\ \_\ \_\ \__\\ \___x___/'\ \_\ \_\ \_\   \ \__/.\_\\ \ ,__/\ \_\
    \/_____/\ \ \/  \/_/   \/_/\/_/\/_/\/__/ \/__//__/   \/_/\/_/\/_/    \/__/\/_/ \ \ \/  \/_/
             \ \_\                                                                  \ \_\      
              \/_/                                                                   \/_/                                                                                                           
*/

const express = require('express')
const application = express()
require('dotenv').config()
application.use(express.json({limit: '64mb'}))
application.use(express.urlencoded({extended: true}))
require('./routes')(application)

application.listen(process.env.port, () => {
  console.log('Sprintwik Authentication Api luisterend naar poort: ' + process.env.port)
})
