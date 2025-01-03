import dotenv from "dotenv";
import jwt from "jsonwebtoken"
dotenv.config();
const isAuthenticate = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access',
            });
        }

        const token = req.cookies.token;
        console.log(token)
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token',
            });
        }

        req.id = decode.userID;
        next();
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

export default isAuthenticate;
