const Coworking = require('../models/Coworking')
const Reservation = require('../models/Reservation')

exports.getCoworkings = async (req, res) => {
    // res.status(200).json({success: true, msg: `Show all Co-Working spaces`});
    try {
        // const coworkings = await Coworking.find(req.query);
    
        let query;

        const reqQuery = {...req.query};
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(params => delete reqQuery[params]);

        let queryStr = JSON.stringify(req.query);
        queryStr = queryStr.replace(/\b(gt| gte| lt| lte| in)\b/g, match => `$${match}`);

        query = Coworking.find(JSON.parse(queryStr)).populate('reservations');

        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } 
        else query = query.sort('-createdAt');

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Coworking.countDocuments();

        query = query.skip(startIndex).limit(limit)

        const coworking = await query;

        const pagination = {};

        if(endIndex < total) pagination.next = {page: page+1, limit};

        if(startIndex > 0) pagination.prev = {page: page-1, limit};

        res.status(200).json({success: true, count: coworking.length, pagination, data: coworking});
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

exports.deleteCoworking = async (req, res, next) => {
    try {
        const coworking = await Coworking.findById(req.params.id);

        if(!coworking) return res.status(404).json({success: false, msg: `Co-working not found with id of ${req.params.id}`});

        await Reservation.deleteMany({coworking: req.params.id});
        await Coworking.deleteOne({_id: req.params.id});

        res.status(200).json({success: true});
    } catch (error) {
        res.status(400).json({success: false, msg: `${err}`});
    }
}