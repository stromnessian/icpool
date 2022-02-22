const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    county: {
        type: String,
        enum: ['Orkney', 'Shetland'],
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Player', playerSchema)