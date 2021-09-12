const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require("./routes/posts")

const app = express()

mongoose.connect("mongodb+srv://jacob:856fHxIFOTO4g1bs@cluster0.0bogm.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{
    console.log('connected to database!')
  })
  .catch(() => {
    console.log('connection failed!')
  })

app.use(bodyParser.json())      // used for all incoming requests

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-WIth, Content-Type, Accept") // Headers can only have these, i think.
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT")
  next()
})

app.use("/api/posts", postsRoutes)



// 856fHxIFOTO4g1bs

module.exports = app
