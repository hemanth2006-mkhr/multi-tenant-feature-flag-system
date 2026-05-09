const bcrypt = require("bcryptjs")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")

const superLogin = (req,res)=>{
    try {
        const {email, password} = req.body 
        if(email === process.env.SUPERADMIN_EMAIL && password === process.env.SUPERADMIN_PASSWORD){
            return res.status(200).json({ token : generateToken({role : "superadmin"}), role : "superadmin"})
        }
        return res.status(401).json({ message: "Incorrect email or password" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
    
}

const signup = async(req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            ...req.body,
            password : hashedPassword,
            role : "admin"
        })
        user.save()
        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const login = async(req,res)=>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({
            email : email
        })
        if(!user){
            return res.status(401).json({ message: "Incorrect email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        return res.status(200).json({ token : generateToken({role : "admin", organizationId : user.organizationId}), role : user.role, organizationId : user.organizationId, name : user.name })
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}
 


module.exports = {superLogin, signup, login}