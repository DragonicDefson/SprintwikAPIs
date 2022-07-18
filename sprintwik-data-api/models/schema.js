const mongoose = require('mongoose')

module.exports = {
  post : () => {
    let model
    try { model = mongoose.model('post') } catch (error) {
      model = mongoose.model('post', new mongoose.Schema({
        email: String,
        date: String,
        text: String,
        picture: String,
        upid: String
      }))
    }
    return model
  },

  header : () => {
    let model
    try { model = mongoose.model('user') } catch (error) {
      model = mongoose.model('user', new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: String,
        password: String,
        profile_picture: String,
        header_picture: String,
        address: String,
        city: String,
        country: String
      }))
    }
    return model
  }
}
