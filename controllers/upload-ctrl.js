const fs = require('fs')
const Multer = require('multer')
const path = require('path')

const uploadFileDir = path.join(__dirname, "../client/public/files_uploaded")

createUploadFile = async (req, res, next) => {
  const file = req.file
  console.log(file)
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
}

const fileStorage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFileDir)
  },
  filename: function (req, file, cb) {
    cb(null, "File" + '_' + Date.now() + '_' + file.originalname);
  }
})

const uploadFile =  Multer({ storage : fileStorage })

const uploadResultDir = path.join(__dirname, "../client/public/files_results")

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
    cb(null, uploadResultDir)
  },
  filename: function (req, file, cb) {
    cb(null, "Result" + '_' + Date.now() + '_' + file.originalname)
  }
})

const uploadResult = Multer({ storage : resultStorage  })

module.exports = {
  createUploadFile,
  uploadFile,
  createUploadResult,
  uploadResult,
}
