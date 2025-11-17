const express = require('express');
const router = express.Router();

// Global data (server memory)
let sessions = [];
let sessionHistory = {};
let chatCount = 0;

// Helper: ChatGPT-like answers
function generateAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes("javascript")) return "JavaScript is a high-level, versatile programming language...";
  if (q.includes("react")) return "React is a JavaScript library for building user interfaces...";
  if (q.includes("api")) return "API is a set of rules that allows two software applications to communicate.";
  return `Here’s a clear and simple explanation for your query: "${question}".`;
}

// 1) Get all sessions
router.get('/sessions', (req, res) => {
  res.json(sessions);
});

// 2) Create new chat session
router.get('/new-chat', (req, res) => {
  chatCount++;
  const newId = `session-${Date.now()}`;
  const newTitle = `Chat${chatCount}`;
  
  sessions.push({ id: newId, title: newTitle });
  sessionHistory[newId] = [];

  res.json({ id: newId, title: newTitle });
});

// 3) Get chat history of session
router.get('/session/:id', (req, res) => {
  const history = sessionHistory[req.params.id] || [];
  res.json(history);
});

// 4) Send chat message
router.post('/chat/:id', (req, res) => {
  const sessionId = req.params.id;
  const { question } = req.body;

  if (!sessionHistory[sessionId]) sessionHistory[sessionId] = [];

  const answer = generateAnswer(question);
  const response = { question, answer };

  sessionHistory[sessionId].push(response);
  res.json(response);
});

module.exports = router;
