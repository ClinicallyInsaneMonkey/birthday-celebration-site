const defaultTheme = {
  accent1: "#ff5fa7",
  accent2: "#8ed8ff",
  bg1: "#fff8fc",
  bg2: "#eef9ff",
  text: "#2d2b42",
  card: "#ffffff"
};

const defaultStory = {
  occasion: "Vidhi's Birthday",
  title: "For My Favourite Human",
  landingMessage:
    "A tiny love letter before the adventure begins... each page hides a clue, a memory, and a little piece of us. Are you ready to follow the trail of my heart?",
  cta: "Start the adventure",
  theme: { ...defaultTheme },
  pages: [
    {
      title: "The First Clue",
      hint: "Think of the first time I saw you and how everything suddenly felt a little brighter.",
      clue: "You are the calm to my chaos and the sparkle in my ordinary days.",
      answer: "You make my world feel softer and more beautiful.",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      theme: {
        accent1: "#ff7bac",
        accent2: "#90d7ff",
        text: "#2d2b42",
        card: "#ffffff"
      }
    },
    {
      title: "Our Favourite Memory",
      hint: "Where do I always want to be when the world feels loud?",
      clue: "It is not the place, it is the person who makes even silence feel magical.",
      answer: "With you. Always.",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      theme: {
        accent1: "#ff9ad1",
        accent2: "#8bc4ff",
        text: "#2d2b42",
        card: "#fff9fd"
      }
    },
    {
      title: "The Biggest Truth",
      hint: "What is the one constant in all my hearts' little adventures?",
      clue: "No matter where life takes me, you are the one thing I always want to choose again.",
      answer: "You are my forever favourite person.",
      musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      photoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
      theme: {
        accent1: "#ff82c4",
        accent2: "#a6c3ff",
        text: "#2d2b42",
        card: "#ffffff"
      }
    }
  ]
};

const state = {
  story: loadStoryFromStorage() || structuredClone(defaultStory)
};

const refs = {
  occasionInput: document.getElementById("occasionInput"),
  titleInput: document.getElementById("titleInput"),
  landingMessageInput: document.getElementById("landingMessageInput"),
  ctaInput: document.getElementById("ctaInput"),
  themeAccent1Input: document.getElementById("themeAccent1Input"),
  themeAccent2Input: document.getElementById("themeAccent2Input"),
  themeBg1Input: document.getElementById("themeBg1Input"),
  themeBg2Input: document.getElementById("themeBg2Input"),
  themeTextInput: document.getElementById("themeTextInput"),
  themeCardInput: document.getElementById("themeCardInput"),
  pagesContainer: document.getElementById("pagesContainer"),
  livePreview: document.getElementById("livePreview"),
  addPageBtn: document.getElementById("addPageBtn"),
  publishBtn: document.getElementById("publishBtn"),
  openViewerBtn: document.getElementById("openViewerBtn"),
  resetDataBtn: document.getElementById("resetDataBtn")
};

