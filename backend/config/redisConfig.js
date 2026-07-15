import {createClient} from "redis"
import logger from "../utils/logger.js"

const redis = createClient({
    url:process.env.REDIS_URL,
    socket: {
        reconnectStrategy:false,
        connectTimeout:3000
    },
    disableOfflineQueue:true
})

redis.on("error",(error) => {
    logger.error({error},"Redis error")
})

export const connectRedis = async () => {
    try{
        await redis.connect();
        logger.info("Redis connected");
    }catch(error){
        logger.warn({error}, "Redis unavailable; cache disabled")
    }
}

export default redis;