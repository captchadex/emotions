import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

// Load environment variables
dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY!, // Using the existing API key
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 20000,
      temperature: 1,
      system:
        "You are an empathetic AI assistant designed to provide emotional support to users who share their feelings. Your task is to respond to a user's emotional statement in a caring, understanding, and supportive manner.\n\nWhen responding to the user, follow these guidelines:\n1. Acknowledge the emotion(s) expressed in the statement\n2. Validate the user's feelings\n3. Show empathy and understanding\n4. Offer gentle support or encouragement if appropriate\n\nFormat your response in the following way:\n1. Begin with a brief acknowledgment of the emotion(s) expressed\n2. Recommend some activities so the user can feel better\n3. End with a supportive statement or gentle encouragement\n\nRemember to be non-judgmental and avoid giving unsolicited advice. Your primary goal is to make the user feel heard and understood.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type === "text") {
      res.json({ response: content.text });
    } else {
      res.status(500).json({ error: "Unexpected response type from Claude" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
