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
  cors(
    //{
    //origin: ["https://bva-jccc-fcc.herokuapp.com", "https://api.twitter.com", "http://localhost:3000", "http://localhost:8000"], // "http://localhost:3000",  // allow to server to accept request from different origin (React)
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //credentials: true // allow session cookie from browser to pass through
    //}
  )
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', submitRouter)
app.use('/api', uploadRouter)

const uploadFileDir = path.join(__dirname, "client/public/files_uploaded")

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFileDir)
  },
  filename: function (req, file, cb) {
    cb(null, 'File-' + Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })

app.post('/api/2uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  console.log(file)
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)

})

if (process.env.NODE_ENV = "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.use(function(req, res) {
  	res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
}

app.listen(PORT, () => console.log(`Server on Port ${PORT}`))
