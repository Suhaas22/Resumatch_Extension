function extractLinkedInJD() {
  // Updated selectors for LinkedIn's current HTML structure
  const selectors = [
    // Most common current selectors
    ".jobs-description__content .jobs-box__html-content",
    ".jobs-description__content",
    ".jobs-box__html-content",
    ".job-details-jobs-unified-top-card__job-insight",
    ".jobs-description",
    ".jobs-description-content__text",
    // Fallback — grab any element with 'description' in class
    "[class*='description__text']",
    "[class*='job-description']",
    "[class*='jobDescription']",
    "[class*='description-content']",
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim().length > 100) {
      return el.innerText.trim();
    }
  }

  // Last resort — find the longest text block on the page
  // LinkedIn always has the JD as a large text block
  const allDivs = document.querySelectorAll("div, section, article");
  let longest = "";

  for (const div of allDivs) {
    // Only look at leaf-ish nodes, skip huge containers
    const text = div.innerText?.trim() || "";
    if (
      text.length > longest.length &&
      text.length > 200 &&
      text.length < 8000 &&
      div.children.length < 15
    ) {
      longest = text;
    }
  }

  return longest.length > 200 ? longest : null;
}

function extractNaukriJD() {
  const selectors = [
    ".job-desc",
    ".dang-inner-html",
    ".jobDescriptionPage",
    ".job-description",
    "[class*='jobDescription']",
    "[class*='job-desc']",
    "[class*='description']",
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim().length > 100) {
      return el.innerText.trim();
    }
  }

  // Last resort fallback for Naukri too
  const allDivs = document.querySelectorAll("div, section");
  let longest = "";

  for (const div of allDivs) {
    const text = div.innerText?.trim() || "";
    if (
      text.length > longest.length &&
      text.length > 200 &&
      text.length < 8000 &&
      div.children.length < 15
    ) {
      longest = text;
    }
  }

  return longest.length > 200 ? longest : null;
}

function extractJD() {
  const url = window.location.href;

  if (url.includes("linkedin.com")) {
    return extractLinkedInJD();
  } else if (url.includes("naukri.com")) {
    return extractNaukriJD();
  }
  return null;
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getJD") {
    const jd = extractJD();
    sendResponse({ jd: jd, url: window.location.href });
  }
  return true;
});