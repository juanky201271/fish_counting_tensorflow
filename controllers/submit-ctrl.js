const Submit = require('../models/submit-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createSubmit = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a submit', })
  }
  const submit = new Submit(body)
  if (!submit) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json submit', })
  }

  await submit
  .save()
  .then(() => {
    return res.status(201).json({
      success: true,
      _id: submit._id,
      message: 'Submit created!',
    })
  })
  .catch(err => {
    return res.status(400).json({ success: false, error: err, })
  })
}

updateSubmit = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a submit', })
  }
  await Submit
    .findOne({ _id: ObjectId(req.params._id) }, (err, submit) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!submit) {
        return res.status(404).json({ success: false, error: 'Submit not found', })
      }
      submit.file = body.file || submit.file
      submit.file_csv_result = body.file_csv_result || submit.file_csv_result
      submit.file_video_result = body.file_video_result || submit.file_video_result
      submit.file_images_zip_result = body.file_images_zip_result || submit.file_images_zip_result

      //await
      submit
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: submit._id,
            message: 'Submit updated!',
          })
        })
        .catch(err => {
          return res.status(400).json({ success: false, error: err, })
        })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

deleteSubmit = async (req, res) => {
  await Submit
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      return res.status(200).json({ success: true, })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getSubmit = async (req, res) => {
  await Submit
    .findOne({ _id: ObjectId(req.params._id) }, (err, submit) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!submit.length) {
        return res.status(404).json({ success: false, error: 'Submit not found', })
      }
      return res.status(200).json({ success: true, data: submit})
    })
    .catch(err => {
        return res.status(400).json({ success: false, error: err, })
    })
}

getSubmits = async (req, res) => {
  await Submit
    .find({}, (err, submits) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!submits.length) {
        return res.status(404).json({ success: false, error: 'Submits not found', })
      }
      return res.status(200).json({ success: true, data: submits})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,
}
