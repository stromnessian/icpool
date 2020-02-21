const express = require('express')
const router = express.Router()
const Match = require('../models/match')

// Getting all
router.get('/', async (req, res) => {
    try {
        const matchs = await Match.find()
        res.json(matchs)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})
// Getting one
router.get('/:id', getMatch, (req, res) => {
    res.send(res.match)
})

// Creating one
router.post('/', async (req, res) => {
    const match = new Match({
        name: req.body.name
    })
    try {
        const newMatch = await match.save()
        res.status(201).json(newMatch)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Updating one
router.patch('/:id',getMatch, async (req, res) => {
    if (req.body.name != null) {
        res.match.name = req.body.name
    }
    try {
        const updatedMatch = await res.match.save()
        res.json(updatedMatch)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getMatch, async (req, res) => {
    try {
        await res.match.remove()
        res.json({message: 'Match deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getMatch(req, res, next) {
    try {
        match = await Match.findById(req.params.id)
        if (match == null) {
            return res.status(404).json({message: 'Cannot find match'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.match = match
    next()
}

module.exports = router