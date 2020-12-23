const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Bars = new Schema({
  //key - _id
  find_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'nca-finds'
  },

  bars_business_id: {type: 'String'},
  name: {type: 'String'},
  image_url: {type: 'String'},
  url: {type: 'String'},
  display_address: {type: 'String'},
  display_phone: {type: 'String'},

  date: {type: 'Date'},
  assist: {type: 'Boolean'},

  ip: {type: 'String'},
  twitterId: {type: 'String', required: true},
})
module.exports = mongoose.model('nca-bars', Bars)
