exports.getCoworkings = (req, res) => {
    res.status(200).json({success: true, msg: `Show all Co-Working spaces`});
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