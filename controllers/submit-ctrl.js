const Submit = require('../models/submit-model')
const fs = require('fs')
const path = require('path')
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
      submit.type = body.type || submit.type
      submit.file_csv_result = body.file_csv_result || submit.file_csv_result
      submit.file_video_result = body.file_video_result || submit.file_video_result
      submit.file_image_result = body.file_image_result || submit.file_image_result
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

const  ensureExists = (path, mask, cb) => {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask
        mask = 0777
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null) // ignore the error if the folder already exists
            else cb(err) // something else went wrong
        } else cb(null) // successfully created folder
    })
}

getModels = async (req, res) => {
  const modelsDir = path.join(__dirname, "../api_flask/models")
  ensureExists(modelsDir, 0744, function(err) {
    if (err) // handle folder creation error
      console.log('models dir error: ', err)
    //else { // we're all good
    //  console.log(parentDir, ' created!')
    //}
  })

  let models = []
  try {
    const modelsPath = './api_flask/models/'
    const dirs = fs.readdirSync(modelsPath)
    dirs.forEach((dir, i) => {
      const saved_model_root_path = modelsPath + dir + '/saved_model.pb'
      const saved_model_dir_path = modelsPath + dir + '/saved_model/saved_model.pb'
      const frozen_inference_graph_path = modelsPath + dir + '/frozen_inference_graph.pb'
      //const ckpt_root_path = modelsPath + dir + '/model.ckpt.data-00000-of-00001'
      const ckpt_dir_path = modelsPath + dir + '/checkpoint/ckpt-0.data-00000-of-00001'
      const pipeline_config_path = modelsPath + dir + '/pipeline.config'
      const label_map_path = modelsPath + dir + '/label_map.pbtxt'
      models.push({
        model: dir,
        saved_model_root: fs.existsSync(saved_model_root_path) && fs.existsSync(label_map_path),
        saved_model_dir: fs.existsSync(saved_model_dir_path) && fs.existsSync(label_map_path),
        frozen_inference_graph: fs.existsSync(frozen_inference_graph_path) && fs.existsSync(label_map_path),
        //ckpt_root: fs.existsSync(ckpt_root_path) && fs.existsSync(pipeline_config_path) && fs.existsSync(label_map_path),
        ckpt_dir: fs.existsSync(ckpt_dir_path) && fs.existsSync(pipeline_config_path) && fs.existsSync(label_map_path),
      })
    })
  } catch (e) {
    console.log('readdirSync - ', e)
  }

  if (models.length === 0)
    return res.status(404).json({ success: false, error: 'Models not found' })
  else
    return res.status(200).json({ success: true, data: models })

}

module.exports = {
  createSubmit,
  updateSubmit,
  deleteSubmit,
  getSubmit,
  getSubmits,

  getModels,
}
