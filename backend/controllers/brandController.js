import brandModel from "../models/brandModel.js";
import redis from "../config/redisConfig.js";

async function invalidateBrandCache(){
  if(redis.isOpen){
    await redis.del("brands:all");
  }
}
export const getAllBrands = async (req, res) => {
  try {

    if(redis.isOpen){
      const cachedBrands = await redis.get("brands:all");

      if(cachedBrands){
        return res.set("X-Cache","HIT").json(JSON.parse(cachedBrands))
      }
    }

    const brands = await brandModel.getAllBrands();

    if(redis.isOpen){
      await redis.setEx("brands:all",3600,JSON.stringify(brands))
    }
    res.set("X-Cache","MISS").json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerBrand = async (req, res) => {
  try {
    const brand = await brandModel.registerBrand(req.body);

    await invalidateBrandCache();
    return res.status(201).json({
      message: "Brand inserted successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
