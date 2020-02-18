require('dotenv').config()

process.env.PORT || 3000

const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

app.use("/public",express.static(__dirname + '/public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

const playersRouter = require('./routes/players')
app.use('/players', playersRouter)

const tablesRouter = require('./routes/tables')
app.use('/tables', tablesRouter)

app.listen(3000, () => console.log('Server Started'))