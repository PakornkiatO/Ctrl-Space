const Coworking = require('../models/Coworking')

exports.getCoworkings = async (req, res) => {
    // res.status(200).json({success: true, msg: `Show all Co-Working spaces`});
    try {
        // const coworkings = await Coworking.find(req.query);
    
        let query;

        const reqQuery = {...req.query};
        const removeFields = ['select', 'sort'];
        removeFields.forEach(params => delete reqQuery[params]);

        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt| gte| lt| lte| in)\b/g, match => `$${match}`);

        query = Coworking.find(JSON.parse(queryStr));

        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } 
        else query = query.sort('-createedAt');

        const coworking = await query;

        res.status(200).json({success: true, data: coworking});
    } catch (error) {
        res.status(400).json({success: false, msg: error});
    }
}

exports.getCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Show Co-Working space ID:${req.params.id}`});
}

exports.createCoworking = async (req, res) => {
    // res.status(200).json({success: true, msg: `Creat new Co-Working spaces`});
    const coworking = await Coworking.create(req.body);

    res.status(200).json({success: true, data: coworking});
}

exports.updateCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Update Co-Working space ID:${req.params.id}`});
}

exports.deleteCoworking = (req, res) => {
    res.status(200).json({success: true, msg: `Delete Co-Working space ID:${req.params.id}`});
}