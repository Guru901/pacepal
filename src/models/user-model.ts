import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  kindeId: {
    type: String,
    required: true,
    unique: true,
  },
  picture: { type: String },
  given_name: { type: String },
  isOnBoarded: { type: Boolean, default: false },
  versions: [
    {
      versionName: { type: String, required: true, unique: true },
      data: {
        slots: { type: Array, default: [] },
        desiredSleepHours: { type: Number, required: true },
      },
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export { User };
