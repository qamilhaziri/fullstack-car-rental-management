import brandModel from "../models/brandModel.js";

export const getAllBrands = async (req, res) => {
  try {
    const brands = await brandModel.getAllBrands();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerBrand = async (req, res) => {
  try {
    const brand = await brandModel.registerBrand(req.body);

    return res.status(201).json({
      message: "Brand inserted successfully",
      brand,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
