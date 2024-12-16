import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    kindeId: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    given_name: {
      type: String,
      required: true,
    },
    isOnBoarded: {
      type: Boolean,
      default: false,
    },
    slots: {
      type: [
        {
          name: String,
          hours: Number,
        },
      ],
      default: [],
    },

    desiredSleepHours: {
      type: Number,
      default: 7,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export { User };
