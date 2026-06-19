import bcrypt from "bcrypt"
import authService from "../services/authService.js"
import { generateAccessToken } from "../utils/jwt.js"


export const login = async (req,res) => {
    const {email, password} = req.body;

    const user = await authService.login(email);

    if(!user){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = generateAccessToken({
        user_id: user.admin_id
    });

    res.cookie(
        "access_token",
        token, 
        {
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge: 2700
        }
    );

    return res.status(200).json({
        message:"Login successful",
        user: {
            user_id: user.admin_id,
            fullName: user.full_name
        }
    })
}

export const logout = async (req,res) => {
    res.clearCookie("access_token");

    return res.status(200).json({
        message: "Logged out"
    })
}

export const me = async (req,res) => {
    return res.status(200).json({
        user: req.user
    })
}
