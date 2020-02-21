const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: false
    },
    player1Name: {
        type: String,
        required: false
    },
    player1Score: {
        type: Number,
        required: false
    },
    player2Name: {
        type: String,
        required: false
    },
    player2Score: {
        type: Number,
        required: false
    }    
})

module.exports = mongoose.model('Table', tableSchema)