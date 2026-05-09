const jwt = require("jsonwebtoken")

const auth = (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({ message : "No token" })
        }

        req.user = jwt.verify(token, process.env.JWT_SECRET)
        return next()
    } catch (error) {
        return res.status(500).json({ message : error.message })
    }
    
}

module.exports = auth