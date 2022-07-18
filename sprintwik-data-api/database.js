/*
 ____                               __                    __                                        __            __             __                                 
/\  _`\                  __        /\ \__              __/\ \                            __        /\ \          /\ \__         /\ \                                
\ \,\L\_\  _____   _ __ /\_\    ___\ \ ,_\  __  __  __/\_\ \ \/'\          __     _____ /\_\       \_\ \     __  \ \ ,_\    __  \ \ \____     __      ____     __   
 \/_\__ \ /\ '__`\/\`'__\/\ \ /' _ `\ \ \/ /\ \/\ \/\ \/\ \ \ , <        /'__`\  /\ '__`\/\ \      /'_` \  /'__`\ \ \ \/  /'__`\ \ \ '__`\  /'__`\   /',__\  /'__`\ 
   /\ \L\ \ \ \L\ \ \ \/ \ \ \/\ \/\ \ \ \_\ \ \_/ \_/ \ \ \ \ \\`\     /\ \L\.\_\ \ \L\ \ \ \    /\ \L\ \/\ \L\.\_\ \ \_/\ \L\.\_\ \ \L\ \/\ \L\.\_/\__, `\/\  __/ 
   \ `\____\ \ ,__/\ \_\  \ \_\ \_\ \_\ \__\\ \___x___/'\ \_\ \_\ \_\   \ \__/.\_\\ \ ,__/\ \_\   \ \___,_\ \__/.\_\\ \__\ \__/.\_\\ \_,__/\ \__/.\_\/\____/\ \____\
    \/_____/\ \ \/  \/_/   \/_/\/_/\/_/\/__/ \/__//__/   \/_/\/_/\/_/    \/__/\/_/ \ \ \/  \/_/    \/__,_ /\/__/\/_/ \/__/\/__/\/_/ \/___/  \/__/\/_/\/___/  \/____/
             \ \_\                                                                  \ \_\                                                                           
              \/_/                                                                   \/_/                                                                          
*/

require('dotenv').config()
const mongoose = require('mongoose')
const logging = require('./logging')
const mysql = require('mysql')

module.exports = {
  connection : (database) => {
    if (process.env.database_server === 'mongodb') {
      mongoose.connect('mongodb://' +
        process.env.database_host + ':' +
        process.env.database_port + '/' +
        database, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, (error) => { if (error) {
          logging.log('error', error) }
        })
      return mongoose.connection
    } else if (process.env.database_server === 'mysql') {
      const database_connection = mysql.createConnection({
        user: process.env.database_username,
        password: process.env.database_password,
        host: process.env.database_host,
        port: process.database_port,
        database: database
      }, (error) => { if (error) {
        logging.log('error', error) }
      })
      return database_connection
    }
  }
}
