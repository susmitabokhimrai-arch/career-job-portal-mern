import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import notificationRoutes from "./routes/notification.route.js";
import blogRoute from "./routes/blog.route.js";
import analyticsRoutes from "./routes/analytics.routes.js";


// Load environment variables
dotenv.config();

// Debug - check if FRONTEND_URL is loaded
console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);
console.log("EMAIL_USER from env:", process.env.EMAIL_USER);
const app = express();  


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions ={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/admin", analyticsRoutes);

app.listen(PORT,()=>{
    connectDB();
console.log(`Server running at port ${PORT}`);
});

