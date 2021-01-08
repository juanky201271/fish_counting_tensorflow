const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Submits = new Schema({
  //key - _id
  file: {type: 'String', required: true},
  file_csv_result: {type: 'String', required: true},
  file_video_result: {type: 'String', required: true},
  file_images_zip_result: {type: 'String', required: true},
})
module.exports = mongoose.model('fish-counting-submits', Submits)
