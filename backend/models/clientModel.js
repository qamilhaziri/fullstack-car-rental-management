import db from "../config/dbConfig.js"

const clientModel = {

    registerClient: async (client) => {
        const { client_name ,client_surname, personal_number,gender , city,
                email, date_of_birth, phone_number, nationality } = client;

        await db.raw("Call register_client(?,?,?,?,?,?,?,?,?)",[
            client_name ,client_surname, personal_number,gender , city,
                email, date_of_birth, phone_number, nationality
        ])
    }
    ,
    getAllClients: async () => {
        return await db("client").select("*")
    },

    getClientById: async (client_id) => {
        return await db("client")
            .where({client_id})
            .first()
    },

    updateClient: async(client_id,data) => {
        const result = db("client")
                        .where({client_id})
                        .update(data)
                        .returning("*");
        return result;
    },
    removeClient: async(client_id) => {
        const data = await db("client")
                                .where({client_id})
                                .del()
                                .returning("*");
        return data;
    }


}

export default clientModel