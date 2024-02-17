const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const axios = require("axios");
const res = require("express/lib/response");
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const port = 3000;
const openaiApiKey = "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"; // Replace with your API key
const openai = new OpenAI({ apiKey: openaiApiKey });

app.get("/", (req, res) => {
  res.send("Welcome to the Project Management API");
});

// Function to call OpenAI API
const fetchOpenAIResponse = async (userInput) => {
  try {
    // Rephrase the user input to align with generating user stories
    const rephrasedInput = `Based on the following requirements, generate user stories:\n\n${userInput}`;

    const prompt = `User Stories:\n${rephrasedInput}`;
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
      //   model: "text-davinci-003", // Replace with your desired model
      //   prompt: `${promptType}: ${inputText}\n\n`,
      //   max_tokens: 150,
    });
    console.log(response.choices[0].message.content);
    // return response.data.choices[0].text.trim();
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return `Error: ${error.message}`;
  }
};

// Define POST endpoints using the OpenAI function

// POST endpoint for generating user stories
app.post("/generate-user-stories", async (req, res) => {
  const { requirement } = req.body;
  // Modify or rephrase the requirement as needed to focus on user story generation
  const modifiedRequirement = `Generate user stories for: ${requirement}`;

  const result = await fetchOpenAIResponse(modifiedRequirement);
  res.json({ message: "User stories generated", data: result });
});

// Similar setup for other endpoints...

// POST endpoint for generating acceptance criteria
//** TO DO: pass the user story generated above to this
app.post("/generate-acceptance-criteria", async (req, res) => {
  const { requirement } = req.body;
  const result = await fetchOpenAIResponse(requirement);
  res.json({ message: "Acceptance criteria generated", data: result });
});

// POST endpoint for generating test cases
//** TO DO: pass the user story generated above to this
app.post("/generate-test-cases", async (req, res) => {
  const { requirement } = req.body;
  const result = await fetchOpenAIResponse(requirement);
  res.json({ message: "Test cases generated", data: result });
});

// POST endpoint for generating PRD
//** TO DO: pass the user story generated above to this
app.post("/generate-prd", async (req, res) => {
  const { requirement } = req.body;
  const result = await fetchOpenAIResponse(requirement);
  res.json({ message: "PRD generated", data: result });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
