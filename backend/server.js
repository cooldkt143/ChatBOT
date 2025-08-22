import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Replace with your corrected MongoDB Atlas URI
// If password has special characters like @ : / ? → encode them (%40 for @, etc.)
const MONGO_URI = "mongodb+srv://deepakkumartripathy1008:dKt%4010153@cluster0.zizisk9.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const historySchema = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

// API: Fetch histories
app.get("/api/history", async (req, res) => {
  try {
    const histories = await History.find().sort({ createdAt: -1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// API: Save new history
app.post("/api/history", async (req, res) => {
  try {
    const { title } = req.body;
    const newHistory = new History({ title });
    await newHistory.save();
    res.json(newHistory);
  } catch (err) {
    res.status(500).json({ error: "Failed to save history" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
