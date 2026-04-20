import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this later!
  },
  { timestamps: true },
);

// Check if model exists to prevent re-compilation in development
export const User = models.User || model("User", UserSchema);
