const jwt = require("jsonwebtoken");

const clearToken = (token) => {
    if (/\s/g.test(token)) {
        return token.split(' ')[1];
    }
    return null;
};

const middleWareFunc = async (req, res, next) => {
    const token = clearToken(req.headers.authorization);

    if(token) {
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            req.tokenData = decoded;
            return next();
        } catch (e) {
            return res.sendStatus(403);
        }
    }

    return next();
}
module.exports = middleWareFunc;

