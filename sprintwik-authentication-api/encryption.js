/*
 ____                               __                    __                                                                                  __                           
/\  _`\                  __        /\ \__              __/\ \                            __                                                  /\ \__  __                    
\ \,\L\_\  _____   _ __ /\_\    ___\ \ ,_\  __  __  __/\_\ \ \/'\          __     _____ /\_\         __    ___     ___   _ __   __  __  _____\ \ ,_\/\_\    ___     ___    
 \/_\__ \ /\ '__`\/\`'__\/\ \ /' _ `\ \ \/ /\ \/\ \/\ \/\ \ \ , <        /'__`\  /\ '__`\/\ \      /'__`\/' _ `\  /'___\/\`'__\/\ \/\ \/\ '__`\ \ \/\/\ \  / __`\ /' _ `\  
   /\ \L\ \ \ \L\ \ \ \/ \ \ \/\ \/\ \ \ \_\ \ \_/ \_/ \ \ \ \ \\`\     /\ \L\.\_\ \ \L\ \ \ \    /\  __//\ \/\ \/\ \__/\ \ \/ \ \ \_\ \ \ \L\ \ \ \_\ \ \/\ \L\ \/\ \/\ \ 
   \ `\____\ \ ,__/\ \_\  \ \_\ \_\ \_\ \__\\ \___x___/'\ \_\ \_\ \_\   \ \__/.\_\\ \ ,__/\ \_\   \ \____\ \_\ \_\ \____\\ \_\  \/`____ \ \ ,__/\ \__\\ \_\ \____/\ \_\ \_\
    \/_____/\ \ \/  \/_/   \/_/\/_/\/_/\/__/ \/__//__/   \/_/\/_/\/_/    \/__/\/_/ \ \ \/  \/_/    \/____/\/_/\/_/\/____/ \/_/   `/___/> \ \ \/  \/__/ \/_/\/___/  \/_/\/_/
             \ \_\                                                                  \ \_\                                           /\___/\ \_\                            
              \/_/                                                                   \/_/                                           \/__/  \/_/                                                                                            \/_/                                            \/__/  \/_/                                                 
*/

const crypto = require('crypto')
require('dotenv').config()

module.exports = {
  decrypt : (data, public_key) => {
    const decipher = crypto.createDecipheriv(process.env.algorithm, process.env.private_key, public_key)
    let decrypted = decipher.update(data,'hex','utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  },
  
  hash : (data) => {
    return crypto.createHmac('sha256', process.env.secret).update(data).digest('hex')
  }
}