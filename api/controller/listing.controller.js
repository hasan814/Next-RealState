import Listing from "../model/listing.model.js";

export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating listing",
      error: error.message,
    });
  }
};
