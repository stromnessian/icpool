const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    team1: {
        type: String,
        required: false,
    },
    score1: {
        type: Number,
        required: false,
    },
    team2: {
        type: String,
        required: false,
    },
    score2: {
        type: Number,
        required: false,
    }
})

module.exports = mongoose.model('Score', scoreSchema)