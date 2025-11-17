const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Path to JSON storage file
const dataFilePath = path.join(__dirname, 'mockData.json');

// ---- Ensure mockData.json always exists ----
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify({ sessions: [], sessionHistory: {} }, null, 2)
  );
}

// ---- Load data from JSON file ----
const rawData = fs.readFileSync(dataFilePath, 'utf8');

// ❌ fix starts here
let data = JSON.parse(rawData);
let sessions = data.sessions;
let sessionHistory = data.sessionHistory;
// ❌ fix ends here

// ---- Save function ----
function saveData() {
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify({ sessions, sessionHistory }, null, 2)
  );
}

const app = express();
app.use(cors());
app.use(express.json());

// Inject data into every request
app.use((req, res, next) => {
  req.sessions = sessions;
  req.sessionHistory = sessionHistory;
  req.saveData = saveData;
  next();
});

// API routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

module.exports = app;
