import express from "express";
import dotenv from "dotenv"
import connectDB from "./db/connection.js";
import UserRouter from "./routes/user.js";
import TodoRouter from "./routes/todo.js";
import bodyParaser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";


//status code 
//200 => ok 
//201 => create 
//404 => page not found 
//500 => internal server 
//401 => unauthorized access 




dotenv.config();

connectDB();
const app = express();


app.use(cors({
    origin:"https://todo-handler-app.netlify.app",
    credentials:true,
}))

app.use(cookieParser())
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/todo", TodoRouter);
app.use(express.json())
app.use(bodyParaser.urlencoded({ extended: true }))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listen at ${PORT} port ...`);

})
