// ========= NAVBAR, THEME, BASIC ==========

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
const themeToggle = document.getElementById("themeToggle");

// mobile nav
navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// close nav on link click (mobile)
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// scroll active link
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

function onScroll() {
  const scrollPos = window.scrollY + 120;
  sections.forEach((sec) => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach((l) => l.classList.remove("active"));
      const active = document.querySelector(`.nav a[href="#${sec.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}
window.addEventListener("scroll", onScroll);

// year
document.getElementById("year").textContent = new Date().getFullYear();

// theme toggle (dark / light)
const body = document.body;
themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  themeToggle.textContent = body.classList.contains("light") ? "☀️" : "🌙";
});

// ========= HERO ANIMATIONS (name typing + image floating) ==========

const heroNameEl = document.getElementById("heroName");
const heroImage = document.getElementById("heroImage");

const nameText = "Hi, I'm Raviranjan Kumar";
let typeIndex = 0;

function typeHeroName() {
  if (typeIndex <= nameText.length) {
    heroNameEl.textContent = nameText.slice(0, typeIndex);
    typeIndex++;
    setTimeout(typeHeroName, 80);
  } else {
    // final pretty version with span
    heroNameEl.innerHTML =
      `Hi, I'm <span class="hero-name-highlight">Raviranjan Kumar</span>`;
  }
}
typeHeroName();

// floating animation on image
let t = 0;
function floatImage() {
  t += 0.03;
  const y = Math.sin(t) * 6; // -6 .. +6 px
  heroImage.style.transform = `translateY(${y}px)`;
  requestAnimationFrame(floatImage);
}
requestAnimationFrame(floatImage);

// ========= CONTACT FORM -> /contact API ==========

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "Sending...";

  const payload = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      formStatus.textContent = "Message sent successfully!";
      contactForm.reset();
    } else {
      formStatus.textContent = data.error || "Something went wrong.";
    }
  } catch (err) {
    console.error(err);
    formStatus.textContent = "Network error. Please try again.";
  }
});

// ========= CODE LIBRARY + ONLINE COMPILER ==========

// SNIPPETS: yahan apne saare programs add/extend kar sakte ho.
// needsInput: true  => INPUT textarea active
// needsInput: false => INPUT readonly, direct OUTPUT
const SNIPPETS = {
  cpp: [
    {
      id: "cpp-hello",
      fileName: "hello_world.cpp",
      lang: "C++",
      prismLang: "cpp",
      runLang: "cpp",
      needsInput: false,
      code: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello, World from C++!"; 
    return 0;
}`
    },
    {
      id: "cpp-sum",
      fileName: "sum_two_numbers.cpp",
      lang: "C++",
      prismLang: "cpp",
      runLang: "cpp",
      needsInput: true,
      code: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b);
    return 0;
}`
    }
  ],
  c: [
    {
      id: "c-hello",
      fileName: "hello_world.c",
      lang: "C",
      prismLang: "c",
      runLang: "c",
      needsInput: false,
      code: `#include <stdio.h>
int main() {
    printf("Hello, World from C!");
    return 0;
}`
    }
  ],
  java: [
    {
      id: "java-binarysearch",
      fileName: "BinarySearch.java",
      lang: "Java",
      prismLang: "java",
      runLang: "java",
      needsInput: true,
      code: `import java.util.*;
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i=0;i<n;i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();
        int idx = binarySearch(arr, target);
        if (idx == -1) System.out.println("Not found");
        else System.out.println("Found at index " + idx);
    }
}`
    }
  ],
  python: [
    {
      id: "py-hello",
      fileName: "hello_world.py",
      lang: "Python",
      prismLang: "python",
      runLang: "python",
      needsInput: false,
      code: `print("Hello, World from Python!")`
    }
  ],
  javascript: [
    {
      id: "js-hello",
      fileName: "hello_world.js",
      lang: "JavaScript",
      prismLang: "javascript",
      runLang: "javascript",
      needsInput: false,
      code: `console.log("Hello, World from JavaScript!");`
    }
  ]
};

// DOM references
const folderCards = document.querySelectorAll(".folder-card");
const fileList = document.getElementById("fileList");
const currentFolderName = document.getElementById("currentFolderName");
const currentFolderCount = document.getElementById("currentFolderCount");

const viewerPlaceholder = document.getElementById("viewerPlaceholder");
const codeContainer = document.getElementById("codeContainer");
const codeBlock = document.getElementById("codeBlock");
const codeEditor = document.getElementById("codeEditor");
const fileNameLabel = document.getElementById("fileNameLabel");
const fileLangLabel = document.getElementById("fileLangLabel");
const runButton = document.getElementById("runButton");
const downloadButton = document.getElementById("downloadButton");
const editButton = document.getElementById("editButton");

// separate input & output
const inputBox = document.getElementById("inputBox");
const outputBox = document.getElementById("outputBox");

let activeFolderKey = null;
let activeFileId = null;
let currentFileMeta = null;

// helpers
function clearFileActive() {
  fileList.querySelectorAll(".file-item").forEach((li) => {
    li.classList.remove("active");
  });
}

function resetIOPlaceholders() {
  if (!inputBox || !outputBox) return;
  inputBox.value = "";
  outputBox.value = "";
  inputBox.readOnly = true;
  outputBox.readOnly = true;
  inputBox.placeholder =
    "Select a file.\nInput (stdin) yahan likhoge.";
  outputBox.placeholder =
    "Run ke baad output yahan show hoga.";
}