function loadStoryFromStorage() {
  try {
    const raw = localStorage.getItem("loveQuestStory");
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function saveStoryToStorage() {
  localStorage.setItem("loveQuestStory", JSON.stringify(state.story));
}

function getPageTheme(page) {
  return {
    accent1: page.theme?.accent1 || "#ff5fa7",
    accent2: page.theme?.accent2 || "#8ed8ff",
    text: page.theme?.text || "#2d2b42",
    card: page.theme?.card || "#ffffff"
  };
}

function syncColorInputsFromTheme() {
  const theme = state.story.theme || defaultTheme;
  refs.themeAccent1Input.value = theme.accent1 || defaultTheme.accent1;
  refs.themeAccent2Input.value = theme.accent2 || defaultTheme.accent2;
  refs.themeBg1Input.value = theme.bg1 || defaultTheme.bg1;
  refs.themeBg2Input.value = theme.bg2 || defaultTheme.bg2;
  refs.themeTextInput.value = theme.text || defaultTheme.text;
  refs.themeCardInput.value = theme.card || defaultTheme.card;
}

function applyThemeToElement(element) {
  const theme = state.story.theme || defaultTheme;
  element.style.setProperty("--page-accent-1", theme.accent1 || defaultTheme.accent1);
  element.style.setProperty("--page-accent-2", theme.accent2 || defaultTheme.accent2);
  element.style.setProperty("--page-bg-1", theme.bg1 || defaultTheme.bg1);
  element.style.setProperty("--page-bg-2", theme.bg2 || defaultTheme.bg2);
  element.style.setProperty("--page-text", theme.text || defaultTheme.text);
  element.style.setProperty("--page-card", theme.card || defaultTheme.card);
}

function syncInputsFromStory() {
  refs.occasionInput.value = state.story.occasion || "";
  refs.titleInput.value = state.story.title || "";
  refs.landingMessageInput.value = state.story.landingMessage || "";
  refs.ctaInput.value = state.story.cta || "";
  syncColorInputsFromTheme();
  renderPages();
  renderPreview();
}

function getNewPage() {
  return {
    title: "New Clue",
    hint: "A secret only your heart can decode.",
    clue: "This is where your hidden message goes.",
    answer: "Reveal the answer here.",
    musicUrl: "",
    photoUrl: "",
    theme: {
      accent1: "#ff82c4",
      accent2: "#a9d9ff",
      text: "#2d2b42",
      card: "#ffffff"
    }
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderPages() {
  refs.pagesContainer.innerHTML = "";

  state.story.pages.forEach((page, index) => {
    const template = document.getElementById("pageTemplate");
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".page-card");
    const pageNumber = clone.querySelector(".page-number");
    const titleInput = clone.querySelector(".page-title-input");
    const hintInput = clone.querySelector(".page-hint-input");
    const clueInput = clone.querySelector(".page-clue-input");
    const musicFileInput = clone.querySelector(".page-music-file");
    const musicInput = clone.querySelector(".page-music-input");
    const photoInput = clone.querySelector(".page-photo-input");
    const answerInput = clone.querySelector(".page-answer-input");
    const accent1Input = clone.querySelector(".page-accent1-input");
    const accent2Input = clone.querySelector(".page-accent2-input");

    const pageTheme = getPageTheme(page);

    pageNumber.textContent = `Page ${index + 1}`;
    titleInput.value = page.title || "";
    hintInput.value = page.hint || "";
    clueInput.value = page.clue || "";
    musicInput.value = page.musicUrl || "";
    photoInput.value = page.photoUrl || "";
    answerInput.value = page.answer || "";
    accent1Input.value = pageTheme.accent1;
    accent2Input.value = pageTheme.accent2;

    card.dataset.index = String(index);

    titleInput.addEventListener("input", () => {
      state.story.pages[index].title = titleInput.value;
      renderPreview();
      saveStoryToStorage();
    });

    hintInput.addEventListener("input", () => {
      state.story.pages[index].hint = hintInput.value;
      renderPreview();
      saveStoryToStorage();
    });

    clueInput.addEventListener("input", () => {
      state.story.pages[index].clue = clueInput.value;
      renderPreview();
      saveStoryToStorage();
    });

    accent1Input.addEventListener("input", () => {
      state.story.pages[index].theme = state.story.pages[index].theme || {};
      state.story.pages[index].theme.accent1 = accent1Input.value;
      renderPreview();
      saveStoryToStorage();
    });

    accent2Input.addEventListener("input", () => {
      state.story.pages[index].theme = state.story.pages[index].theme || {};
      state.story.pages[index].theme.accent2 = accent2Input.value;
      renderPreview();
      saveStoryToStorage();
    });

    musicInput.addEventListener("input", () => {
      state.story.pages[index].musicUrl = musicInput.value.trim();
      renderPreview();
      saveStoryToStorage();
    });

    musicFileInput.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const dataUrl = await readFileAsDataUrl(file);
        state.story.pages[index].musicUrl = dataUrl;
        musicInput.value = dataUrl;
        renderPreview();
        saveStoryToStorage();
      } catch (_error) {
        alert("This file could not be added. Please try a different audio file.");
      }
    });

    photoInput.addEventListener("input", () => {
      state.story.pages[index].photoUrl = photoInput.value.trim();
      renderPreview();
      saveStoryToStorage();
    });

    answerInput.addEventListener("input", () => {
      state.story.pages[index].answer = answerInput.value;
      renderPreview();
      saveStoryToStorage();
    });

    clone.querySelector(".delete-page-btn").addEventListener("click", () => {
      if (state.story.pages.length > 1) {
        state.story.pages.splice(index, 1);
        saveStoryToStorage();
        syncInputsFromStory();
      }
    });

    clone.querySelector(".move-up-btn").addEventListener("click", () => {
      if (index > 0) {
        [state.story.pages[index - 1], state.story.pages[index]] = [state.story.pages[index], state.story.pages[index - 1]];
        saveStoryToStorage();
        syncInputsFromStory();
      }
    });

    clone.querySelector(".move-down-btn").addEventListener("click", () => {
      if (index < state.story.pages.length - 1) {
        [state.story.pages[index], state.story.pages[index + 1]] = [state.story.pages[index + 1], state.story.pages[index]];
        saveStoryToStorage();
        syncInputsFromStory();
      }
    });

    refs.pagesContainer.appendChild(clone);
  });
}

