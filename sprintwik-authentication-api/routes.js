/*
 ____                               __                    __                                                          __                    
/\  _`\                  __        /\ \__              __/\ \                            __                          /\ \__                 
\ \,\L\_\  _____   _ __ /\_\    ___\ \ ,_\  __  __  __/\_\ \ \/'\          __     _____ /\_\      _ __   ___   __  __\ \ ,_\    __    ____  
 \/_\__ \ /\ '__`\/\`'__\/\ \ /' _ `\ \ \/ /\ \/\ \/\ \/\ \ \ , <        /'__`\  /\ '__`\/\ \    /\`'__\/ __`\/\ \/\ \\ \ \/  /'__`\ /',__\ 
   /\ \L\ \ \ \L\ \ \ \/ \ \ \/\ \/\ \ \ \_\ \ \_/ \_/ \ \ \ \ \\`\     /\ \L\.\_\ \ \L\ \ \ \   \ \ \//\ \L\ \ \ \_\ \\ \ \_/\  __//\__, `\
   \ `\____\ \ ,__/\ \_\  \ \_\ \_\ \_\ \__\\ \___x___/'\ \_\ \_\ \_\   \ \__/.\_\\ \ ,__/\ \_\   \ \_\\ \____/\ \____/ \ \__\ \____\/\____/
    \/_____/\ \ \/  \/_/   \/_/\/_/\/_/\/__/ \/__//__/   \/_/\/_/\/_/    \/__/\/_/ \ \ \/  \/_/    \/_/ \/___/  \/___/   \/__/\/____/\/___/ 
             \ \_\                                                                  \ \_\                                                   
              \/_/                                                                   \/_/                                                   
*/

require('dotenv').config()
const database = require('./database')
const logging = require('./logging')
const model = require('./models/schema')
const encryption = require('./encryption')
const templates = require('./templates')

module.exports = (application) => {
  application.post('/:parameters', (request, response) => {
    const { parameters } = request.params
    switch (parameters) {
      case 'author':
        response.json(process.env.author)
      case 'organization':
        response.json(process.env.organization)
      case 'version':
        response.json(process.env.version)
      case 'information':
        response.json(process.env.information)
      }
  })

  application.post('/user/login', (request, response) => {
    const public_key = request.body.public_key
    if (process.env.database_server === 'mongodb') {
      const connection = database.connection()
      const schema = model.schema()
      schema.findOne({
        email: encryption.decrypt(request.body.email, public_key),
        password: encryption.hash(encryption.decrypt(request.body.password,  public_key))
      }, (error, database_response) => {
        if (error) {
          connection.close()
          response.json('500')
          logging.log('error', error)
        } else if (database_response) {
          connection.close()
          response.json('200')
        } else {
          connection.close()
          response.json('205')
        }
      })
    } else if (process.env.database_server === 'mysql') {
      const connection = database.connection()
      connection.query('SELECT email, password FROM users WHERE email = ? AND password = ?', [
        encryption.decrypt(request.body.email, public_key),
        encryption.hash(encryption.decrypt(request.body.password,  public_key))
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json('200')
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })
    
  application.post('/user/register', (request, response) => {
    const public_key = request.body.public_key
    if (process.env.database_server === 'mongodb') {
      const connection = database.connection()
      const schema = model.schema()
      schema.findOne({
        email: encryption.decrypt(request.body.email, public_key),
      }, (error, database_response) => {
        if (error) {
          connection.close()
        	response.json('500')
          logging.log('error', error)
        } else if (database_response) {
          connection.close()
          response.json('205')
        } else {
          schema.create({
          	first_name: encryption.decrypt(request.body.first_name, public_key),
            last_name: encryption.decrypt(request.body.last_name, public_key),
            email: encryption.decrypt(request.body.email, public_key),
            password: encryption.hash(encryption.decrypt(request.body.password,  public_key)),
            profile_picture: templates.profile_picture(),
            header_picture: templates.header_picture(),
            name: templates.name(),
            role: templates.role(),
            address: templates.address(),
            city: templates.city(),
            country: templates.country()
          }, (error, database_response) => {
            if (error) {
              connection.close()
              response.json('500')
              logging.log('error', error)
            } else if (database_response) {
              connection.close()
              response.json('200')
            } else {
              connection.close()
              response.json('205')
            }
          })
        }
      })
    } else if (process.env.database_server === 'mysql') {
      const connection = database.connection()
      connection.query('SELECT email FROM users WHERE email = ?', [
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
        	logging.log('error', error)
        } else if (row && row.length) {
      		connection.end()
          response.json('205')
        } else {
          connection.query('INSERT INTO users (first_name, last_name, email, password, profile_picture, header_picture, name, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            encryption.decrypt(request.body.first_name, public_key),
            encryption.decrypt(request.body.last_name, public_key),
            encryption.decrypt(request.body.email, public_key),
            encryption.hash(encryption.decrypt(request.body.password,  public_key)),
            templates.profile_picture(),
            templates.header_picture(),
            templates.name(),
            templates.role()
          ], (error, row) => {
            if (error) {
              connection.end()
              response.json('500')
              logging.log('error', error)
            } else if (row && row.length) {
              connection.end()
              response.json('200')
            } else {
              connection.end()
              response.json('205')
            }
          })
        }
      })
    }
  })

  application.post('/user/check', (request, response) => {
    const public_key = request.body.public_key
    if (process.env.database_server === 'mongodb') {
      const connection = database.connection()
      const schema = model.schema()
      schema.findOne({
        email: encryption.decrypt(request.body.email, public_key)
      }, (error, database_response) => {
        if (error) {
          connection.close()
          response.json('500')
          logging.log('error', error)
        } else if (database_response) {
          connection.close()
          response.json('200')
        } else {
          connection.close()
          response.json('205')
        }
      })
    } else if (process.env.database_server === 'mysql') {
      const connection = database.connection()
      connection.query('SELECT email FROM users WHERE email = ?', [
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json('200')
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })
}
