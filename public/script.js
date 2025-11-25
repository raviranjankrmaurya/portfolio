// ====== LANGUAGE CONFIG ======
const LANGS = {
  c: { label: "C", runLang: "c" },
  cpp: { label: "C++", runLang: "cpp" },
  java: { label: "Java", runLang: "java" },
  python: { label: "Python", runLang: "python" },
  javascript: { label: "JavaScript", runLang: "javascript" },
};

// ====== LOCALSTORAGE KEY NAMES ======
const LS_USERS_KEY = "raviranjan_users";
const LS_CURRENT_USER_KEY = "raviranjan_current_user";
const FS_ROOT_KEY = "raviranjan"; // ⭐ yahi "memory file" hai jisme sab code hai

// ====== STATE ======
let currentUser = null; // { name, email, dob, password }
let currentLang = "c";
let currentFiles = []; // all files for current user (all langs)
let currentFileId = null;

// ====== LOCALSTORAGE HELPERS ======

function loadUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(LS_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LS_CURRENT_USER_KEY);
  }
}

function userId(user) {
  return `${user.email}__${user.dob}`;
}

function loadFS() {
  try {
    const raw = localStorage.getItem(FS_ROOT_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function saveFS(fs) {
  localStorage.setItem(FS_ROOT_KEY, JSON.stringify(fs));
}

function loadFilesForUser(user) {
  const fs = loadFS();
  const id = userId(user);
  if (!fs[id] || !Array.isArray(fs[id].files)) return [];
  return fs[id].files;
}

function saveFilesForUser(user, files) {
  const fs = loadFS();
  const id = userId(user);
  fs[id] = fs[id] || {};
  fs[id].files = files;
  saveFS(fs);
}

// ====== DEFAULT STARTER FILES PER LANGUAGE ======

function addDefaultFilesIfMissing() {
  if (!currentUser) return;
  const now = new Date().toISOString();

  const hasLang = (lang) => currentFiles.some((f) => f.lang === lang);

  // C
  if (!hasLang("c")) {
    currentFiles.push({
      id: `default_c_${Date.now()}`,
      lang: "c",
      fileName: "hello.c",
      code: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`,
      stdin: "",
      createdAt: now,
      updatedAt: now,
    });
  }

  // C++
  if (!hasLang("cpp")) {
    currentFiles.push({
      id: `default_cpp_${Date.now() + 1}`,
      lang: "cpp",
      fileName: "hello.cpp",
      code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}`,
      stdin: "",
      createdAt: now,
      updatedAt: now,
    });
  }

  // Java
  if (!hasLang("java")) {
    currentFiles.push({
      id: `default_java_${Date.now() + 2}`,
      lang: "java",
      fileName: "Hello.java",
      code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
      stdin: "",
      createdAt: now,
      updatedAt: now,
    });
  }

  // Python
  if (!hasLang("python")) {
    currentFiles.push({
      id: `default_py_${Date.now() + 3}`,
      lang: "python",
      fileName: "hello.py",
      code: `print("Hello from Python!")`,
      stdin: "",
      createdAt: now,
      updatedAt: now,
    });
  }

  // JavaScript
  if (!hasLang("javascript")) {
    currentFiles.push({
      id: `default_js_${Date.now() + 4}`,
      lang: "javascript",
      fileName: "hello.js",
      code: `console.log("Hello from JavaScript!");`,
      stdin: "",
      createdAt: now,
      updatedAt: now,
    });
  }

  // Defaults ko turant save kar do
  saveFilesForUser(currentUser, currentFiles);
}

// ====== DOM REFERENCES ======

// auth
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const tabRegister = document.getElementById("tabRegister");
const tabLogin = document.getElementById("tabLogin");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const forgotForm = document.getElementById("forgotForm");

const registerStatus = document.getElementById("registerStatus");
const loginStatus = document.getElementById("loginStatus");
const forgotStatus = document.getElementById("forgotStatus");

const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regDob = document.getElementById("regDob");
const regPassword = document.getElementById("regPassword");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const fpEmail = document.getElementById("fpEmail");
const fpDob = document.getElementById("fpDob");
const fpNewPassword = document.getElementById("fpNewPassword");

const forgotToggle = document.getElementById("forgotToggle");
const backToLogin = document.getElementById("backToLogin");

const logoutBtn = document.getElementById("logoutBtn");
const topbarUser = document.getElementById("topbarUser");

// app
const langTabs = document.getElementById("langTabs");
const currentLangLabel = document.getElementById("currentLangLabel");
const fileListEl = document.getElementById("fileList");
const newFileBtn = document.getElementById("newFileBtn");
const openFileBtn = document.getElementById("openFileBtn");
const openFileSelect = document.getElementById("openFileSelect");

const fileNameInput = document.getElementById("fileNameInput");
const codeEditor = document.getElementById("codeEditor");
const inputBox = document.getElementById("inputBox");
const outputBox = document.getElementById("outputBox");
const saveFileBtn = document.getElementById("saveFileBtn");
const runFileBtn = document.getElementById("runFileBtn");
const deleteFileBtn = document.getElementById("deleteFileBtn");
const editorStatus = document.getElementById("editorStatus");
const ownedBadge = document.getElementById("ownedBadge");

// ====== UI HELPERS ======

function showAuth() {
  authSection.classList.remove("hidden");
  appSection.classList.add("hidden");
  logoutBtn.classList.add("hidden");
  topbarUser.classList.add("hidden");
}

function showApp() {
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  if (topbarUser && currentUser) {
    topbarUser.textContent = `${currentUser.name} (${currentUser.email})`;
    topbarUser.classList.remove("hidden");
  }
}

// ====== AUTH TAB SWITCH ======

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  forgotForm.classList.add("hidden");
  registerStatus.textContent = "";
  loginStatus.textContent = "";
  forgotStatus.textContent = "";
});

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  forgotForm.classList.add("hidden");
  registerStatus.textContent = "";
  loginStatus.textContent = "";
  forgotStatus.textContent = "";
});

