import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    browser: { type: String, default: "Unknown" },
    device: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    referrer: { type: String, default: "Direct" },
    country: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

clickEventSchema.index({ urlId: 1, createdAt: -1 });

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;
