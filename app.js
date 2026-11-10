
const modules = [
  {
    id: "qrhub",
    name: "QR Hub",
    description: "Create QR codes quickly and easily.",
    icon: "📱",
    url: "https://shohelrana15.github.io/image-qr-generator/",
    active: true
  },
  {
    id: "ai",
    name: "AI Assistant",
    description: "Smart AI, voice and intelligent features.",
    icon: "🤖",
    active: false
  }
];

const moduleGrid = document.getElementById("moduleGrid");
const appViewer = document.getElementById("appViewer");
const serviceFrame = document.getElementById("serviceFrame");
const viewerTitle = document.getElementById("viewerTitle");
const backButton = document.getElementById("backButton");
const themeToggle = document.getElementById("themeToggle");
const frameFallback = document.getElementById("frameFallback");
const externalLink = document.getElementById("externalLink");

// Load additional services
let savedModules = [];

try {
  savedModules = JSON.parse(
    localStorage.getItem("srInfinityModules") || "[]"
  );
  if (!Array.isArray(savedModules)) savedModules = [];
} catch {
  savedModules = [];
}

function renderModules() {
  moduleGrid.innerHTML = "";

  [...modules, ...savedModules].forEach(module => {
    const card = document.createElement("div");
    card.className = "module-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");

    const icon = document.createElement("div");
    icon.className = "module-icon";
    icon.textContent = module.icon || "🌐";

    const title = document.createElement("h3");
    title.textContent = module.name;

    const description = document.createElement("p");
    description.textContent = module.description ||
      (module.active ? "Open service" : "Coming Soon");

    card.append(icon, title, description);

    const open = () => {
      if (module.active && module.url) {
        openModule(module);
      } else {
        alert("This service is coming soon!");
      }
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });

    moduleGrid.appendChild(card);
  });

  // Add new service card
  const addCard = document.createElement("div");
  addCard.className = "module-card";
  addCard.tabIndex = 0;
  addCard.setAttribute("role", "button");
  addCard.innerHTML = `
    <div class="module-icon">➕</div>
    <h3>Add New Service</h3>
    <p>Add another website to your Super App.</p>
  `;

  addCard.addEventListener("click", addNewModule);
  moduleGrid.appendChild(addCard);
}

// Open service inside the app
function openModule(module) {
  viewerTitle.textContent = module.name;
  serviceFrame.src = module.url;

  externalLink.href = module.url;
  frameFallback.hidden = true;

  moduleGrid.parentElement.hidden = true;
  document.querySelector(".hero").hidden = true;
  appViewer.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Return to Dashboard
function closeModule() {
  appViewer.hidden = true;
  moduleGrid.parentElement.hidden = false;
  document.querySelector(".hero").hidden = false;

  serviceFrame.src = "about:blank";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

backButton.addEventListener("click", closeModule);

// Add future website
function addNewModule() {
  const name = prompt("Enter service name:");
  if (!name || !name.trim()) return;

  const url = prompt("Enter website URL (https://):");
  if (!url) return;

  let validURL;

  try {
    validURL = new URL(url.trim());
  } catch {
    alert("Invalid website URL!");
    return;
  }

  if (validURL.protocol !== "https:") {
    alert("Only HTTPS websites are allowed.");
    return;
  }

  const newModule = {
    id: "custom-" + Date.now(),
    name: name.trim(),
    description: "Your new digital service.",
    icon: "🌐",
    url: validURL.href,
    active: true
  };

  savedModules.push(newModule);

  try {
    localStorage.setItem(
      "srInfinityModules",
      JSON.stringify(savedModules)
    );
  } catch {
    savedModules.pop();
    alert("Could not save service. Browser storage may be full.");
    return;
  }

  renderModules();
}

// Dark / Light Mode
function updateTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode"
  );
}

const savedTheme = localStorage.getItem("srInfinityTheme");
updateTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");

  updateTheme(dark);
  localStorage.setItem(
    "srInfinityTheme",
    dark ? "dark" : "light"
  );
});

// Initialize Dashboard
renderModules();

// Register Service Worker
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .catch(error => console.error("Service Worker:", error));
  });
}

