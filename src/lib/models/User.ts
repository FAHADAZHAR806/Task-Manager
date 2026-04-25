import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // --- NEW FIELDS FOR ADMIN APPROVAL & FORGOT PASSWORD ---
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
