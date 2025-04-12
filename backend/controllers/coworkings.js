const Coworking = require('../models/Coworking')

exports.getCoworkings = async (req, res) => {
    // res.status(200).json({success: true, msg: `Show all Co-Working spaces`});
    try {
        const coworkings = await Coworking.find();

        res.status(200).json({success: true, data: coworkings});
    } catch (error) {
        res.status(400).json({success: false, msg: error});
    }
}

exports.getCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Show Co-Working space ID:${req.params.id}`});
}

exports.createCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Creat new Co-Working spaces`});
}

exports.updateCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Update Co-Working space ID:${req.params.id}`});
}

exports.deleteCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Delete Co-Working space ID:${req.params.id}`});
}