function openFolder(folderKey, folderLabel) {
  activeFolderKey = folderKey;
  activeFileId = null;
  currentFileMeta = null;

  folderCards.forEach((card) => card.classList.remove("active"));
  const activeCard = document.querySelector(
    `.folder-card[data-folder="${folderKey}"]`
  );
  if (activeCard) activeCard.classList.add("active");

  const files = SNIPPETS[folderKey] || [];
  currentFolderName.textContent = folderLabel;
  currentFolderCount.textContent = files.length ? `${files.length} files` : "";

  fileList.innerHTML = "";
  if (!files.length) {
    const li = document.createElement("li");
    li.className = "file-empty";
    li.textContent = "No files in this folder yet.";
    fileList.appendChild(li);
  } else {
    files.forEach((file) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.dataset.fileId = file.id;

      const nameSpan = document.createElement("span");
      nameSpan.className = "file-name";
      nameSpan.innerHTML = `<span>📄</span><span>${file.fileName}</span>`;

      const langTag = document.createElement("span");
      langTag.className = "file-language-tag";
      langTag.textContent = file.lang;

      li.appendChild(nameSpan);
      li.appendChild(langTag);

      li.addEventListener("click", () => openFile(file.id));
      fileList.appendChild(li);
    });
  }

  viewerPlaceholder.classList.remove("hidden");
  codeContainer.classList.add("hidden");
  resetIOPlaceholders();
}

function openFile(fileId) {
  if (!activeFolderKey) return;
  const files = SNIPPETS[activeFolderKey] || [];
  const file = files.find((f) => f.id === fileId);
  if (!file) return;

  activeFileId = fileId;
  currentFileMeta = file;

  clearFileActive();
  const li = fileList.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (li) li.classList.add("active");

  viewerPlaceholder.classList.add("hidden");
  codeContainer.classList.remove("hidden");

  fileNameLabel.textContent = file.fileName;
  fileLangLabel.textContent = file.lang;

  // readonly view initially
  codeEditor.classList.add("hidden");
  codeBlock.parentElement.classList.remove("hidden");
  editButton.textContent = "✏ Edit";

  codeBlock.className = `code-block language-${file.prismLang}`;
  codeBlock.textContent = file.code;
  codeEditor.value = file.code;

  if (window.Prism) {
    Prism.highlightElement(codeBlock);
  }

  // IO behavior
  if (inputBox && outputBox) {
    inputBox.value = "";
    outputBox.value = "";

    const needsInput =
      typeof file.needsInput === "boolean" ? file.needsInput : true;

    if (needsInput) {
      inputBox.readOnly = false;
      inputBox.placeholder =
        "Yahan input likho (stdin)...\nExample: numbers, testcases etc.";
      outputBox.readOnly = true;
      outputBox.placeholder = "Run ke baad output yahan aayega.";
    } else {
      inputBox.readOnly = true;
      inputBox.placeholder =
        "Is program ko input ki zarurat nahi hai.";
      outputBox.readOnly = true;
      outputBox.placeholder = "▶️ Run dabao, output yahan show hoga.";
    }
  }
}

// folder click listeners
folderCards.forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.folder;
    const label =
      card.querySelector(".folder-name")?.textContent || "Folder";
    openFolder(key, label);
  });
});

// edit toggle
editButton.addEventListener("click", () => {
  if (!currentFileMeta) return;

  const isCurrentlyViewOnly = codeEditor.classList.contains("hidden");
  if (isCurrentlyViewOnly) {
    // go to edit mode
    codeEditor.value = codeBlock.textContent;
    codeEditor.classList.remove("hidden");
    codeBlock.parentElement.classList.add("hidden");
    editButton.textContent = "👁 View";
  } else {
    // back to view mode
    codeBlock.textContent = codeEditor.value;
    codeBlock.className = `code-block language-${currentFileMeta.prismLang}`;
    codeBlock.parentElement.classList.remove("hidden");
    codeEditor.classList.add("hidden");
    editButton.textContent = "✏ Edit";
    if (window.Prism) Prism.highlightElement(codeBlock);
  }
});

// download current file
downloadButton.addEventListener("click", () => {
  if (!currentFileMeta) return;
  const currentCode = codeEditor.classList.contains("hidden")
    ? codeBlock.textContent
    : codeEditor.value;

  const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = currentFileMeta.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// run via /run backend API
runButton.addEventListener("click", async () => {
  if (!currentFileMeta || !currentFileMeta.runLang || !outputBox) return;

  const isEditing = !codeEditor.classList.contains("hidden");
  const currentCode = isEditing ? codeEditor.value : codeBlock.textContent;

  const needsInput =
    typeof currentFileMeta.needsInput === "boolean"
      ? currentFileMeta.needsInput
      : true;

  const inputData = needsInput && inputBox ? inputBox.value : "";

  // before run: show status sirf OUTPUT box me
  outputBox.readOnly = true;
  outputBox.value = "⏳ Running...\n";

  try {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: currentFileMeta.runLang, // cpp, c, java, python, javascript...
        code: currentCode,
        stdin: inputData,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      outputBox.value = (data.output || "").trim() || "(no output)";
    } else {
      outputBox.value =
        "❌ Error:\n" + (data.error || "Execution error / compile error.");
    }
  } catch (err) {
    console.error(err);
    outputBox.value = "❌ Network / server error.";
  } finally {
    // input box: sirf needsInput=true wale case me editable rahe
    if (inputBox) {
      inputBox.readOnly = !needsInput;
    }
    outputBox.readOnly = true;
  }
});
