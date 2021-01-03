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

const submitRouter = require('./routes/submit-router')
const uploadRouter = require('./routes/upload-router')
const db = require('./db')

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

app.use(
  cors()
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', submitRouter)
app.use('/api', uploadRouter)

app.use("/files_csv_results", express.static(path.join(__dirname, "client/public/files_csv_results")))
app.use("/files_video_results", express.static(path.join(__dirname, "client/public/files_video_results")))
app.use("/files_uploaded", express.static(path.join(__dirname, "client/public/files_uploaded")))

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.use(function(req, res) {
  	res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
}

app.listen(PORT, () => console.log(`Server on Port ${PORT}`))
