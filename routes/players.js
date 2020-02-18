const express = require('express')
const router = express.Router()
const Player = require('../models/player')

// Getting all
router.get('/', async (req, res) => {
    try {
        const players = await Player.find()
        res.json(players)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})
// Getting one
router.get('/:id', getPlayer, (req, res) => {
    res.send(res.player)
})

// Creating one
router.post('/', async (req, res) => {
    const player = new Player({
        name: req.body.name,
        county: req.body.county
    })

    try {
        const newPlayer = await player.save()
        res.status(201).json(newPlayer)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Updating one
router.patch('/:id',getPlayer, async (req, res) => {
    if (req.body.name != null) {
        res.player.name = req.body.name
    }
    if (req.body.county != null) {
        res.player.county = req.body.county
    }
    try {
        const updatedPlayer = await res.player.save()
        res.json(updatedPlayer)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getPlayer, async (req, res) => {
    try {
        await res.player.remove()
        res.json({message: 'Player deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getPlayer(req, res, next) {
    try {
        player = await Player.findById(req.params.id)
        if (player == null) {
            return res.status(404).json({message: 'Cannot find player'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.player = player
    next()
}

module.exports = router