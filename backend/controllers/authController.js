import bcrypt from "bcrypt"
import authService from "../services/authService.js"
import { generateAccessToken, generateRefreshToken, hashToken, verifyRefreshToken } from "../utils/jwt.js"
import db from "../config/dbConfig.js"

const isProduction = process.env.NODE_ENV === "production";

const accessCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 10 * 60 * 1000,
    path: "/",
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
};

const setAuthCookies = (res,accessToken,refreshToken) => {
    res.cookie("access_token", accessToken, accessCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshCookieOptions);
}

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

      const payload = {
        user_id: user.admin_id,
        fullName: user.full_name
    }

    const accessToken = generateAccessToken(payload);
    const {token: refreshToken,jti, familyId} = generateRefreshToken(payload);

    const decodedRefresh = verifyRefreshToken(refreshToken);

    await authService.saveRefreshSession({
        user_id: user.admin_id,
        family_id: familyId,
        token_hash: hashToken(refreshToken),
        expires_at: new Date(decodedRefresh.exp * 1000),
        replaced_by_jti: null,
    })

    setAuthCookies(res, accessToken, refreshToken);

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
    const refreshToken = req.cookies.refresh_token;

    if(refreshToken){
        await authService.revokeRefreshSession(hashToken(refreshToken));
    }

    res.clearCookie("access_token", accessCookieOptions);
    res.clearCookie("refresh_token", refreshCookieOptions);
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


export const refresh = async (req,res) => {
    const oldRefreshToken = req.cookies.refresh_token;

    if(!oldRefreshToken){
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try{
        const decoded = verifyRefreshToken(oldRefreshToken);

        if(decoded.token_type !== "refresh"){
            return res.status(401).json({message: "Invalid refresh token"});
        }

        const tokens = await db.transaction(async (trx) => {
            const tokenHash = hashToken(oldRefreshToken);

            const session = await trx("refresh_session")
                            .where({token_hash: tokenHash})
                            .first()
                            .forUpdate();

            if(!session || session.revoked_at ||
                new Date(session.expires_at) <= new Date()
            ){
                if(decoded.family_id){
                    await authService.revokeFamily(decoded.family_id, trx);
                }

                throw new Error("REFRESH_REUSE_OR_INVALID");
            }

            const payload = {
                user_id: decoded.user_id,
                fullName: decoded.fullName,
            };

            const accessToken = generateAccessToken(payload);
            const {token: newRefreshToken, jti, familyId} = generateRefreshToken(
                payload,
                decoded.family_id
            );

            const newDecoded = verifyRefreshToken(newRefreshToken);

            await trx("refresh_session")
                    .where({refresh_session_id: session.refresh_session_id})
                    .update({
                        revoked_at: db.fn.now(),
                        replaced_by_jti: jti,
                    });
            
            await authService.saveRefreshSession({
                user_id: decoded.user_id,
                family_id: familyId,
                token_hash: hashToken(newRefreshToken),
                expires_at: new Date(newDecoded.exp * 1000),
                replaced_by_jti: null,
                },
                trx)
            
            return { accessToken, refreshToken: newRefreshToken };
        })

        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        return res.status(200).json({ message: "Token refreshed" });
    }catch(error){
        res.clearCookie("access_token", accessCookieOptions);
        res.clearCookie("refresh_token", refreshCookieOptions);

        return res.status(401).json({ message: "Session expired. Login again." });
    }
}
