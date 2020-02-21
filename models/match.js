const mongoose = require('mongoose')

const matchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Match', matchSchema)