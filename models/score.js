const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    team1: {
        type: String,
        required: true,
    },
    score1: {
        type: Number,
        required: true,
    },
    team2: {
        type: String,
        required: true,
    },
    score2: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Score', scoreSchema)