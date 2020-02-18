const express = require('express')
const router = express.Router()
const Table = require('../models/table')

// Getting all
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find()
        res.json(tables)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})
// Getting one
router.get('/:id', getTable, (req, res) => {
    res.send(res.table)
})

// Creating one
router.post('/', async (req, res) => {
    const table = new Table({
        tableNumber: req.body.tableNumber,
        player1Name: req.body.player1Name,
        player1Score: req.body.player1Score,
        player2Name: req.body.player2Name,
        player2Score: req.body.player2Score
    })

    try {
        const newTable = await table.save()
        res.status(201).json(newTable)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Updating one
router.patch('/:id',getTable, async (req, res) => {
    if (req.body.tableNumber != null) {
        res.table.tableNumber = req.body.tableNumber
    }
    if (req.body.player1Name != null) {
        res.table.player1Name = req.body.player1Name
    }
    if (req.body.player1Score != null) {
        res.table.player1Score = req.body.player1Score
    }
    if (req.body.player2Name != null) {
        res.table.player2Name = req.body.player2Name
    }
    if (req.body.player2Score != null) {
        res.table.player2Score = req.body.player2Score
    }
    try {
        const updatedTable = await res.table.save()
        res.json(updatedTable)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/:id', getTable, async (req, res) => {
    try {
        await res.table.remove()
        res.json({message: 'Table deleted'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function getTable(req, res, next) {
    try {
        table = await Table.findById(req.params.id)
        if (table == null) {
            return res.status(404).json({message: 'Cannot find table'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.table = table
    next()
}

module.exports = router