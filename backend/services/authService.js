import db from "../config/dbConfig.js"

const login = async (email) => {
    const user = await db("administrator")
                        .where({email})
                        .first()
    
    return user;
}

const saveRefreshSession = async(data,trx = db) => {
    return trx("refresh_session").insert(data);
}

const getRefreshSessionByHash = async (tokenHash, trx = db) => {
    return trx("refresh_session")
            .where({token_hash: tokenHash})
            .first();
}

const revokeRefreshSession = async (tokenHash,trx = db) => {
    return trx("refresh_session")
            .where({token_hash: tokenHash})
            .update({revoked_at : trx.fn.now()});
}

const revokeFamily = async (familyId, trx = db) => {
    return trx("refresh_session")
            .where({family_id: familyId})
            .whereNull("revoked_at")
            .update({revoked_at : trx.fn.now()})
}
 
export default {
    login,
    saveRefreshSession,
    getRefreshSessionByHash,
    revokeRefreshSession,
    revokeFamily
};
