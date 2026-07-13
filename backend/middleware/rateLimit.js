import rateLimit from "express-rate-limit"

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        message : "Too many login attempts. Try again later."
    },
    handler: (req, res, next, options) => {
        req.log?.warn({ ip: req.ip, path: req.originalUrl }, "Login rate limit exceeded");
        res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true,
    legacyHeaders:false
})

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1100,
    message: {
        message : "Too many request attempts. Try again later."
    },
    handler: (req, res, next, options) => {
        req.log?.warn({ ip: req.ip, path: req.originalUrl }, "General rate limit exceeded");
        res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false
})
