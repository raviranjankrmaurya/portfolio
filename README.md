# Portfolio + Online Compiler (Judge0)

This project is a personal portfolio (HTML/CSS/JS) with a **Code Library** section that:
- Shows folders by language
- Shows files inside each folder
- Lets you **view, edit, download, and run** code
- Uses an **online compiler API** (Judge0 or similar) via a Node.js backend

## Structure

- `server.js` – Node.js server, exposes `/run` endpoint and proxies to Judge0
- `package.json` – Node project config (uses Express)
- `public/index.html` – Portfolio + Code Library UI
- `public/styles.css` – Styling (responsive, dark theme)
- `public/snippets.js` – All code snippets (edit this to add more programs)
- `public/script.js` – Frontend logic (folders, files, editor, run, download)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Judge0 (or similar online compiler API):

Edit `server.js` or set environment variables:

```bash
export JUDGE0_BASE_URL="https://YOUR_JUDGE0_BASE_URL"
export JUDGE0_API_KEY="YOUR_API_KEY_IF_NEEDED"
export JUDGE0_AUTH_HEADER_NAME="X-Auth-Token"   # or whatever your provider uses
```

Also make sure the `LANGUAGE_MAP` in `server.js` uses correct `language_id` values
for your Judge0 instance (check `/languages` endpoint).

3. Run the server:

```bash
npm start
```

Open `http://localhost:3000` in your browser.

## Adding / Editing Code

To add new code files or folders:

- Open `public/snippets.js`
- Add a new entry under the language you want, e.g.:

```js
window.SNIPPETS.cpp.push({
  id: "cpp-new-example",
  fileName: "new_example.cpp",
  lang: "C++",
  prismLang: "cpp",
  runLang: "cpp",
  code: `#include <iostream>
using namespace std;
int main() {
    cout << "New Example" << endl;
    return 0;
}`
});
```

You don't need to touch `script.js` to add new code.

## Notes

- The **Run** feature sends your code to Judge0 (or any API you configure) and returns the result.
- No compilers need to be installed on your local machine; execution happens on the remote API.
- For production / public usage, be careful with API limits, security, and keys.

