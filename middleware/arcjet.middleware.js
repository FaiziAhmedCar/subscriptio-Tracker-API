import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.evaluate(req);
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){return res.status(429).json({error: "Too many requests"});}
            if(decision.reason.isBot()){return res.status(403).json({error: "Bots are not allowed"});}

            return res.status(403).json({error: "Access denied"});
    }
    next();
    } catch (error) {
        console.log(`Error from arcjetMiddleware: ${error}`);
        next(error);
    }
};

export default arcjetMiddleware;