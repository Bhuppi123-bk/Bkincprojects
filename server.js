const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup (SQLite file)
const dbFile = path.join(__dirname, "data.sqlite");
const db = new sqlite3.Database(dbFile);

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS dashboard_data (
    id INTEGER PRIMARY KEY,
    data TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Ensure one row exists with id=1
  db.get("SELECT COUNT(*) as count FROM dashboard_data WHERE id=1", (err, row) => {
    if (err) return console.error(err);
    if (!row || row.count === 0) {
      db.run("INSERT INTO dashboard_data (id, data) VALUES (1, ?)", JSON.stringify({}), (e) => {
        if (e) console.error("init insert error", e);
      });
    }
  });
});

app.use(bodyParser.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, "public")));

// API to load data
app.get("/api/load", (req, res) => {
  db.get("SELECT data FROM dashboard_data WHERE id=1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const parsed = row && row.data ? JSON.parse(row.data) : {};
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON in DB" });
    }
  });
});

// API to save data
app.post("/api/save", (req, res) => {
  const newData = JSON.stringify(req.body || {});
  db.run("UPDATE dashboard_data SET data=?, updated_at=CURRENT_TIMESTAMP WHERE id=1", [newData], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Simple health check
app.get("/_health", (req, res) => res.json({ ok: true }));

// Serve index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "work.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup (SQLite file)
const dbFile = path.join(__dirname, "data.sqlite");
const db = new sqlite3.Database(dbFile);

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS dashboard_data (
    id INTEGER PRIMARY KEY,
    data TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Ensure one row exists with id=1
  db.get("SELECT COUNT(*) as count FROM dashboard_data WHERE id=1", (err, row) => {
    if (err) return console.error(err);
    if (!row || row.count === 0) {
      db.run("INSERT INTO dashboard_data (id, data) VALUES (1, ?)", JSON.stringify({}), (e) => {
        if (e) console.error("init insert error", e);
      });
    }
  });
});

app.use(bodyParser.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, "public")));

// API to load data
app.get("/api/load", (req, res) => {
  db.get("SELECT data FROM dashboard_data WHERE id=1", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const parsed = row && row.data ? JSON.parse(row.data) : {};
      res.json(parsed);
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON in DB" });
    }
  });
});

// API to save data
app.post("/api/save", (req, res) => {
  const newData = JSON.stringify(req.body || {});
  db.run("UPDATE dashboard_data SET data=?, updated_at=CURRENT_TIMESTAMP WHERE id=1", [newData], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Simple health check
app.get("/_health", (req, res) => res.json({ ok: true }));

// Serve index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "work.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
