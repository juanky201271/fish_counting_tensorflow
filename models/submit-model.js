const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Submits = new Schema({
  //key - _id
  ip: {type: 'String', required: true},
  ip_city: {type: 'String', required: false},
  ip_country: {type: 'String', required: false},
  file: {type: 'String', required: true},
  type: {type: 'String', required: true},
  file_csv_result: {type: 'String', required: true},
  file_video_result: {type: 'String', required: false},
  file_image_result: {type: 'String', required: false},
  file_images_zip_result: {type: 'String', required: true},
})
module.exports = mongoose.model('fish-counting-submits', Submits)
