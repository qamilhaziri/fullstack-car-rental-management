import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message : "Too many login attempts. Try again later."
    },
    standardHeaders: true,
    legacyHeaders:false
})

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: {
        message : "Too many login attempts. Try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
})