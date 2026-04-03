function $(id) { return document.getElementById(id); }

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  $(`screen${name}`).classList.remove("hidden");
}

function showError(msg) {
  const bar = $("errorBar");
  bar.textContent = "⚠️ " + msg;
  bar.classList.remove("hidden");
}

function hideError() {
  $("errorBar").classList.add("hidden");
}

let extractedJD = null;
let resumeFile  = null;

document.addEventListener("DOMContentLoaded", async () => {
  showScreen("Input");
  tryExtractJD();
  setupUpload();
  setupButtons();
});

async function tryExtractJD() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url || "";

    const isLinkedIn = url.includes("linkedin.com/jobs");
    const isNaukri   = url.includes("naukri.com");

    if (!isLinkedIn && !isNaukri) {
      showJDNotFound();
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { action: "getJD" });

    if (response && response.jd && response.jd.length > 50) {
      extractedJD = response.jd;
      showJDFound(extractedJD);
    } else {
      showJDNotFound();
    }

  } catch (err) {
    showJDNotFound();
  }
}

function showJDFound(jd) {
  $("jdStatus").classList.add("hidden");
  $("jdNotFound").classList.add("hidden");
  $("jdPreview").classList.remove("hidden");
  $("jdPreviewText").textContent = jd.slice(0, 300) + "...";
  checkCanAnalyse();
}

function showJDNotFound() {
  $("jdStatus").classList.add("hidden");
  $("jdPreview").classList.add("hidden");
  $("jdNotFound").classList.remove("hidden");
}

function setupUpload() {
  const uploadArea  = $("uploadArea");
  const resumeInput = $("resumeInput");

  uploadArea.addEventListener("click", () => resumeInput.click());

  resumeInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  uploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    uploadArea.style.borderColor = "#bf7fff";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#2a2a50";
  });

  uploadArea.addEventListener("drop", e => {
    e.preventDefault();
    uploadArea.style.borderColor = "#2a2a50";
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  $("filePillRemove").addEventListener("click", () => {
    resumeFile = null;
    resumeInput.value = "";
    $("filePill").classList.add("hidden");
    $("uploadArea").classList.remove("hidden");
    checkCanAnalyse();
  });
}

function handleFile(file) {
  if (file.type !== "application/pdf") {
    showError("Please upload a PDF file.");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showError("File too large. Max 10MB.");
    return;
  }

  resumeFile = file;
  hideError();

  $("uploadArea").classList.add("hidden");
  $("filePillName").textContent = file.name;
  $("filePillMeta").textContent = (file.size / 1024).toFixed(1) + " KB · PDF";
  $("filePill").classList.remove("hidden");

  checkCanAnalyse();
}

function checkCanAnalyse() {
  $("btnAnalyse").disabled = !(extractedJD && resumeFile);
}

function setupButtons() {
  $("btnAnalyse").addEventListener("click", runAnalysis);
  $("btnAgain").addEventListener("click", () => {
    resumeFile   = null;
    extractedJD  = null;
    $("filePill").classList.add("hidden");
    $("uploadArea").classList.remove("hidden");
    $("jdPreview").classList.add("hidden");
    $("jdStatus").classList.remove("hidden");
    $("jdNotFound").classList.add("hidden");
    $("btnAnalyse").disabled = true;
    hideError();
    showScreen("Input");
    tryExtractJD();
  });
}

async function runAnalysis() {
  if (!extractedJD || !resumeFile) return;

  hideError();
  showScreen("Loading");
  startLoadingAnimation();

  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", extractedJD);

    const res = await fetch("https://resumatch-backend-hbfn.onrender.com/api/match/", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "API error");
    }

    const data = await res.json();
    renderResults(data);

  } catch (err) {
    showScreen("Input");
    showError(
      err.message.includes("fetch")
        ? "Cannot reach Django. Make sure it's running on port 8000."
        : err.message
    );
  }
}

function startLoadingAnimation() {
  const steps = document.querySelectorAll(".loading-step");
  let current = 0;

  steps.forEach(s => s.classList.remove("active"));
  steps[0].classList.add("active");

  const interval = setInterval(() => {
    current++;
    if (current >= steps.length) {
      clearInterval(interval);
      return;
    }
    steps.forEach(s => s.classList.remove("active"));
    steps[current].classList.add("active");
  }, 900);
}

function renderResults(data) {
  showScreen("Results");

  const score = Math.round(data.score ?? 0);

  const circ   = 2 * Math.PI * 48;  
  const offset = circ - (score / 100) * circ;
  const arc    = $("ringArc");
  const col    = score >= 75 ? "#bf7fff" : score >= 50 ? "#4de8b8" : "#ff5f5f";

  arc.style.stroke            = col;
  $("ringNum").style.color    = col;
  $("scoreVerdict").style.color = col;

  setTimeout(() => { arc.style.strokeDashoffset = offset; }, 100);

  animateCount($("ringNum"), score);

  const verdict = getVerdict(score);
  $("scoreVerdict").textContent = verdict.label;
  $("scoreDesc").textContent    = verdict.desc;

  animateBar("barSkill", "pctSkill", data.skill_score);
  animateBar("barText",  "pctText",  data.text_score);
  animateBar("barExp",   "pctExp",   data.experience_score);
  animateBar("barProj",  "pctProj",  data.projects_score);

  renderChips("missingSkills", data.missing_skills, "chip-missing",
    "No missing skills — great match! 🎉");
  renderChips("matchedSkills", data.matched_skills, "chip-matched",
    "No matched skills found.");

  const list = $("suggestionsList");
  list.innerHTML = "";
  if (data.suggestions?.length) {
    data.suggestions.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "suggestion-item";
      div.innerHTML = `
        <span class="suggestion-num">0${i + 1}</span>
        <span>${s}</span>
      `;
      list.appendChild(div);
    });
  } else {
    list.innerHTML = `<span class="chip-empty">No suggestions — your resume looks great!</span>`;
  }
}

function getVerdict(s) {
  if (s >= 85) return { label: "Excellent Match",  desc: "You're a standout candidate for this role." };
  if (s >= 70) return { label: "Strong Match",     desc: "Good fit. A few tweaks will make it bulletproof." };
  if (s >= 50) return { label: "Moderate Match",   desc: "Some gaps detected. Check the suggestions below." };
  return        { label: "Low Match",              desc: "Significant gaps. Use the suggestions to improve." };
}

function animateCount(el, target, duration = 1200) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p    = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function animateBar(barId, pctId, value) {
  const v = Math.round(value ?? 0);
  setTimeout(() => {
    $(barId).style.width = v + "%";
    $(pctId).textContent = v + "%";
  }, 200);
}

function renderChips(containerId, skills, cls, emptyMsg) {
  const wrap = $(containerId);
  wrap.innerHTML = "";
  if (skills?.length) {
    skills.forEach(s => {
      const span = document.createElement("span");
      span.className = `chip ${cls}`;
      span.textContent = s;
      wrap.appendChild(span);
    });
  } else {
    wrap.innerHTML = `<span class="chip-empty">${emptyMsg}</span>`;
  }
}

