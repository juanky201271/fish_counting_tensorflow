const fs = require('fs')
const Multer = require('multer')
const path = require('path')
const AWS = require("aws-sdk")

//const uploadFileDir = path.join(__dirname, "../client/public/files_uploaded")

createUploadFile = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
}

const fileStorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/submits/" + req.headers.dir))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const uploadFile =  Multer({ storage : fileStorage })

//const uploadResultDir = path.join(__dirname, "../client/public/files_results")

createUploadResult = async (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a result')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
}

const resultStorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../client/public/submits/" + req.headers.dir))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadResult = Multer({ storage : resultStorage  })

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

createDir = async (req, res) => {
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

module.exports = {
  createUploadFile,
  uploadFile,
  createUploadResult,
  uploadResult,
  createDir,
}
