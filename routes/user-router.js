const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')

const userRouter = express.Router()

userRouter.post('/user', UserCtrl.createUser)
userRouter.delete('/user/id/:_id', UserCtrl.deleteUserById)
userRouter.delete('/user/ip/:ip', UserCtrl.deleteUserByIp)
userRouter.get('/user/id/:_id', UserCtrl.getUserById)
userRouter.get('/user/ip/:ip', UserCtrl.getUserByIp)
userRouter.get('/users', UserCtrl.getUsers)

userRouter.get('/usertwitter/id/:twitterId', UserCtrl.getUserByTwitterId)
userRouter.get('/userstwitter', UserCtrl.getUsersTwitter)

module.exports = userRouter
