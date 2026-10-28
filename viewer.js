const defaultStory = {
  occasion: "Vidhi's Birthday",
  title: "For My Favourite Human",
  landingMessage:
    "A tiny love letter before the adventure begins... each page hides a clue, a memory, and a little piece of us. Are you ready to follow the trail of my heart?",
  cta: "Start the adventure",
  pages: [
    {
      title: "The First Clue",
      hint: "Think of the first time I saw you and how everything suddenly felt a little brighter.",
      clue: "You are the calm to my chaos and the sparkle in my ordinary days.",
      answer: "You make my world feel softer and more beautiful."
    },
    {
      title: "Our Favourite Memory",
      hint: "Where do I always want to be when the world feels loud?",
      clue: "It is not the place, it is the person who makes even silence feel magical.",
      answer: "With you. Always."
    },
    {
      title: "The Biggest Truth",
      hint: "What is the one constant in all my hearts’ little adventures?",
      clue: "No matter where life takes me, you are the one thing I always want to choose again.",
      answer: "You are my forever favourite person."
    }
  ]
};

const viewerRoot = document.getElementById("viewerRoot");

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

function renderLanding() {
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

  document.getElementById("startQuestBtn").addEventListener("click", renderCluePage);
}

function renderCluePage() {
  const page = story.pages[currentIndex];
  if (!page) {
    renderFinalPage();
    return;
  }

  viewerRoot.innerHTML = `
    <div class="story-shell">
      <div class="story-page">
        <div class="topline">
          <span class="page-tag">Clue ${currentIndex + 1}</span>
          <span class="counter">${currentIndex + 1}/${story.pages.length}</span>
        </div>
        <div class="story-card" id="clueCard">
          <h2>${page.title || "New Clue"}</h2>
          <p>${page.clue || ""}</p>
          <div class="reveal-box">${page.answer || "Reveal the answer here."}</div>
        </div>
        <div class="story-actions">
          <button class="ghost-btn" id="backBtn">${currentIndex === 0 ? "Home" : "Back"}</button>
          <button class="primary-btn-small" id="revealBtn">${currentIndex === story.pages.length - 1 ? "Reveal" : "Reveal"}</button>
        </div>
      </div>
    </div>
  `;

  const clueCard = document.getElementById("clueCard");
  const revealBtn = document.getElementById("revealBtn");
  const backBtn = document.getElementById("backBtn");

  revealBtn.addEventListener("click", () => {
    clueCard.classList.add("revealed");
    revealBtn.textContent = currentIndex === story.pages.length - 1 ? "Finish" : "Next Clue";
    revealBtn.onclick = () => {
      currentIndex += 1;
      if (currentIndex >= story.pages.length) {
        renderFinalPage();
      } else {
        renderCluePage();
      }
    };
  });

  backBtn.addEventListener("click", () => {
    if (currentIndex === 0) {
      renderLanding();
    } else {
      currentIndex -= 1;
      renderCluePage();
    }
  });
}

function renderFinalPage() {
  viewerRoot.innerHTML = `
    <div class="story-shell">
      <div class="final-message">
        <h2>Happy Birthday, Vidhi 💖</h2>
        <p>Every clue was just a tiny reminder that the best part of my life is you. I hope this little game makes you smile the way you make my world brighter every day.</p>
      </div>
    </div>
  `;
}

renderLanding();
