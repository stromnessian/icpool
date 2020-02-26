const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    player1Name: {
        type: String,
        required: true
    },
    player1Score: {
        type: Number,
        required: true
    },
    player2Name: {
        type: String,
        required: true
    },
    player2Score: {
        type: Number,
        required: true
    }    
})

module.exports = mongoose.model('Table', tableSchema)