// Forgot password toggle
forgotToggle.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  forgotForm.classList.remove("hidden");
  forgotStatus.textContent = "";
});

backToLogin.addEventListener("click", () => {
  forgotForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  forgotStatus.textContent = "";
});

// ====== REGISTER ======

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  registerStatus.textContent = "";

  const name = regName.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const dob = regDob.value.trim();
  const password = regPassword.value;

  if (!name || !email || !dob || !password) {
    registerStatus.textContent = "Sab field required hain.";
    return;
  }

  const users = loadUsers();
  if (users.some((u) => u.email === email && u.dob === dob)) {
    registerStatus.textContent =
      "Ye user pehle se register hai. Sign In karo ya forgot password use karo.";
    return;
  }

  const user = { name, email, dob, password };
  users.push(user);
  saveUsers(users);

  currentUser = user;
  saveCurrentUser(user);
  currentFiles = loadFilesForUser(user);

  registerStatus.textContent = "✅ Account created. Logging in...";
  initAppAfterLogin();
});

// ====== LOGIN ======

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginStatus.textContent = "";

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  if (!email || !password) {
    loginStatus.textContent = "Email & password required hain.";
    return;
  }

  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    loginStatus.textContent =
      "Galat credentials. Email/password check karo ya Forgot Password use karo.";
    return;
  }

  currentUser = user;
  saveCurrentUser(user);
  currentFiles = loadFilesForUser(user);

  loginStatus.textContent = "✅ Logged in.";
  initAppAfterLogin();
});

// ====== FORGOT PASSWORD ======

forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  forgotStatus.textContent = "";

  const email = fpEmail.value.trim().toLowerCase();
  const dob = fpDob.value.trim();
  const newPassword = fpNewPassword.value;

  if (!email || !dob || !newPassword) {
    forgotStatus.textContent = "Saare fields required hain.";
    return;
  }

  const users = loadUsers();
  const idx = users.findIndex((u) => u.email === email && u.dob === dob);

  if (idx === -1) {
    forgotStatus.textContent =
      "User nahi mila. Email/DOB check karo ya naya account banao.";
    return;
  }

  users[idx].password = newPassword;
  saveUsers(users);

  forgotStatus.textContent = "✅ Password reset ho gaya. Ab login kar sakte ho.";
});

