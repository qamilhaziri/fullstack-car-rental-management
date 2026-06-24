export const validate = (schema) => {
    return (req,res,next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            req.log?.warn(
                {
                    path: req.originalUrl,
                    validationErrors: result.error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                "Request validation failed"
            );

            return res.status(400).json({
                message: "Please check the data."
            })
        }

        req.body = result.data;

        next();
    }
}
