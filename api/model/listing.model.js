import { Schema, model } from "mongoose";

const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    regularPrice: {
      type: Number,
      required: [true, "Please add a regular price"],
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.regularPrice;
        },
        message: "Discount price should be less than the regular price",
      },
    },
    bathrooms: {
      type: Number,
      required: [true, "Please add the number of bathrooms"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Please add the number of bedrooms"],
    },
    furnished: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: [true, "Please specify the listing type"],
    },
    offer: {
      type: Boolean,
      default: false,
    },
    imageUrls: {
      type: [String],
      required: [true, "Please add at least one image"],
    },
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify the user who created this listing"],
    },
  },
  { timestamps: true }
);

const Listing = model("Listing", listingSchema);

export default Listing;
