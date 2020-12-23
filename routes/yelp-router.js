const express = require('express')

const YelpCtrl = require('../controllers/yelp-ctrl')

const yelpRouter = express.Router()

yelpRouter.get('/yelp/search/:categories/:location/:locale', YelpCtrl.getYelpSearch)

module.exports = yelpRouter
