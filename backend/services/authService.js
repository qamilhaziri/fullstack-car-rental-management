import db from "../config/dbConfig.js"

const login = async (email) => {
    const user = await db("administrator")
                        .where({email})
                        .first()
    
    return user;
}

export default {
    login
};