// ====== LOGOUT ======

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  currentFiles = [];
  currentFileId = null;
  saveCurrentUser(null);
  clearEditor();
  showAuth();
});

// ====== LANG TABS & FILES ======

function setLang(langKey) {
  currentLang = langKey;

  langTabs.querySelectorAll(".lang-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === langKey);
  });

  const label = LANGS[langKey]?.label || langKey.toUpperCase();
  currentLangLabel.textContent = `${label} Files`;

  renderFileList();
  clearEditor();
  populateOpenFileSelect();
}

langTabs.querySelectorAll(".lang-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const langKey = btn.dataset.lang;
    setLang(langKey);
  });
});

function renderFileList() {
  fileListEl.innerHTML = "";
  const filesForLang = currentFiles.filter((f) => f.lang === currentLang);

  if (!filesForLang.length) {
    const li = document.createElement("li");
    li.className = "file-empty";
    li.textContent = "No files yet. New File se create karo.";
    fileListEl.appendChild(li);
    return;
  }

  filesForLang.forEach((file) => {
    const li = document.createElement("li");
    li.className = "file-item";
    li.dataset.id = file.id;

    const nameSpan = document.createElement("span");
    nameSpan.textContent = file.fileName;

    const timeSpan = document.createElement("span");
    timeSpan.style.fontSize = "0.72rem";
    timeSpan.style.color = "#9ca3af";
    const date = file.updatedAt || file.createdAt;
    if (date) {
      const d = new Date(date);
      timeSpan.textContent = d.toLocaleDateString();
    } else {
      timeSpan.textContent = "";
    }

    li.appendChild(nameSpan);
    li.appendChild(timeSpan);

    li.addEventListener("click", () => openFile(file.id));
    fileListEl.appendChild(li);
  });

  if (currentFileId) {
    const activeLi = fileListEl.querySelector(
      `.file-item[data-id="${currentFileId}"]`
    );
    if (activeLi) activeLi.classList.add("active");
  }
}

function populateOpenFileSelect() {
  openFileSelect.innerHTML = "";
  const filesForLang = currentFiles.filter((f) => f.lang === currentLang);

  if (!filesForLang.length) {
    openFileSelect.classList.add("hidden");
    return;
  }

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Select a file to open...";
  openFileSelect.appendChild(defaultOpt);

  filesForLang.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.fileName;
    openFileSelect.appendChild(opt);
  });

  openFileSelect.classList.remove("hidden");
}

openFileBtn.addEventListener("click", () => {
  if (openFileSelect.classList.contains("hidden")) {
    populateOpenFileSelect();
  }
  openFileSelect.focus();
});

openFileSelect.addEventListener("change", () => {
  const id = openFileSelect.value;
  if (id) {
    openFile(id);
  }
});

function openFile(id) {
  currentFileId = id;
  const file = currentFiles.find((f) => f.id === id);
  if (!file) return;

  fileListEl.querySelectorAll(".file-item").forEach((li) => {
    li.classList.toggle("active", li.dataset.id == id);
  });

  fileNameInput.value = file.fileName;
  codeEditor.value = file.code || "";
  inputBox.value = file.stdin || "";
  outputBox.value = file.lastOutput || "";
  editorStatus.textContent = "";
  ownedBadge.classList.remove("hidden");
}

function clearEditor() {
  currentFileId = null;
  fileListEl.querySelectorAll(".file-item").forEach((li) =>
    li.classList.remove("active")
  );
  fileNameInput.value = "";
  codeEditor.value = "";
  inputBox.value = "";
  outputBox.value = "";
  editorStatus.textContent = "";
  ownedBadge.classList.add("hidden");
}

// ====== NEW FILE ======

