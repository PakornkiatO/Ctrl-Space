const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({success: true})
})

router.get('/:id', (req, res) => {
    res.status(200).json({success: true, data:{id: req.params.id}})
})

router.post('/', (req, res) => {
    res.status(200).json({success: true})
})

router.delete('/:id', (req, res) => {
    res.status(200).json({success: true, data:{id: req.params.id}})
})

router.put('/:id', (req, res) => {
    res.status(200).json({success: true, data:{id: req.params.id}})
})
module.exports = router;