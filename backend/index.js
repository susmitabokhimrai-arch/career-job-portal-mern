import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
<<<<<<< HEAD

dotenv.config();
=======
import companyRoute from "./routes/company.routes.js";

dotenv.config({});
>>>>>>> d1709cc (user testing done through postman)

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
<<<<<<< HEAD
=======


const corsOptions ={
    origin:'http://localhost:5173',
    credentials:true
}
>>>>>>> d1709cc (user testing done through postman)

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

<<<<<<< HEAD
app.use("/api/v1/user", userRoute);

=======
>>>>>>> d1709cc (user testing done through postman)

const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
=======
//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);


const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>{
    connectDB();
console.log(`Server running at port ${PORT}`);
});


>>>>>>> d1709cc (user testing done through postman)
