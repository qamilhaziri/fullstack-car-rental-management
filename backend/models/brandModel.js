import db from "../config/dbConfig.js";

const brandModel = {
  getAllBrands: async () => {
    return await db("brand").select("*").orderBy("brand", "asc");
  },

  registerBrand: async (brandData) => {
    const [brand] = await db("brand")
      .insert({ brand: brandData.brand })
      .returning("*");

    return brand;
  },
};

export default brandModel;
