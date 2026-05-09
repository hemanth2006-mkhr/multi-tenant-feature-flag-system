const superOnly = (req, res, next)=>{
    try {
        if(req.user.role === "superadmin"){
           return next()
        }
        return res.sendStatus(403)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const adminOnly = (req, res, next) => {
    try {
        if(req.user.role === "admin"){
            return next()
        }
        return res.status(403).json({message : "Only access to admin"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

module.exports = { superOnly, adminOnly }