const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// =================== Online Compiler (Judge0-like API) CONFIG ===================
// IMPORTANT: You MUST set JUDGE0_BASE_URL to your Judge0 (or similar) instance.
// Example for Judge0 CE self-hosted:  https://judge0.yourdomain.com
// Example for a hosted solution:       https://your-provider-url
//
// Many providers require an API key and a specific auth header name.
// Put those in environment variables when you deploy, or edit below.

const JUDGE0_BASE_URL =
  process.env.JUDGE0_BASE_URL || "https://YOUR_JUDGE0_BASE_URL";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "YOUR_API_KEY_IF_NEEDED";
const JUDGE0_AUTH_HEADER_NAME =
  process.env.JUDGE0_AUTH_HEADER_NAME || "X-Auth-Token";

// Map frontend language keys -> Judge0 language IDs
// NOTE: These IDs are EXAMPLES. You must check /languages on your Judge0 instance.
const LANGUAGE_MAP = {
  cpp: 54,        // C++ (e.g. GCC 9.2.0)
  c: 50,          // C  (e.g. GCC 9.2.0)
  java: 62,       // Java
  python: 71,     // Python 3
  javascript: 63  // Node.js
};

// =================== /run endpoint ===================
app.post("/run", async (req, res) => {
  try {
    const { language, code, stdin } = req.body || {};
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "language and code are required",
      });
    }

    const languageId = LANGUAGE_MAP[language];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const payload = {
      language_id: languageId,
      source_code: code,
      stdin: stdin || "",
    };

    const url = `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`;
    const headers = {
      "Content-Type": "application/json",
    };

    if (JUDGE0_API_KEY && JUDGE0_AUTH_HEADER_NAME) {
      headers[JUDGE0_AUTH_HEADER_NAME] = JUDGE0_API_KEY;
    }

    // Node 18+ has global fetch. If you're on older Node, install node-fetch and use that.
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    const stdout = (data.stdout || "").trim();
    const stderr = (data.stderr || "").trim();
    const compileOutput = (data.compile_output || "").trim();

    let output = "";
    if (compileOutput) output += `Compilation:\n${compileOutput}\n\n`;
    if (stdout) output += `Output:\n${stdout}\n`;
    if (stderr) output += `Errors:\n${stderr}\n`;
    if (!output.trim()) output = "(no output)";

    return res.json({
      success: true,
      output,
      status: data.status || null,
      time: data.time || null,
      memory: data.memory || null,
    });
  } catch (err) {
    console.error("Error in /run:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while executing code.",
    });
  }
});

// Basic contact endpoint (optional, used by portfolio form)
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  console.log("Contact message:", { name, email, message });
  return res.json({ success: true, message: "Message received." });
});

// Fallback: serve index.html for any unknown route (SPA-style)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
