<div align="center">

<img src="https://img.shields.io/badge/ResuMatch-AI%20Resume%20Analyzer-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white" alt="ResuMatch"/>

# 🎯 ResuMatch — AI-Powered Resume Analyzer

### *Know your match. Close the gap. Land the job.*

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://github.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-REST%20API-092E20?style=flat-square&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Accuracy](https://img.shields.io/badge/Accuracy-84.8%25-22c55e?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square)](LICENSE)

<br/>

> **Built by a student, for every student tired of applying blindly.**  
> ResuMatch tells you *exactly* how well your resume matches a job — and what to fix.

<br/>

---

</div>

## 📌 The Problem

Every job seeker has been there:

- You spend hours tailoring your resume
- You hit **Apply** on 50+ listings
- You hear **nothing back**

The brutal truth? Most resumes never make it past the ATS (Applicant Tracking System) because of a skills gap you didn't even know existed.

**ResuMatch fixes that — before you apply.**

---

## ✨ What It Does

ResuMatch is a **browser extension + full-stack AI system** that:

1. 🔍 **Auto-extracts** job descriptions from LinkedIn and Naukri — no copy-pasting
2. 📄 **Analyzes** your uploaded resume against the job description using NLP
3. 📊 **Scores** your resume-job match in real time
4. 🧩 **Highlights** the exact skills and keywords you're missing
5. 💡 **Helps you optimize** your resume before hitting Apply

---

## 🚀 Demo

```
[Open LinkedIn Job] → [Click ResuMatch Extension] → [Upload Resume] → [Get Match Score + Gap Report]
```

> 🎥 *Demo video / screenshots coming soon*

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension (JS)                     │
│         Auto-extracts JD from LinkedIn / Naukri             │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP POST (JD + Resume)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Django REST API (Backend)                   │
│    • PyMuPDF → Resume text extraction                       │
│    • TF-IDF Vectorization                                   │
│    • Cosine Similarity scoring                              │
│    • Skills gap detection                                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ JSON Response
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (UI)                       │
│    • Match score display                                    │
│    • Missing skills breakdown                               │
│    • Resume improvement suggestions                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Model Performance

Evaluated on **2,484 real-world resume-job pairs** across **24 industry domains**.

| Metric | Score |
|---|---|
| Pairwise Ranking Accuracy | **84.8%** |
| Precision | ✅ Measured |
| Recall | ✅ Measured |
| F1-Score | ✅ Measured |
| Dataset Size | 2,484 samples |
| Industry Domains | 24 |

> The model was evaluated using standard IR (Information Retrieval) metrics to ensure reliability beyond simple accuracy.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Browser Extension | JavaScript, Chrome Extension API |
| Frontend | React.js |
| Backend | Django, Django REST Framework |
| NLP Engine | TF-IDF, Cosine Similarity (scikit-learn) |
| Resume Parsing | PyMuPDF |
| Job Sites Supported | LinkedIn, Naukri |

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google Chrome

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resumatch.git
cd resumatch
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Load the Chrome Extension

```
1. Open Chrome → Go to chrome://extensions/
2. Enable "Developer Mode" (top right toggle)
3. Click "Load unpacked"
4. Select the /extension folder from this repo
5. Pin ResuMatch to your toolbar ✅
```

---

## 🧪 How It Works

### Step 1 — Text Extraction
- **Resume**: PyMuPDF extracts raw text from uploaded PDF
- **Job Description**: Chrome extension scrapes JD directly from LinkedIn/Naukri page DOM

### Step 2 — NLP Processing
```python
# TF-IDF Vectorization
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])

# Cosine Similarity Score
similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
match_score = round(float(similarity[0][0]) * 100, 2)
```

### Step 3 — Skills Gap Detection
- Extracts keywords from JD that are **absent** in resume
- Ranks them by TF-IDF weight (most important missing skills first)

### Step 4 — Results Delivered
- Match % score
- Top missing keywords/skills
- Actionable suggestions

---

## 📁 Project Structure

```
resumatch/
│
├── backend/                  # Django REST API
│   ├── api/
│   │   ├── views.py          # Resume + JD processing logic
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── nlp/
│   │   ├── matcher.py        # TF-IDF + Cosine Similarity engine
│   │   └── extractor.py      # PyMuPDF resume parser
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                 # React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── MatchScore.jsx
│   │   │   ├── SkillsGap.jsx
│   │   │   └── UploadResume.jsx
│   │   └── App.jsx
│   └── package.json
│
├── extension/                # Chrome Extension
│   ├── manifest.json
│   ├── content.js            # JD scraper (LinkedIn + Naukri)
│   ├── popup.html
│   └── popup.js
│
└── README.md
```

---

## 🗺️ Roadmap

- [x] TF-IDF + Cosine Similarity matching engine
- [x] Chrome Extension with LinkedIn & Naukri support
- [x] Django REST API backend
- [x] React frontend
- [ ] BERT / Sentence-Transformer upgrade for semantic matching
- [ ] ATS simulation mode
- [ ] Resume rewrite suggestions using LLMs
- [ ] Firefox extension support
- [ ] User dashboard with application history

---

## 🤝 Contributing

Contributions are welcome! If you have ideas to improve ResuMatch:

```bash
1. Fork the repo
2. Create your feature branch → git checkout -b feature/your-feature
3. Commit your changes → git commit -m "Add: your feature"
4. Push to the branch → git push origin feature/your-feature
5. Open a Pull Request
```

---

## 📬 Contact

**Made with 💙 by [Your Name]**

- 🔗 [LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 [GitHub](https://github.com/yourusername)
- 📧 youremail@example.com

---

<div align="center">

*If ResuMatch helped you, consider giving it a ⭐ — it means a lot as a student builder!*

</div>