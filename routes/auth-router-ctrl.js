const Find = require('../models/find-model')
const mongoose = require('mongoose')

const router = require("express").Router()
const passport = require("passport")
const path = require("path")
const CLIENT_HOME_PAGE_URL = process.env.PUBLIC_URL

// when login is successful, retrieve user info
router.get("/auth/login/success", async (req, res) => {
  var ipAddr = req.headers["x-forwarded-for"]
  if (ipAddr){
    var list = ipAddr.split(",")
    ipAddr = list[list.length-1]
  } else {
    ipAddr = req.connection.remoteAddress
  }
  var locale = req.headers["accept-language"].split(";")[0].split(",")[0].replace("-", "_")
  if (req.user) {
    // autenticado
    await Find
      .findOne({ twitterId: req.user.twitterId }, null, {sort: {date: -1}}, async (err, find) => {
        if (err) {
          return res.status(400).json({ success: false, error: err, })
        }
        if (!find) {
          await Find
            .findOne({ ip: ipAddr }, null, {sort: {date: -1}}, (err, find2) => {
              if (err) {
                return res.status(400).json({ success: false, error: err, })
              }
              if (!find2) {
                return res.json({
                  success: true,
                  message: "user has successfully authenticated",
                  user: req.user,
                  cookies: req.cookies,
                  ip: ipAddr,
                  locale: locale,
                  last_find_id: '',
                  json: '',
                  location: '',
                })
              } else {
                return res.json({
                  success: true,
                  message: "user has successfully authenticated",
                  user: req.user,
                  cookies: req.cookies,
                  ip: ipAddr,
                  locale: locale,
                  last_find_id: find2._id || '',
                  json: JSON.parse(find2.json) || '',
                  location: find2.location || '',
                })
              }
            })
            .catch(err => {
              return res.status(400).json({ success: false, error: err, })
            })
        } else {
          return res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies,
            ip: ipAddr,
            locale: locale,
            last_find_id: find._id || '',
            json: JSON.parse(find.json) || '',
            location: find.location || '',
          })
        }
      })
      .catch(err => {
        return res.status(400).json({ success: false, error: err, })
      })

  } else {
    // NO autenticado
    await Find
      .findOne({ ip: ipAddr }, null, {sort: {date: -1}}, (err, find) => {
        if (err) {
          return res.status(400).json({ success: false, error: err, })
        }
        if (!find) {
          return res.json({
            success: false,
            message: "user hasn't authenticated",
            ip: ipAddr,
            locale: locale,
            last_find_id: '',
            json: '',
            location: '',
          })
        } else {
          return res.json({
            success: false,
            message: "user hasn't authenticated",
            ip: ipAddr,
            locale: locale,
            last_find_id: find._id || '',
            json: JSON.parse(find.json) || '',
            location: find.location || '',
          })
        }
      })
      .catch(err => {
        return res.status(400).json({ success: false, error: err, })
      })

  }
})

// when login failed, send failed msg
router.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  })
})

// When logout, redirect to client
router.get("/auth/logout", (req, res) => {
  req.logout()
  res.redirect(CLIENT_HOME_PAGE_URL)
})

// auth with twitter
router.get("/auth/twitter", passport.authenticate("twitter"))

// redirect to home page after successfully login via twitter
router.get("/auth/twitter/redirect",
  passport.authenticate("twitter", { failureRedirect: "/auth/login/failed" }),
  function(req, res) { res.redirect(CLIENT_HOME_PAGE_URL) })

module.exports = router
