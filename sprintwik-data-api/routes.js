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
const { exceptions } = require('winston')
const { v4: uuidv4 } = require('uuid')

module.exports = (application) => {
  application.get('/:parameters', (request, response) => {
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

  application.post('/user/timeline/insert/post', (request, response) => {
    const public_key = request.body.public_key
    if (process.env.database_server === 'mongodb') {
      const connection = database.connection(process.env.database)
      const schema = model.post()
      schema.create({
        email: encryption.decrypt(request.body.email, public_key),
        date: encryption.decrypt(request.body.date, public_key),
        text: encryption.decrypt(request.body.text, public_key),
        picture: encryption.decrypt(request.body.picture, public_key),
        upid: uuidv4()
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
      const connection = database.connection(process.env.database)
      if (request.body.picture === undefined) {
        connection.query('INSERT INTO posts (email, date, text, timestamp) VALUES (?, ?, ?, ?)', [
          encryption.decrypt(request.body.email, public_key),
          encryption.decrypt(request.body.date, public_key),
          encryption.decrypt(request.body.text, public_key),
          encryption.decrypt(request.body.upid, public_key)
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
    	} else {
        connection.query('INSERT INTO posts (email, date, text, picture, timestamp) VALUES (?, ?, ?, ?, ?)', [
          encryption.decrypt(request.body.email, public_key),
          encryption.decrypt(request.body.date, public_key),
          encryption.decrypt(request.body.text, public_key),
          encryption.decrypt(request.body.picture, public_key),
          encryption.decrypt(request.body.upid, public_key)
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
    }
  })

  application.post('/user/timeline/remove/post', (request, response) => {
    const public_key = request.body.public_key
    if (process.env.database_server === 'mongodb') {
      const connection = database.connection(process.env.database)
      const schema = model.post()
      schema.findOneAndDelete({ upid: encryption.decrypt(request.body.upid, public_key)
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
      const connection = database.connection(process.env.database)
      connection.query('DELETE FROM posts WHERE timestamp = ?', [
        encryption.decrypt(request.body.timestamp, public_key)
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
    
  application.post('/user/timeline/select/post', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.database)
			const schema = model.post()
			schema.find({ email: encryption.decrypt(request.body.email, public_key)
			}, (error, database_response) => {
				if (error) {
					connection.close()
					response.json('500')
					logging.log('error', error)
				} else if (database_response) {
					connection.close()
					response.json(database_response)
				} else {
          connection.close()
          response.json('205')
        }
			})
		} else if (process.env.database_server === 'mysql') {
			const connection = database.connection(process.env.database)
      if (request.body.picture === undefined) {
        connection.query('SELECT email, date, text FROM posts where email = ?', [
          encryption.decrypt(request.body.email, public_key)
        ], (error, row) => {
          if (error) {
            connection.end()
            response.json('500')
            logging.log('error', error)
          } else if (row && row.length) {
            connection.end()
            response.json(row)
          } else {
            connection.end()
            response.json('205')
          }
        })
      } else {
        connection.query('SELECT email, date, text, picture FROM posts where email = ?', [
          encryption.decrypt(request.body.email, public_key)
        ], (error, row) => {
          if (error) {
            connection.end()
            response.json('500')
            logging.log('error', error)
          } else if (row && row.length) {
            connection.end()
            response.json(row)
          } else {
            connection.end()
            response.json('205')
          }
        })
      }
    }
  })

  application.post('/user/timeline/select/header', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
			schema.find({ email: encryption.decrypt(request.body.email, public_key)
			}, (error, database_response) => {
				if (error) {
					connection.close()
					response.json('500')
					logging.log('error', error)
				} else if (database_response) {
					connection.close()
					response.json(database_response)
				} else {
          connection.close()
          response.json('205')
        }
			})
		} else if (process.env.database_server === 'mysql') {
			const connection = database.connection(process.env.authentication_database)
      connection.query('SELECT email, profile_picture, header_picture, first_name, last_name, city, country, role FROM users where email = ?', [
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })

  application.post('/user/profile/select/settings', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
			schema.find({ email: encryption.decrypt(request.body.email, public_key)
			}, (error, database_response) => {
				if (error) {
					connection.close()
					response.json('500')
					logging.log('error', error)
				} else if (database_response) {
					connection.close()
					response.json(database_response)
				} else {
          connection.close()
          response.json('205')
        }
			})
		} else if (process.env.database_server === 'mysql') {
			const connection = database.connection(process.env.authentication_database)
      connection.query('SELECT email, profile_picture, header_picture, first_name, last_name, address, city, country, role FROM users where email = ?', [
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })

  application.post('/user/profile/update/profile-picture', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
			schema.findOneAndUpdate({ email: encryption.decrypt(request.body.email, public_key) }, {
          profile_picture: encryption.decrypt(request.body.profile_picture, public_key)
      }, {
        useFindAndModify: false
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
			const connection = database.connection(process.env.authentication_database)
      connection.query('UPDATE users SET picture = ? WHERE email = ?', [
        encryption.decrypt(request.body.picture, public_key),
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })

  application.post('/user/profile/update/user-settings', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
		  schema.findOneAndUpdate({ email: encryption.decrypt(request.body.check_email, public_key) }, {
        first_name: encryption.decrypt(request.body.first_name, public_key),
        last_name: encryption.decrypt(request.body.last_name, public_key),
        email: encryption.decrypt(request.body.email, public_key),
        password: encryption.hash(encryption.decrypt(request.body.password, public_key))
      }, {
        useFindAndModify: false
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
			const connection = database.connection(process.env.authentication_database)
      connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE email = ?', [
        encryption.decrypt(request.body.first_name, public_key),
        encryption.decrypt(request.body.last_name, public_key),
        encryption.decrypt(request.body.email, public_key),
        encryption.decrypt(request.body.password, public_key),
        encryption.decrypt(request.body.check_email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })

  application.post('/user/profile/update/contact-data', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
			schema.findOneAndUpdate({ email: encryption.decrypt(request.body.email, public_key) }, {
        address: encryption.decrypt(request.body.address, public_key),
        city: encryption.decrypt(request.body.city, public_key),
        country: encryption.decrypt(request.body.country, public_key)
      }, {
        useFindAndModify: false
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
			const connection = database.connection(process.env.authentication_database)
      connection.query('UPDATE users SET address = ?, city = ?, country = ? WHERE email = ?', [
        encryption.decrypt(request.body.address, public_key),
        encryption.decrypt(request.body.city, public_key),
        encryption.decrypt(request.body.country, public_key),
        encryption.decrypt(request.body.email, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })

  application.post('/user/profile/update/header-picture', (request, response) => {
		const public_key = request.body.public_key
		if (process.env.database_server === 'mongodb') {
			const connection = database.connection(process.env.authentication_database)
			const schema = model.header()
			schema.findOneAndUpdate({ email: encryption.decrypt(request.body.email, public_key) }, {
        header_picture: encryption.decrypt(request.body.header_picture, public_key)
      }, {
        useFindAndModify: false
      }, (error, database_response) => {
				if (error) {
					connection.close()
					response.json('500')
					logging.log('error', error)
				} else if (database_response) {
					connection.close()
					response.json(database_response)
				} else {
          connection.close()
          response.json('205')
        }
			})
		} else if (process.env.database_server === 'mysql') {
			const connection = database.connection(process.env.authentication_database)
      connection.query('UPDATE users SET header_picture = ? WHERE email = ?', [
        encryption.decrypt(request.body.email, public_key),
        encryption.decrypt(request.body.header_picture, public_key)
      ], (error, row) => {
        if (error) {
          connection.end()
          response.json('500')
          logging.log('error', error)
        } else if (row && row.length) {
          connection.end()
          response.json(row)
        } else {
          connection.end()
          response.json('205')
        }
      })
    }
  })
}
