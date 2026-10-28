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

const viewerRoot = document.getElementById("viewerRoot");
let currentAudio = null;

function decodeStoryFromHash() {
  const hash = window.location.hash || "";
  const match = hash.match(/story=([^&]+)/);

  if (!match) {
    return structuredClone(defaultStory);
  }

  try {
    const decoded = decodeURIComponent(match[1]);
    const raw = atob(decoded);
    const text = decodeURIComponent(escape(raw));
    return JSON.parse(text);
  } catch (_error) {
    return structuredClone(defaultStory);
  }
}

let currentIndex = 0;
let story = decodeStoryFromHash();

function normalizeAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function getPageTheme(page) {
  return {
    accent1: page?.theme?.accent1 || "#ff5fa7",
    accent2: page?.theme?.accent2 || "#8ed8ff",
    text: page?.theme?.text || "#2d2b42",
    card: page?.theme?.card || "#ffffff"
  };
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

function playPageAudio(page) {
  stopCurrentAudio();
  if (!page || !page.musicUrl) return;

  const audio = new Audio(page.musicUrl);
  audio.loop = true;
  audio.autoplay = true;
  audio.volume = 0.7;
  currentAudio = audio;

  audio.play().catch(() => {
    // browser will often allow playback only after user interaction; the clue flow begins after click so this is okay
  });
}

function applyThemeToElement(element) {
  const theme = story.theme || defaultTheme;
  element.style.setProperty("--page-accent-1", theme.accent1 || defaultTheme.accent1);
  element.style.setProperty("--page-accent-2", theme.accent2 || defaultTheme.accent2);
  element.style.setProperty("--page-bg-1", theme.bg1 || defaultTheme.bg1);
  element.style.setProperty("--page-bg-2", theme.bg2 || defaultTheme.bg2);
  element.style.setProperty("--page-text", theme.text || defaultTheme.text);
  element.style.setProperty("--page-card", theme.card || defaultTheme.card);
}

function renderLanding() {
  stopCurrentAudio();
  applyThemeToElement(viewerRoot);
  viewerRoot.innerHTML = `
    <div class="story-shell">
      <div class="story-landing">
        <div class="badge">${story.occasion || "Birthday"}</div>
        <h1>${story.title || "For My Favourite Human"}</h1>
        <p>${story.landingMessage || "A tiny love letter..."}</p>
        <button class="cta" id="startQuestBtn">${story.cta || "Start the adventure"}</button>
      </div>
    </div>
  `;

  document.getElementById("startQuestBtn").addEventListener("click", () => {
    renderCluePage();
  });
}

function renderCluePage() {
  const page = story.pages[currentIndex];
  if (!page) {
    renderFinalPage();
    return;
  }

  const theme = getPageTheme(page);
  playPageAudio(page);

  const musicMarkup = page.musicUrl
    ? `<div class="music-player">
         <div class="music-chip">🎵 page soundtrack</div>
         <audio controls loop autoplay src="${page.musicUrl}"></audio>
       </div>`
    : "";

  const photoMarkup = page.photoUrl
    ? `<img class="story-photo" src="${page.photoUrl}" alt="${page.title || "Memory"}" />`
    : "";

  const cardStyle = `background: linear-gradient(135deg, ${theme.card} 0%, rgba(255,255,255,0.86) 100%); border-color: ${theme.accent1}44; --card-accent-1: ${theme.accent1}; --card-accent-2: ${theme.accent2}; color: ${theme.text};`;

  applyThemeToElement(viewerRoot);
  viewerRoot.innerHTML = `
    <div class="story-shell dissolve-shell" style="background: linear-gradient(135deg, ${theme.accent1}10 0%, ${theme.accent2}18 55%, rgba(255,255,255,0.9) 100%);">
      <div class="story-page">
        <div class="topline">
          <span class="page-tag">Clue ${currentIndex + 1}</span>
          <span class="counter">${currentIndex + 1}/${story.pages.length}</span>
        </div>
        <div class="story-card" id="clueCard" style="${cardStyle}">
          <h2>${page.title || "New Clue"}</h2>
          <p>${page.clue || ""}</p>
          ${photoMarkup}
          ${musicMarkup}
          <div class="answer-box">
            <label for="answerInput">Your answer</label>
            <input id="answerInput" type="text" placeholder="Type your guess here..." />
            <div class="answer-status" id="answerStatus"></div>
          </div>
          <div class="reveal-box">${page.answer || "Reveal the answer here."}</div>
        </div>
        <div class="story-actions">
          <button class="ghost-btn" id="backBtn">${currentIndex === 0 ? "Home" : "Back"}</button>
          <button class="primary-btn-small" id="revealBtn">Check answer</button>
        </div>
      </div>
    </div>
  `;

  const clueCard = document.getElementById("clueCard");
  const revealBtn = document.getElementById("revealBtn");
  const backBtn = document.getElementById("backBtn");
  const answerInput = document.getElementById("answerInput");
  const answerStatus = document.getElementById("answerStatus");

  revealBtn.addEventListener("click", () => {
    const userGuess = normalizeAnswer(answerInput.value);
    const correctGuess = normalizeAnswer(page.answer);

    if (userGuess === correctGuess) {
      clueCard.classList.add("revealed");
      answerStatus.textContent = "Correct! ✨";
      answerStatus.classList.add("success");
      revealBtn.textContent = currentIndex === story.pages.length - 1 ? "Finish" : "Next Clue";
      revealBtn.onclick = () => {
        currentIndex += 1;
        if (currentIndex >= story.pages.length) {
          renderFinalPage();
        } else {
          renderCluePage();
        }
      };
    } else {
      answerStatus.textContent = "Not quite — try again 💭";
      answerStatus.classList.remove("success");
    }
  });

  backBtn.addEventListener("click", () => {
    if (currentIndex === 0) {
      stopCurrentAudio();
      renderLanding();
    } else {
      currentIndex -= 1;
      renderCluePage();
    }
  });
}

function renderFinalPage() {
  stopCurrentAudio();
  applyThemeToElement(viewerRoot);
  viewerRoot.innerHTML = `
    <div class="story-shell final-shell">
      <div class="final-message">
        <h2>Happy Birthday, Vidhi 💖</h2>
        <p>Every clue was just a tiny reminder that the best part of my life is you. I hope this little game makes you smile the way you make my world brighter every day.</p>
      </div>
    </div>
  `;
}

renderLanding();
