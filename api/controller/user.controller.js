import bcrypt from "bcryptjs";

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
  const { password, ...otherData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (password) {
      const salt = bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      otherData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      message: "User updated successfully",
      user: rest,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};
