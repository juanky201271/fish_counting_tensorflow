const express = require('express')

const FindCtrl = require('../controllers/find-ctrl')

const findRouter = express.Router()

findRouter.post('/find', FindCtrl.createFind)
findRouter.put('/find/:_id', FindCtrl.updateFind)
findRouter.delete('/find/:_id', FindCtrl.deleteFind)
findRouter.get('/find/id/:_id', FindCtrl.getFindById)
findRouter.get('/finds/ip/:ip', FindCtrl.getFindsByIp)
findRouter.get('/finds/twitterId/:twitterId', FindCtrl.getFindsByTwitterId)
findRouter.get('/finds', FindCtrl.getFinds)

module.exports = findRouter
