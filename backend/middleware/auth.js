const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
    let token;
    const isLineRequest = req.headers["x-line-request"] === "true";
    console.log(req.headers);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    )
        token = req.headers.authorization.split(" ")[1];

    if (!token && !isLineRequest)
        return res.status(401).json({ success: false, msg: "1" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next(); // call next middleware or route handler
    } catch (err) {
        console.log(err.stack);
        res.status(401).json({ success: false, msg: "2" });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return res.status(403).json({
                success: false,
                msg: `User role ${req.user.role} is not authorize to access this route`,
            });
        next();
    };
};
