import bcrypt from "bcryptjs";

import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

// ================ Test Route ==================
export const test = (req, res) => {
  res.json({ message: "Hello world!" });
};

// ================ Update User ==================
export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id)
    return res
      .status(401)
      .json({ message: "You can only update your own account!" });

  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    let updatedFields = {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    };

    if (req.body.password) {
      updatedFields.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      message: "User updated successfully",
      user: rest,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating user",
      error: err.message,
    });
  }
};

// ================ Delete User ==================
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return res
      .status(401)
      .json({ message: "You can only delete your own account!" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// ================ Get User Listing ==================
export const getUserListings = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      const listings = await Listing.find({ userRef: req.params.id });
      return res.status(200).json(listings);
    } else {
      return res
        .status(403)
        .json({ message: "You can only view your own listings!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ================ Get User Listing ==================
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
