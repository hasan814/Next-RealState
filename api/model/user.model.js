import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: {
      type: String,
      default: "https://img.icons8.com/color/48/gender-neutral-user.png",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
