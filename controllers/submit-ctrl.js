// juanky201271 - AIPeces - 2021

const Submit = require('../models/submit-model')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const AwsS3 = require("aws-sdk/clients/s3")
const s3 = new AwsS3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

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

  var ipAddr = req.headers["x-forwarded-for"]
  if (ipAddr){
    var list = ipAddr.split(",")
    ipAddr = list[list.length-1]
  } else {
    ipAddr = req.connection.remoteAddress
  }

  submit.ip = ipAddr || '...'
  submit.ip_city = req.ipInfo.city || ''
  submit.ip_country = req.ipInfo.country || ''
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

getModelsLocaly = async (req, res) => {
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

const listDirectories  = async params => {
  return new Promise ((resolve, reject) => {
    const s3params = {
      Bucket: params.bucket,
      MaxKeys: 10,
      Delimiter: '/',
      Prefix: params.subdir + '/',
    }
    s3.listObjectsV2 (s3params, (err, data) => {
      if (err) {
        reject (err)
      }
      resolve (data)
    })
  })
}

const objectExits = async params => {
  return new Promise ((resolve, reject) => {
    const s3params = {
      Bucket: params.bucket,
      Key: params.file,
    }
    s3.headObject (s3params, (err, data) => {
      if (err) {
        reject (err)
      }
      resolve (data)
    })
  })
}

getModelsAwsS3 = async (req, res) => {
  let models = []
  let dirs = []
  await listDirectories({ bucket: 'aipeces', subdir: 'models' })
    .then(data => {
      dirs = data.CommonPrefixes
    })
    .catch(err => console.log('bucket models list error - ', err))

  if (dirs.length > 0) {
    for (i = 0; i < dirs.length; i++) {
      const dir = dirs[i]
      let saved_model_root_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'saved_model.pb' })
        .then(data => {
          saved_model_root_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      let saved_model_dir_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'saved_model/saved_model.pb' })
        .then(data => {
          saved_model_dir_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      let frozen_inference_graph_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'frozen_inference_graph.pb' })
        .then(data => {
          frozen_inference_graph_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      /*
      let ckpt_root_path = false
      objectExits({ bucket: 'aipeces', file: dir.Prefix + 'model.ckpt.data-00000-of-00001' })
        .then(data => {
          ckpt_root_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      */
      let ckpt_dir_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'checkpoint/ckpt-0.data-00000-of-00001' })
        .then(data => {
          ckpt_dir_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      let pipeline_config_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'pipeline.config' })
        .then(data => {
          pipeline_config_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      let label_map_path = false
      await objectExits({ bucket: 'aipeces', file: dir.Prefix + 'label_map.pbtxt' })
        .then(data => {
          label_map_path = true
        })
        .catch(err => {
          if (err && err.code !== 'NotFound') {
            console.log('object exits error - ', err)
          }
        })
      models.push({
        model: dir.Prefix.split('/')[1],
        saved_model_root: saved_model_root_path && label_map_path,
        saved_model_dir: saved_model_dir_path && label_map_path,
        frozen_inference_graph: frozen_inference_graph_path && label_map_path,
        //ckpt_root: ckpt_root_path && pipeline_config_path && label_map_path,
        ckpt_dir: ckpt_dir_path && pipeline_config_path && label_map_path,
      })
    }
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

  getModelsLocaly,
  getModelsAwsS3,
}
