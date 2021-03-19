const fs = require('fs')
const Multer = require('multer')
const path = require('path')
const AwsS3 = require("aws-sdk/clients/s3")
const s3 = new AwsS3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

//const uploadFileDir = path.join(__dirname, "../client/public/files_uploaded")

createUploadFileLocaly = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
}

const uploadFile = async params => {
  return new Promise ((resolve, reject) => {
    const s3params = {
      Bucket: params.bucket,
      Key: params.file,
      Body: params.buffer,
      ContentType: params.contenttype,
      ACL: params.acl,
    }
    s3.upload (s3params, (err, data) => {
      if (err) {
        reject (err)
      }
      resolve (data)
    })
  })
}

createUploadFileAwsS3 = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  const dir = req.headers.dir === '' ? '' : req.headers.dir + '/'
  await uploadFile({ bucket: 'aipeces', file: 'submits/' + dir + file.originalname, buffer: file.buffer, contenttype: file.mimetype, acl: 'public-read' })
    .then(data => {
      res.send(file)
    })
    .catch(err => {
      console.log('upload file error - ', err)
    })
}

const fileStorageLocaly = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/submits/" + req.headers.dir))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const fileStorageAwsS3 = Multer.memoryStorage()

const uploadFileLocaly =  Multer({ storage : fileStorageLocaly })

const uploadFileAwsS3 =  Multer({ storage : fileStorageAwsS3 })

//const uploadResultDir = path.join(__dirname, "../client/public/files_results")

createUploadResultLocaly = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a result')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
}

createUploadResultAwsS3 = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a result')
    error.httpStatusCode = 400
    return next(error)
  }
  await uploadFile({ bucket: 'aipeces', file: 'submits/' + req.headers.dir + '/' + file.originalname, buffer: file.buffer, contenttype: file.mimetype, acl: 'public-read' })
    .then(data => {
      res.send(file)
    })
    .catch(err => {
      console.log('upload result error - ', err)
    })
}

const resultStorageLocaly = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/submits/" + req.headers.dir))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const resultStorageAwsS3 = Multer.memoryStorage()

const uploadResultLocaly = Multer({ storage : resultStorageLocaly  })

const uploadResultAwsS3 = Multer({ storage : resultStorageAwsS3  })

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

createDirLocaly = async (req, res) => {
  const modelsDir = path.join(__dirname, "../api_flask/models")
  const parentDir = path.join(__dirname, "../client/public/submits")
  const dir = path.join(__dirname, "../client/public/submits", req.body.dir)
  ensureExists(modelsDir, 0744, function(err) {
    if (err) // handle folder creation error
      console.log('models dir error: ', err)
    //else { // we're all good
    //  console.log(parentDir, ' created!')
    //}
  })
  ensureExists(parentDir, 0744, function(err) {
    if (err) // handle folder creation error
      console.log('parent dir error: ', err)
    //else { // we're all good
    //  console.log(parentDir, ' created!')
    //}
  })
  ensureExists(dir, 0744, function(err) {
    if (err) { // handle folder creation error
      console.log('dir error: ', err)
      return res.status(400).json({ success: false, error: err, })
    }
    else { // we're all good
      //console.log(dir, ' created!')
      return res.status(201).json({
        success: true,
        dir: dir,
        message: 'Directory created!',
      })
    }
  })
}

const createDir = async params => {
  return new Promise ((resolve, reject) => {
    const s3params = {
      Bucket: params.bucket,
      Key: params.dir,
    }
    s3.putObject (s3params, (err, data) => {
      if (err) {
        reject (err)
      }
      resolve (data)
    })
  })
}

createDirAwsS3 = async (req, res) => {
  const dir = "submits/" + req.body.dir
  await createDir({ bucket: 'aipeces', dir: dir })
    .then(data => {
      return res.status(201).json({
        success: true,
        dir: dir,
        message: 'Aws S3 Directory created!',
      })
    })
    .catch(err => {
      console.log('create dir error - ', err)
      return res.status(400).json({ success: false, error: err, })
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

fileExitsAwsS3 = async (req, res) => {
  await objectExits({ bucket: req.body.bucket, file: req.body.file })
    .then(data => {
      return res.status(201).json({
        success: true,
        message: 'Aws S3 File exists!',
      })
    })
    .catch(err => {
      if (err && err.code !== 'NotFound') {
        console.log('object exits error - ', err)
        return res.status(400).json({ success: null, error: err, })
      } else {
        return res.status(201).json({
          success: false,
          message: 'Aws S3 File does not exists!',
        })
      }
    })
}

const listObjectFilter  = async params => {
  return new Promise ((resolve, reject) => {
    const s3params = {
      Bucket: params.bucket,
      MaxKeys: 10,
      Delimiter: '/',
      Prefix: params.filter,
    }
    s3.listObjectsV2 (s3params, (err, data) => {
      if (err) {
        reject (err)
      }
      resolve (data)
    })
  })
}

fileExitsFilterAwsS3 = async (req, res) => {
  await listObjectFilter({ bucket: req.body.bucket, filter: req.body.filter })
    .then(data => {
      const objs = data.CommonPrefixes
      let resultFileCalibration = ''
      let total_fishCalibration = ''
      let width_pxs_x_cm = ''
      if (objs.length > 0) {
        for (i = 0; i < objs.length; i++) {
          const obj = objs[i]
          console.log(obj)
          resultFileCalibration = obj.Prefix
          total_fishCalibration = obj.Prefix.replace(req.body.filter + '__', '').split('__')[0] || ''
          width_pxs_x_cm = obj.Prefix.replace(req.body.filter + '__', '').split('__')[1] || ''
          if (resultFileCalibration && total_fishCalibration && width_pxs_x_cm) {
            break
          } else {
            resultFileCalibration = ''
            total_fishCalibration = ''
            width_pxs_x_cm = ''
          }
        }
      }

      if (resultFileCalibration && total_fishCalibration && width_pxs_x_cm) {
        return res.status(201).json({
          success: true,
          resultFileCalibration,
          total_fishCalibration,
          width_pxs_x_cm,
          message: 'Aws S3 File exists!',
        })
      } else {
        return res.status(400).json({ success: false, error: 'Object doen not found!', })
      }
    })
    .catch(err => {
      console.log('object exits error - ', err)
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createUploadFileLocaly,
  createUploadFileAwsS3,
  uploadFileLocaly,
  uploadFileAwsS3,
  createUploadResultLocaly,
  createUploadResultAwsS3,
  uploadResultLocaly,
  uploadResultAwsS3,
  createDirLocaly,
  createDirAwsS3,
  fileExitsAwsS3,
  fileExitsFilterAwsS3,
}
