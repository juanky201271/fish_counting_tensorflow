const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Finds = new Schema({
  //key - _id
  locale: {type: 'String'},
  location: {type: 'String', required: true},
  categories: {type: 'String', required: true},
  json: {type: 'String', required: true},

  finds_business_id: [{
    type: 'String',
    ref: 'nca-bars'
  }],
  
  date: {type: 'Date'},

  ip: {type: 'String', required: true},
  twitterId: {type: 'String'},
})
module.exports = mongoose.model('nca-finds', Finds)
