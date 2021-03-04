const express = require('express')

const SubmitCtrl = require('../controllers/submit-ctrl')

const submitRouter = express.Router()

submitRouter.post('/submit', SubmitCtrl.createSubmit)
submitRouter.put('/submit/:_id', SubmitCtrl.updateSubmit)
submitRouter.delete('/submit/:_id', SubmitCtrl.deleteSubmit)
submitRouter.get('/submit/id/:_id', SubmitCtrl.getSubmit)
submitRouter.get('/submits', SubmitCtrl.getSubmits)

submitRouter.get('/modelslocaly', SubmitCtrl.getModelsLocaly)
submitRouter.get('/modelsawss3', SubmitCtrl.getModelsAwsS3)

module.exports = submitRouter
