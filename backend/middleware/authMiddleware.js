import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) => {
    const token = req.cookies.access_token;

    if(!token){
        req.log?.warn({ path: req.originalUrl }, "Unauthorized request: missing access token");
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;
        req.log?.debug({ userId: decoded.user_id }, "Access token verified");

        next();
    } catch (error) {
        req.log?.warn({ err: error, path: req.originalUrl }, "Unauthorized request: invalid access token");
        return res.status(401).json({
             message: "Unauthorized"
        })
    }
}

export default authMiddleware;
