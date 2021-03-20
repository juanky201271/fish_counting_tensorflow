const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl')

const uploadRouter = express.Router()

uploadRouter.post('/uploadfilelocaly', UploadCtrl.uploadFileLocaly.single('myFile'), UploadCtrl.createUploadFileLocaly)
uploadRouter.post('/uploadfileawss3', UploadCtrl.uploadFileAwsS3.single('myFile'), UploadCtrl.createUploadFileAwsS3)
uploadRouter.post('/uploadresultlocaly', UploadCtrl.uploadResultLocaly.single('myResult'), UploadCtrl.createUploadResultLocaly)
uploadRouter.post('/uploadresultawss3', UploadCtrl.uploadResultAwsS3.single('myResult'), UploadCtrl.createUploadResultAwsS3)
uploadRouter.post('/createdirlocaly', UploadCtrl.createDirLocaly)
uploadRouter.post('/createdirawss3', UploadCtrl.createDirAwsS3)
uploadRouter.post('/fileexitsawss3', UploadCtrl.fileExitsAwsS3)
uploadRouter.post('/fileexitsfilterawss3', UploadCtrl.fileExitsFilterAwsS3)
uploadRouter.post('/logging', UploadCtrl.logging)

module.exports = uploadRouter
