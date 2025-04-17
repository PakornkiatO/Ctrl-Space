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

        // const token = user.getSignedJwtToken();

        // res.status(200).json({success: true, data: user, token: token});
        sendTokenResponse(user, 200, res);
    }
    catch(err){
        res.status(400).json({success: false});
        console.log(err);
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) return res.status(400).json({success: false, msg: 'Please provide an email and password'});

    const user = await User.findOne({email}).select('+password');

    if(!user) return res.status(400).json({success: false, msg: 'Invalid credentials'});

    const isMatch = user.matchPassword(password);

    if(!isMatch) return res.status(401).json({success: false, msg: 'Invalid credentials'});

    // const token = user.getSignedJwtToken();

    // res.status(200).json({success: true, token: token});
    sendTokenResponse(user, 200, res);
}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') options.secure = true;

    res.status(statusCode).cookie('token', token, options).json({success: true, token: token});
}