// ===== Navbar / basic stuff =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

function onScroll() {
  const scrollPos = window.scrollY + 100;
  sections.forEach((sec) => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav a[href="#${sec.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}
window.addEventListener("scroll", onScroll);

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Contact form =====
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "Sending...";
  const formData = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    message: contactForm.message.value.trim(),
  };

  try {
    const res = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
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

/* ========= Code Library (folders + online compiler) ========= */

const SNIPPETS = window.SNIPPETS || {};

// DOM refs
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
const outputBox = document.getElementById("outputBox");
const outputText = document.getElementById("outputText");

let activeFolderKey = null;
let activeFileId = null;
let currentFileMeta = null;
let isEditing = false;

function clearFileActive() {
  fileList.querySelectorAll(".file-item").forEach((li) => {
    li.classList.remove("active");
  });
}

function openFolder(folderKey, folderLabel) {
  activeFolderKey = folderKey;
  activeFileId = null;
  currentFileMeta = null;
  isEditing = false;

  folderCards.forEach((card) => card.classList.remove("active"));
  const activeCard = document.querySelector(`.folder-card[data-folder="${folderKey}"]`);
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
  outputBox.classList.add("hidden");
}

function openFile(fileId) {
  if (!activeFolderKey) return;
  const files = SNIPPETS[activeFolderKey] || [];
  const file = files.find((f) => f.id === fileId);
  if (!file) return;

  activeFileId = fileId;
  currentFileMeta = file;
  isEditing = false;

  clearFileActive();
  const li = fileList.querySelector(`.file-item[data-file-id="${fileId}"]`);
  if (li) li.classList.add("active");

  viewerPlaceholder.classList.add("hidden");
  codeContainer.classList.remove("hidden");
  outputBox.classList.add("hidden");

  fileNameLabel.textContent = file.fileName;
  fileLangLabel.textContent = file.lang;

  // readonly view initially
  codeEditor.classList.add("hidden");
  codeBlock.parentElement.classList.remove("hidden");
  editButton.textContent = "✏ Edit";

  codeBlock.className = `language-${file.prismLang}`;
  codeBlock.textContent = file.code;
  codeEditor.value = file.code;

  if (window.Prism) {
    Prism.highlightElement(codeBlock);
  }
}

// Folder click
folderCards.forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-folder");
    const label = card.querySelector(".folder-name")?.textContent || "Folder";
    openFolder(key, label);
  });
});

// ===== Edit toggle =====
editButton.addEventListener("click", () => {
  if (!currentFileMeta) return;
  isEditing = !isEditing;

  if (isEditing) {
    codeEditor.value = codeBlock.textContent;
    codeEditor.classList.remove("hidden");
    codeBlock.parentElement.classList.add("hidden");
    editButton.textContent = "👁 View";
  } else {
    codeBlock.textContent = codeEditor.value;
    codeBlock.className = `language-${currentFileMeta.prismLang}`;
    codeBlock.parentElement.classList.remove("hidden");
    codeEditor.classList.add("hidden");
    editButton.textContent = "✏ Edit";
    if (window.Prism) {
      Prism.highlightElement(codeBlock);
    }
  }

  outputBox.classList.add("hidden");
});

// ===== Download current code =====
downloadButton.addEventListener("click", () => {
  if (!currentFileMeta) return;
  const currentCode = isEditing ? codeEditor.value : codeBlock.textContent;
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

// ===== Run via backend /run (online compiler API) =====
runButton.addEventListener("click", async () => {
  // language mapping meta check
  if (!currentFileMeta || !currentFileMeta.runLang) return;

  // code editor / view se current code lo
  const isEditing = !codeEditor.classList.contains("hidden");
  const currentCode = isEditing ? codeEditor.value : codeBlock.textContent;

  // console box (jahan user input likhega + output dekhega)
  const consoleBox = document.getElementById("consoleBox");
  const inputData = consoleBox ? consoleBox.value : "";

  // Run se pehle status dikhao
  if (consoleBox) {
    consoleBox.value =
      (inputData ? "▶️ Input:\n" + inputData + "\n\n" : "") + "⏳ Running...\n";
  }

  try {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: currentFileMeta.runLang, // "cpp", "c", "java", "python", "javascript"
        code: currentCode,
        stdin: inputData
      })
    });

    const data = await res.json();

    if (consoleBox) {
      if (res.ok && data.success) {
        consoleBox.value =
          (inputData ? "▶️ Input:\n" + inputData + "\n\n" : "") +
          "✅ Output:\n" +
          (data.output || "(no output)");
      } else {
        consoleBox.value =
          (inputData ? "▶️ Input:\n" + inputData + "\n\n" : "") +
          "❌ Error:\n" +
          (data.error || "Execution error.");
      }
    }
  } catch (err) {
    console.error(err);
    if (consoleBox) {
      consoleBox.value =
        (inputData ? "▶️ Input:\n" + inputData + "\n\n" : "") +
        "❌ Network / server error.";
    }
  }
});
