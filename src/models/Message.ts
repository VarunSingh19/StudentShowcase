import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  teamId: String,
  userId: String,
  userName: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
