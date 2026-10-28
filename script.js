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

const state = {
  story: loadStoryFromStorage() || structuredClone(defaultStory)
};

const refs = {
  occasionInput: document.getElementById("occasionInput"),
  titleInput: document.getElementById("titleInput"),
  landingMessageInput: document.getElementById("landingMessageInput"),
  ctaInput: document.getElementById("ctaInput"),
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

function syncInputsFromStory() {
  refs.occasionInput.value = state.story.occasion || "";
  refs.titleInput.value = state.story.title || "";
  refs.landingMessageInput.value = state.story.landingMessage || "";
  refs.ctaInput.value = state.story.cta || "";
  renderPages();
  renderPreview();
}

function getNewPage() {
  return {
    title: "New Clue",
    hint: "A secret only your heart can decode.",
    clue: "This is where your hidden message goes.",
    answer: "Reveal the answer here."
  };
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
    const answerInput = clone.querySelector(".page-answer-input");

    pageNumber.textContent = `Page ${index + 1}`;
    titleInput.value = page.title || "";
    hintInput.value = page.hint || "";
    clueInput.value = page.clue || "";
    answerInput.value = page.answer || "";

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

  const shell = document.createElement("div");
  shell.className = "story-shell";

  const firstPage = state.story.pages[0];
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
    storyPage.innerHTML = `
      <div class="topline">
        <span class="page-tag">Clue ${index + 1}</span>
        <span class="counter">${index + 1}/${pageCount}</span>
      </div>
      <div class="story-card">
        <h2>${page.title || "New Clue"}</h2>
        <p>${page.hint || "A secret only your heart can decode."}</p>
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
refs.addPageBtn.addEventListener("click", () => {
  state.story.pages.push(getNewPage());
  saveStoryToStorage();
  syncInputsFromStory();
});
refs.publishBtn.addEventListener("click", publishStory);
refs.openViewerBtn.addEventListener("click", openViewer);
refs.resetDataBtn.addEventListener("click", resetDemo);

syncInputsFromStory();
