// server.js  (CommonJS version – Render + Judge0 ready)

const express = require("express");
const cors = require("cors");
const path = require("path");

// ---- Judge0 (RapidAPI) config ----
const JUDGE0_BASE_URL =
  process.env.JUDGE0_BASE_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_HOST =
  process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

// ---- Express app ----
const app = express();
const PORT = process.env.PORT || 10000; // Render apna port env se deta hai

app.use(cors());
app.use(express.json());

// static frontend (public folder)
app.use(express.static(path.join(__dirname, "public")));

// ---- /run endpoint : call Judge0 API ----
app.post("/run", async (req, res) => {
  try {
    const { language, code, stdin } = req.body || {};

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "language and code are required",
      });
    }

    // language → Judge0 language_id map
    const LANG_MAP = {
      c: 50,          // C (GCC)
      cpp: 54,        // C++ (GCC)
      java: 62,       // Java
      python: 71,     // Python 3
      javascript: 63, // Node.js
    };

    const language_id = LANG_MAP[language];
    if (!language_id) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const payload = {
      language_id,
      source_code: code,
      stdin: stdin || "",
    };

    const url = `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`;

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": JUDGE0_HOST,
    };

    // Node 18+ me global fetch hota hai
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const status = data.status && data.status.description;
    const stdout = (data.stdout || "").trim();
    const stderr = (data.stderr || "").trim();
    const compileOutput = (data.compile_output || "").trim();

    let output = "";
    if (status) output += `Status: ${status}\n\n`;
    if (compileOutput) output += `Compiler output:\n${compileOutput}\n\n`;
    if (stderr) output += `Stderr:\n${stderr}\n\n`;
    if (stdout) output += `Stdout:\n${stdout}`;
    output = output.trim() || "(no output)";

    return res.json({ success: true, output });
  } catch (err) {
    console.error("Error in /run:", err);
    return res.status(500).json({
      success: false,
      error: "Internal error while running code.",
    });
  }
});

// fallback (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