function renderPreview() {
  refs.livePreview.innerHTML = "";
  applyThemeToElement(refs.livePreview);

  const shell = document.createElement("div");
  shell.className = "story-shell";

  const pageCount = state.story.pages.length;

  const landing = document.createElement("div");
  landing.className = "story-landing";
  landing.innerHTML = `
    <div class="badge">${state.story.occasion || "Birthday"}</div>
    <h1>${state.story.title || "For My Favourite Human"}</h1>
    <p>${state.story.landingMessage || "A tiny love letter..."}</p>
    <button class="cta">${state.story.cta || "Start the adventure"}</button>
  `;

  shell.appendChild(landing);

  state.story.pages.forEach((page, index) => {
    const storyPage = document.createElement("div");
    storyPage.className = "story-page";
    const theme = getPageTheme(page);
    storyPage.style.setProperty("--page-accent-1", theme.accent1);
    storyPage.style.setProperty("--page-accent-2", theme.accent2);
    storyPage.style.setProperty("--page-text", theme.text);
    storyPage.style.setProperty("--page-card", theme.card);

    const musicBadge = page.musicUrl ? `<div class="music-badge">🎵 music assigned</div>` : "";
    const photoMarkup = page.photoUrl ? `<img class="story-photo" src="${page.photoUrl}" alt="${page.title || "Memory"}" />` : "";

    storyPage.innerHTML = `
      <div class="topline">
        <span class="page-tag">Clue ${index + 1}</span>
        <span class="counter">${index + 1}/${pageCount}</span>
      </div>
      <div class="story-card" style="background: linear-gradient(135deg, ${theme.card} 0%, rgba(255,255,255,0.86) 100%); border-color: ${theme.accent1}44;">
        <h2>${page.title || "New Clue"}</h2>
        <p>${page.hint || "A secret only your heart can decode."}</p>
        ${photoMarkup}
        ${musicBadge}
        <div class="reveal-box">${page.answer || "The reveal goes here."}</div>
      </div>
      <div class="story-actions">
        <button class="ghost-btn">Back</button>
        <button class="primary-btn-small">${index < pageCount - 1 ? "Next Clue" : "Finish"}</button>
      </div>
    `;
    shell.appendChild(storyPage);
  });

  const finalMessage = document.createElement("div");
  finalMessage.className = "final-message";
  finalMessage.innerHTML = `
    <h2>Happy Birthday, Vidhi 💖</h2>
    <p>Every clue was just a tiny reminder that the best part of my life is you. I hope this little game makes you smile the way you make my world brighter every day.</p>
  `;
  shell.appendChild(finalMessage);

  refs.livePreview.appendChild(shell);
}

function updateStoryFromForm() {
  state.story.occasion = refs.occasionInput.value.trim() || defaultStory.occasion;
  state.story.title = refs.titleInput.value.trim() || defaultStory.title;
  state.story.landingMessage = refs.landingMessageInput.value.trim() || defaultStory.landingMessage;
  state.story.cta = refs.ctaInput.value.trim() || defaultStory.cta;
  state.story.theme = state.story.theme || { ...defaultTheme };
  state.story.theme.accent1 = refs.themeAccent1Input.value;
  state.story.theme.accent2 = refs.themeAccent2Input.value;
  state.story.theme.bg1 = refs.themeBg1Input.value;
  state.story.theme.bg2 = refs.themeBg2Input.value;
  state.story.theme.text = refs.themeTextInput.value;
  state.story.theme.card = refs.themeCardInput.value;
  saveStoryToStorage();
  renderPreview();
}

function publishStory() {
  const storyState = JSON.stringify(state.story);
  const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(storyState))));
  const shareUrl = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, "") || "/" }viewer.html#story=${encoded}`;

  const urlField = document.createElement("input");
  urlField.value = shareUrl;
  document.body.appendChild(urlField);
  urlField.select();
  document.execCommand("copy");
  document.body.removeChild(urlField);

  alert(`Shareable viewer link copied to clipboard:\n${shareUrl}`);
}

function openViewer() {
  const storyState = JSON.stringify(state.story);
  const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(storyState))));
  const shareUrl = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, "") || "/" }viewer.html#story=${encoded}`;
  window.open(shareUrl, "_blank");
}

function resetDemo() {
  state.story = structuredClone(defaultStory);
  saveStoryToStorage();
  syncInputsFromStory();
}

refs.occasionInput.addEventListener("input", updateStoryFromForm);
refs.titleInput.addEventListener("input", updateStoryFromForm);
refs.landingMessageInput.addEventListener("input", updateStoryFromForm);
refs.ctaInput.addEventListener("input", updateStoryFromForm);
refs.themeAccent1Input.addEventListener("input", updateStoryFromForm);
refs.themeAccent2Input.addEventListener("input", updateStoryFromForm);
refs.themeBg1Input.addEventListener("input", updateStoryFromForm);
refs.themeBg2Input.addEventListener("input", updateStoryFromForm);
refs.themeTextInput.addEventListener("input", updateStoryFromForm);
refs.themeCardInput.addEventListener("input", updateStoryFromForm);
refs.addPageBtn.addEventListener("click", () => {
  state.story.pages.push(getNewPage());
  saveStoryToStorage();
  syncInputsFromStory();
});
refs.publishBtn.addEventListener("click", publishStory);
refs.openViewerBtn.addEventListener("click", openViewer);
refs.resetDataBtn.addEventListener("click", resetDemo);

syncInputsFromStory();
