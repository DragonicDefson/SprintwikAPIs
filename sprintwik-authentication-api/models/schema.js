const mongoose = require('mongoose')

module.exports = {
  schema : () => {
    let model
    try { model = mongoose.model('user') } catch (error) {
      model = mongoose.model('user', new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: String,
        password: String,
        profile_picture: String,
        header_picture: String,
        role: String,
        address: String,
        city: String,
        country: String
      }))
    }
    return model
  }
}
