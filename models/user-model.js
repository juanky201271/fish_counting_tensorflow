const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UsersIp = new Schema({
  //key - ip
  ip: { type: 'String', unique: true },
})
module.exports = mongoose.model('nca-users-ips', UsersIp)
