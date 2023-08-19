const express = require("express");
const request = require("request-promise");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to BuildABot");
});

app.get("/chat/:apiKey/:behaviour/:message", async (req, res) => {
  const userMessage = req.params.message;
  const behaviour = req.params.behaviour;
  const apiKey = req.params.apiKey;

  const conversation = [
    { role: "system", content: behaviour },
    { role: "user", content: userMessage },
  ];

  try {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";

    const requestBody = {
      messages: conversation,
      model: "gpt-3.5-turbo",
    };

    const response = await request.post(apiEndpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const aiReply = JSON.parse(response).choices[0].message.content;

    res.json({ aiReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
