const User = require('../models/User');

exports.register = async (req, res, next) => {
    try{
        const {name, email, tel, password, role} = req.body;

        const user = await User.create({
            name,
            email,
            tel,
            password,
            role
        });

        const token = user.getSignedJwtToken();

        res.status(200).json({success: true, data: user, token: token});
    }
    catch(err){
        res.status(400).json({success: false});
        console.log(err);
    }
}