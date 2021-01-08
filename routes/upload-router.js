const express = require('express')

const UploadCtrl = require('../controllers/upload-ctrl')

const uploadRouter = express.Router()

uploadRouter.post('/uploadfile', UploadCtrl.uploadFile.single('myFile'), UploadCtrl.createUploadFile)
uploadRouter.post('/uploadresult', UploadCtrl.uploadResult.single('myResult'), UploadCtrl.createUploadResult)
uploadRouter.post('/createDir', UploadCtrl.createDir)

module.exports = uploadRouter
