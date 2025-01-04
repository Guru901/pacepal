import mongoose, { model, models, Schema } from "mongoose";

const formSchema = new Schema(
  {
    followedSchedule: {
      type: Boolean,
      default: false,
    },
    productivity: {
      type: String,
      default: "",
    },
    hoursWorked: {
      type: [
        {
          name: String,
          hours: Number,
        },
      ],
      default: [],
    },
    hoursPlanned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    tasksPlanned: {
      type: Number,
      default: 0,
    },
    sleptWell: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },
    distractions: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    distractionsList: {
      type: String,
      default: "",
    },
    mood: {
      type: String,
      enum: ["happy", "tired", "neutral", "stressed", "productive"],
      default: "neutral",
    },
    overWork: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hoursSlept: {
      type: Number,
      default: 0,
    },
    version: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Form = models.Form || model("Form", formSchema);

export { Form };
