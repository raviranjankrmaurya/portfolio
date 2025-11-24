// server.js  (CommonJS version – Render + Judge0 with polling)

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
const PORT = process.env.PORT || 10000; // Render port

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

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": JUDGE0_HOST,
    };

    // 1️⃣ Pehle submission create karo (wait = false) → token milega
    const submitRes = await fetch(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    const submitData = await submitRes.json();
    const token = submitData.token;

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "No token received from Judge0.",
      });
    }

    // 2️⃣ Ab result ke liye poll karo
    let result;
    const started = Date.now();
    const timeoutMs = 15000; // 15 sec max

    while (true) {
      const resultRes = await fetch(
        `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`,
        { headers }
      );
      result = await resultRes.json();

      // 1 = In Queue, 2 = Processing, >2 = finished
      if (result.status && typeof result.status.id === "number" && result.status.id > 2) {
        break;
      }

      if (Date.now() - started > timeoutMs) {
        return res.status(500).json({
          success: false,
          error: "Execution timeout while waiting for Judge0.",
        });
      }

      // 1 second wait then check again
      await new Promise((r) => setTimeout(r, 1000));
    }

    const status = result.status && result.status.description;
    const stdout = (result.stdout || "").trim();
    const stderr = (result.stderr || "").trim();
    const compileOutput = (result.compile_output || "").trim();

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
