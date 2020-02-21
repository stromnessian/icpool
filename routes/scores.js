const express = require('express')
const router = express.Router()
const Score = require('../models/score')

// Getting all
router.get('/', async (req, res) => {
    try {
        const scores = await Score.find()
        res.json(scores)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})
// Getting one
router.get('/:id', getScore, (req, res) => {
    res.send(res.score)
})

// Creating one
router.post('/', async (req, res) => {
    const score = new Score({
        number: req.body.number,
        name: req.body.name,
        team1: req.body.team1,
        score1: req.body.score1,
        team2: req.body.team2,
        score2: req.body.score2
    })

    try {
        const newScore = await score.save()
        res.status(201).json(newScore)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Updating one
router.patch('/:id',getScore, async (req, res) => {
    if (req.body.number != null) {
        res.score.number = req.body.number
    }
    if (req.body.name != null) {
        res.score.name = req.body.name
    }
    if (req.body.team1 != null) {
        res.score.team1 = req.body.team1
    }
    if (req.body.score1 != null) {
        res.score.score1 = req.body.score1
    }
    if (req.body.team2 != null) {
        res.score.team2 = req.body.team2
    }
    if (req.body.score2 != null) {
        res.score.score2 = req.body.score2
    }
    try {
        const updatedScore = await res.score.save()
        res.json(updatedScore)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getScore, async (req, res) => {
    try {
        await res.score.remove()
        res.json({message: 'Score deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getScore(req, res, next) {
    try {
        score = await Score.findById(req.params.id)
        if (score == null) {
            return res.status(404).json({message: 'Cannot find score'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.score = score
    next()
}

module.exports = router