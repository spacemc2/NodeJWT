const jwt = require('jsonwebtoken');

const tokenSecret = process.env.TOKEN_SECRET;

const verifyToken = (req, res, next) => {

    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).json({
            error: 'Access Denied'
        })
    }

   
    try {
        const verif = jwt.verify(token, tokenSecret)
        req.user = verif
        next()
    } catch (error) {

        res.status(400).json({
            error:'Invalid Token'
        })
    }

}


module.exports = verifyToken;