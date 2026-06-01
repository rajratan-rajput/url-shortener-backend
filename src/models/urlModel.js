import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    longUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ longUrl: "text", shortCode: "text" });

const Url = mongoose.model("Url", urlSchema);

export default Url;
