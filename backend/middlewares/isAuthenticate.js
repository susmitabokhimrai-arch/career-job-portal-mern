import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({
                message: "user not authenticated",
                success: false,
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }

         const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    
        req.id = decoded.userId;
        req.user = user; //for role & full data (new logic)
        next();
    } catch (error) {
    console.log(error);
return res.status(401).json({ message: "Authentication failed", success: false });
}
};
export default isAuthenticated;
