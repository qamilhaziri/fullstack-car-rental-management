import bcrypt from "bcrypt"
import authService from "../services/authService.js"
import { generateAccessToken } from "../utils/jwt.js"


export const login = async (req,res) => {
    const {email, password} = req.body;

    const user = await authService.login(email);

    if(!user){
        req.log.warn({ email }, "Login failed: user not found");
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        req.log.warn({ email, userId: user.admin_id }, "Login failed: invalid password");
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = generateAccessToken({
        user_id: user.admin_id,
        fullName: user.full_name
    });

    res.cookie(
        "access_token",
        token, 
        {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 2700 * 1000
        }
    );

    req.log.info({ userId: user.admin_id }, "Login successful");

    return res.status(200).json({
        message:"Login successful",
        user: {
            user_id: user.admin_id,
            fullName: user.full_name
        }
    })
}

export const logout = async (req,res) => {
    res.clearCookie("access_token",{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 2700 * 1000
        } );
    req.log.info({ userId: req.user?.user_id }, "Logout successful");

    return res.status(200).json({
        message: "Logged out"
    })
}

export const me = async (req,res) => {
    req.log.debug({ userId: req.user?.user_id }, "Current user requested");
    return res.status(200).json({
        user: req.user
    })
}
