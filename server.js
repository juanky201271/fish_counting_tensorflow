require("dotenv").config()
const cookieSession = require("cookie-session")
const path = require("path")
const express = require("express")
const multer = require('multer')
const app = express()
const PORT = process.env.PORT || 8000 // express
//const passport = require("passport")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

const submitRouter = require('./routes/submit-router')
const uploadRouter = require('./routes/upload-router')
const db = require('./db')
const AWS = require("aws-sdk")

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
})

console.log("Region: ", AWS.config.region)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 30 * 24 * 60 * 60 * 10000
  })
)

app.use(cookieParser())
//app.use(passport.initialize())
//app.use(passport.session())

app.use(expressCspHeader({
    policies: {
        'default-src': [NONE],
        'img-src': [SELF],
    }
}))

app.use(
  cors()
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', submitRouter)
app.use('/api', uploadRouter)



if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
  app.use(express.static(path.join(__dirname, "client/public")))

  app.use(function(req, res) {
  	res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
}

app.listen(PORT, () => console.log(`Server on Port ${PORT}`))
