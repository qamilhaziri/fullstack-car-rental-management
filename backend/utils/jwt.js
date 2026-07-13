import jwt from "jsonwebtoken"
import crypto from "crypto"

const commonOptions = {
    issuer: "car-rental-api",
    audience: "car-rental-client"
}

export const generateAccessToken = (payload) => {
    return jwt.sign(
               { ...payload,token_type: "access"},
                process.env.JWT_SECRET,
                {
                    ...commonOptions,
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
    );
}

export const generateRefreshToken = (payload, familyId = crypto.randomUUID()) => {
    const jti = crypto.randomUUID();
   
    const token = jwt.sign(
        {...payload,jti,family_id : familyId, token_type: "refresh"},
        process.env.JWT_REFRESH_SECRET,
        {
            ...commonOptions,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    )

    return {token,jti,familyId};
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET,commonOptions)
}

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}
