const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

// Your OpenAI API key (only used if USE_MOCK = false)
const API_KEY = "PUT_YOUR_OPENAI_KEY_HERE";

const USE_MOCK = true; // Toggle this: true = mock, false = real AI

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).send("Message is empty");
    }

    if (USE_MOCK) {
      // ---------------- MOCK AI RESPONSE ----------------
      let reply = "";
      if (userMessage.toLowerCase().includes("hello")) {
        reply = "Hi there! This is a mock AI response.";
      } else if (userMessage.toLowerCase().includes("how are you")) {
        reply = "I'm just a mock AI, but I'm feeling great!";
      } else {
        reply = "This is a generic mock response to test your chat app.";
      }
      res.json({ reply });

    } else {
      // ---------------- REAL OPENAI RESPONSE ----------------
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // or "gpt-3.5-turbo"
          messages: [{ role: "user", content: userMessage }]
        })
      });

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        console.error("Invalid API response:", data);
        return res.status(500).send("AI response error");
      }

      res.json({
        reply: data.choices[0].message.content
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Error with AI request");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
