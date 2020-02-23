

require('dotenv').config()

var port = process.env.PORT || 3000

const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const mongoose = require('mongoose')

const io = require('socket.io')(http)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

app.use("/public",express.static(__dirname + '/public'))
app.get('/update', function (req, res) {
    res.sendFile(path.join(__dirname + '/update.html'))
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

const playersRouter = require('./routes/players')
app.use('/players', playersRouter)

const tablesRouter = require('./routes/tables')
app.use('/tables', tablesRouter)

const scoresRouter = require('./routes/scores')
app.use('/scores', scoresRouter)

const matchesRouter = require('./routes/matches')
app.use('/matches', matchesRouter)

io.on('connection', async function(socket) {
    console.log("A user connected")

    //send scores to client
    const Score = require('./models/score')
    const scores = await Score.find()
    socket.emit('scores', scores)

    //send tables to client
    const Table = require('./models/table')
    const tables = await Table.find()
    socket.emit('tables', tables)

    socket.on('updateTable', table => {
        console.log('Incoming table...')
        socket.broadcast.emit('tableChange', table)
    })

    socket.on('updateScore', score => {
        console.log('Incoming score...')
        socket.broadcast.emit('scoreChange', score)
    })
    
    socket.on('updateMatch', match => {
        console.log('Incoming match...')
        socket.broadcast.emit('matchChange', match)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
        });
})

//app.listen(port, () => console.log('Server Started'))

http.listen(port, () => console.log("http listening"))