const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users") //import đối tượng router được định nghĩa tại file users.js vào trong biến userRoute
const authRoute = require("./routes/auth") //import đối tượng router được định nghĩa tại file users.js vào trong biến userRoute
const postRoute = require("./routes/posts")

dotenv.config()

mongoose.connect
(
    process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connected Successfully!!'))
.catch((err) => { console.error(err); });

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common")); 

app.use("/api/users", userRoute);//sử dụng đối tượng router được import để định nghĩa các tuyến đường trong ứng dụng
app.use("/api/auth", authRoute);//sử dụng đối tượng router được import để định nghĩa các tuyến đường trong ứng dụng
app.use("/api/posts", postRoute);
    
app.get("/", (req,res) => {
res.send("welcome to homepage")
})

app.get("/users", (req,res) => {
    res.send("welcome to user page")
})

app.listen(8800,() => {
    console.log("Backend server is running!"); 
})