newFileBtn.addEventListener("click", () => {
  clearEditor();
  editorStatus.textContent =
    "New file mode: file name + code likho, then Save.";
});

// ====== SAVE FILE ======

saveFileBtn.addEventListener("click", () => {
  if (!currentUser) {
    editorStatus.textContent = "Pehle login karo.";
    return;
  }

  const fileName = fileNameInput.value.trim();
  const code = codeEditor.value;
  const stdin = inputBox.value;

  if (!fileName) {
    editorStatus.textContent = "File name required hai.";
    return;
  }
  if (!code.trim()) {
    editorStatus.textContent = "Code khali nahi ho sakta.";
    return;
  }

  const now = new Date().toISOString();

  if (currentFileId) {
    const idx = currentFiles.findIndex((f) => f.id === currentFileId);
    if (idx !== -1) {
      currentFiles[idx] = {
        ...currentFiles[idx],
        fileName,
        code,
        stdin,
        updatedAt: now,
      };
    }
  } else {
    const id = `f_${Date.now()}`;
    const newFile = {
      id,
      lang: currentLang,
      fileName,
      code,
      stdin,
      createdAt: now,
      updatedAt: now,
    };
    currentFiles.push(newFile);
    currentFileId = id;
  }

  saveFilesForUser(currentUser, currentFiles);
  renderFileList();
  populateOpenFileSelect();
  editorStatus.textContent = "✅ Saved.";
  ownedBadge.classList.remove("hidden");
});

// ====== DELETE FILE ======

deleteFileBtn.addEventListener("click", () => {
  if (!currentFileId) {
    editorStatus.textContent = "Koi file selected nahi hai.";
    return;
  }
  const idx = currentFiles.findIndex((f) => f.id === currentFileId);
  if (idx === -1) return;

  currentFiles.splice(idx, 1);
  saveFilesForUser(currentUser, currentFiles);
  clearEditor();
  renderFileList();
  populateOpenFileSelect();
  editorStatus.textContent = "🗑 File deleted.";
});

// ====== RUN FILE (/run API tumhare old format me) ======

runFileBtn.addEventListener("click", async () => {
  if (!currentUser) {
    editorStatus.textContent = "Pehle login karo.";
    return;
  }

  const langConfig = LANGS[currentLang];
  if (!langConfig) {
    editorStatus.textContent = "Language config missing.";
    return;
  }

  const code = codeEditor.value;
  const stdin = inputBox.value;

  if (!code.trim()) {
    editorStatus.textContent = "Code khali hai. Pehle likho.";
    return;
  }

  outputBox.value = "⏳ Running your code...\n";
  editorStatus.textContent = "";

  try {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.runLang, // "c", "cpp", "java", "python", "javascript"
        code,
        stdin,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      outputBox.value = (data.output || "").trim() || "(no output)";
      editorStatus.textContent = "✅ Run successful.";
    } else {
      outputBox.value =
        "❌ Error:\n" + (data.error || "Execution/compile error.");
      editorStatus.textContent = "Run error.";
    }

    if (currentFileId) {
      const idx = currentFiles.findIndex((f) => f.id === currentFileId);
      if (idx !== -1) {
        currentFiles[idx].lastOutput = outputBox.value;
        saveFilesForUser(currentUser, currentFiles);
      }
    }
  } catch (err) {
    console.error(err);
    outputBox.value = "❌ Network / server error.";
    editorStatus.textContent = "Network error.";
  }
});

// ====== INIT AFTER LOGIN ======

function initAppAfterLogin() {
  showApp();
  currentFiles = loadFilesForUser(currentUser);

  // ⭐ yahan default files ensure ho rahi hain
  addDefaultFilesIfMissing();

  setLang(currentLang);
}

// ====== AUTO LOGIN ON LOAD ======

window.addEventListener("DOMContentLoaded", () => {
  const user = loadCurrentUser();
  if (user) {
    currentUser = user;
    currentFiles = loadFilesForUser(user);
    addDefaultFilesIfMissing();
    initAppAfterLogin();
  } else {
    showAuth();
  }
});
