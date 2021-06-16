// juanky201271 - AIPeces - 2021

const express = require('express')
const uploadRouter = express.Router()

module.exports = function(io) {
  const UploadCtrl = require('../controllers/upload-ctrl')(io)

  uploadRouter.post('/uploadfilelocaly', UploadCtrl.uploadFileLocaly.single('myFile'), UploadCtrl.createUploadFileLocaly)
  uploadRouter.post('/uploadfileawss3', UploadCtrl.uploadFileAwsS3.single('myFile'), UploadCtrl.createUploadFileAwsS3)
  uploadRouter.post('/uploadresultlocaly', UploadCtrl.uploadResultLocaly.single('myResult'), UploadCtrl.createUploadResultLocaly)
  uploadRouter.post('/uploadresultawss3', UploadCtrl.uploadResultAwsS3.single('myResult'), UploadCtrl.createUploadResultAwsS3)
  uploadRouter.post('/createdirlocaly', UploadCtrl.createDirLocaly)
  uploadRouter.post('/createdirawss3', UploadCtrl.createDirAwsS3)
  uploadRouter.post('/fileexitsawss3', UploadCtrl.fileExitsAwsS3)
  uploadRouter.post('/fileexitsfilterawss3', UploadCtrl.fileExitsFilterAwsS3)
  uploadRouter.post('/logging', UploadCtrl.logging)
  uploadRouter.post('/queueing', UploadCtrl.queueing)

  return uploadRouter
}
