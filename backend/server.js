import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas URI (make sure password is URL encoded)
const MONGO_URI =
  "mongodb+srv://deepakkumartripathy1008:dKt%4010153@cluster0.zizisk9.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ----------------- Schema + Model ----------------- */
const conversationSchema = new mongoose.Schema({
  title: String, // usually the first user message
  messages: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

/* ----------------- API Routes ----------------- */

// ✅ Create a new conversation
app.post("/api/conversations", async (req, res) => {
  try {
    const { title, firstMessage } = req.body;
    const newConversation = new Conversation({
      title,
      messages: [firstMessage],
    });
    await newConversation.save();
    res.json(newConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// ✅ Add a message to existing conversation
app.post("/api/conversations/:id/messages", async (req, res) => {
  try {
    const { role, text } = req.body;
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: { role, text } } },
      { new: true }
    );
    res.json(updatedConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
});

// ✅ Get all conversations (for sidebar)
app.get("/api/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 });
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// ✅ Get single conversation by ID
app.get("/api/conversations/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Conversation not found" });
  }
});

/* ----------------- Server ----------------- */
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
