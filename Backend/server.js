const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")


const connectDB = require("./config/DB")

dotenv.config()
connectDB()

const app = express()

//middleware
app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/authRoutes")
const orgRoutes = require("./routes/orgRoutes")
const flagRoutes = require("./routes/flagRoutes")
const userRoutes = require("./routes/userRoutes")

//Router
app.use("/api/auth", authRoutes)
app.use("/api/org", orgRoutes)
app.use("/api/flags", flagRoutes)
app.use("/api/user", userRoutes)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);   
})
