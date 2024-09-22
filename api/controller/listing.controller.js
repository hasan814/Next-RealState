import Listing from "../model/listing.model.js";

// ================ Create ==================
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

// ================ Delete ==================
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.userRef.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ================ Update ==================
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.userRef.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Update Listing Successfully", updatedListing });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ================ Get ==================
export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json(listing);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ================ Get Listings ==================
export const getListings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex || 0);

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "false") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch listings.",
    });
  }
};
