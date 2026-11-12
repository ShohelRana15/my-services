/* ===== SERVICES =====
   To activate a service: set active:true and add its url. */
const modules = [
  { id: "qrhub", name: "QR Hub", lines: ["Generate & Scan", "QR Codes"], icon: "qr", color: 0,
    url: "https://shohelrana15.github.io/image-qr-generator/", active: true },
  { id: "ai", name: "AI Assistant", lines: ["Your Smart", "AI Helper"], icon: "ai", color: 1, active: false },
  { id: "browser", name: "Web Browser", lines: ["Browse Websites", "Inside App"], icon: "globe", color: 2, active: false },
  { id: "image", name: "Image Tools", lines: ["Edit & Convert", "Images"], icon: "image", color: 3, active: false },
  { id: "pdf", name: "PDF Tools", lines: ["Create & Edit", "PDF Files"], icon: "pdf", color: 4, active: false }
];

const IC = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
  star: '<path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7.2-6.4-3.7-6.4 3.7 1.7-7.2L2 9.6 9 9z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  gear: '<circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v1M17 20h4M14 20v1"/>',
  ai: '<rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 4v4M9 14h.1M15 14h.1M2 13v3M22 13v3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.5 3.5 3.5 14.5 0 18M12 3c-3.5 3.5-3.5 14.5 0 18"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/>',
  pdf: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5M9 15h6M9 18h4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  sun: '<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  moon: '<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z" fill="currentColor"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/>'
};
const svg = n => `<svg class="i" viewBox="0 0 24 24">${IC[n]}</svg>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = id => document.getElementById(id);

const moduleGrid = $("moduleGrid"), appViewer = $("appViewer"), serviceFrame = $("serviceFrame");
const viewerTitle = $("viewerTitle"), backButton = $("backButton"), themeToggle = $("themeToggle");
const frameFallback = $("frameFallback"), externalLink = $("externalLink");

/* ===== Safe storage ===== */
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
};
let savedModules = store.get("srInfinityModules", []);
if (!Array.isArray(savedModules)) savedModules = [];
let favs = store.get("srInfinityFavs", []);
let hist = store.get("srInfinityHistory", []);
let userName = store.get("srInfinityName", "Md.Jahangir Alam Sarker");
$("userName").textContent = userName;

function toast(t) {
  const e = $("toast"); e.textContent = t; e.style.display = "block";
  clearTimeout(toast.t); toast.t = setTimeout(() => e.style.display = "none", 2600);
}
function icons(root) {
  (root || document).querySelectorAll("[data-i]").forEach(el => {
    el.insertAdjacentHTML("beforebegin", svg(el.dataset.i).replace('class="i"', 'class="i ' + (el.className || "") + '"'));
    el.remove();
  });
}

/* ===== Cards ===== */
const allModules = () => [...modules, ...savedModules.map(m => ({ ...m, icon: "globe", color: 5 }))];

function renderModules() {
  const q = $("search").value.toLowerCase().trim();
  moduleGrid.innerHTML = "";
  const list = allModules().filter(m => !q || (m.name + " " + (m.lines || [m.description || ""]).join(" ")).toLowerCase().includes(q));
  if (!list.length) { moduleGrid.innerHTML = "<p>No service found.</p>"; return; }

  list.forEach(module => {
    const card = document.createElement("div");
    card.className = "module-card c" + (module.color ?? 5);
    const lines = module.lines || [module.description || (module.active ? "Open service" : "Coming Soon")];
    card.innerHTML = `
      <button class="fv ${favs.includes(module.id) ? "on" : ""}" aria-label="Favorite">${svg("star")}</button>
      <div class="module-icon">${svg(module.icon || "globe")}</div>
      <h3>${esc(module.name)}</h3>
      <p>${lines.map(esc).join("<br>")}</p>
      <button class="open">Open ${svg("arrow")}</button>`;
    card.querySelector(".fv").onclick = () => toggleFav(module.id);
    card.querySelector(".open").onclick = () => openService(module);
    moduleGrid.appendChild(card);
  });
}
function toggleFav(id) {
  favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
  store.set("srInfinityFavs", favs); renderModules();
}
function openService(module) {
  if (module.active && module.url) {
    hist.unshift({ id: module.id, name: module.name, t: Date.now() });
    hist = hist.slice(0, 30); store.set("srInfinityHistory", hist);
    openModule(module);
  } else toast(module.name + " is coming soon!");
}

/* ===== Viewer (full screen) ===== */
function openModule(module) {
  viewerTitle.textContent = module.name;
  serviceFrame.src = module.url;
  externalLink.href = module.url;
  frameFallback.hidden = true;
  appViewer.hidden = false;
}
function closeModule() {
  appViewer.hidden = true;
  serviceFrame.src = "about:blank";
}
backButton.addEventListener("click", closeModule);

/* ===== Add service ===== */
function addNewModule() {
  const name = prompt("Enter service name:");
  if (!name || !name.trim()) return;
  const url = prompt("Enter website URL (https://):");
  if (!url) return;
  let validURL;
  try { validURL = new URL(url.trim()); } catch { alert("Invalid website URL!"); return; }
  if (validURL.protocol !== "https:") { alert("Only HTTPS websites are allowed."); return; }
  savedModules.push({ id: "custom-" + Date.now(), name: name.trim(), description: "Your new digital service.", icon: "🌐", url: validURL.href, active: true });
  if (!store.set("srInfinityModules", savedModules)) {
    savedModules.pop(); alert("Could not save service. Browser storage may be full."); return;
  }
  renderModules(); toast("Service added");
}

/* ===== Sidebar & panels ===== */
const NAV = [["home", "Dashboard", "dash"], ["grid", "My Services", "svc"], ["star", "Favorites", "favs", "ic-y"],
  ["clock", "History", "hist", "ic-p"], ["gear", "Settings", "settings"], ["info", "About", "about"], ["help", "Help &amp; Support", "help"]];
$("nav").innerHTML = NAV.map((n, i) => `<button class="${i ? "" : "on"} ${n[3] || ""}" data-k="${n[2]}">${svg(n[0])}<span>${n[1]}</span></button>`).join("");
$("nav").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  document.body.classList.remove("nav");
  const k = b.dataset.k;
  if (k === "dash") scrollTo({ top: 0, behavior: "smooth" });
  else if (k === "svc") $("services").scrollIntoView({ behavior: "smooth" });
  else panel(k);
};
$("menuBtn").onclick = () => document.body.classList.add("nav");
$("scrim").onclick = () => document.body.classList.remove("nav");

function modal(title, html, init) {
  $("modTitle").textContent = title; $("modBody").innerHTML = html;
  $("mod").classList.add("on"); init && init();
}
function closeModal() { $("mod").classList.remove("on"); }
$("modClose").onclick = closeModal;
$("mod").onclick = e => { if (e.target.id === "mod") closeModal(); };
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function listOf(items, empty) {
  return items.length ? items.join("") : `<p>${empty}</p>`;
}
function panel(k) {
  if (k === "favs") {
    const items = favs.map(id => allModules().find(m => m.id === id)).filter(Boolean)
      .map(m => `<div class="li"><span>${esc(m.name)}</span><button data-open="${esc(m.id)}">Open</button></div>`);
    modal("Favorites", listOf(items, "No favorites yet. Tap the star on any service card."), bindOpen);
  } else if (k === "hist") {
    const items = hist.map(h => `<div class="li"><span>${esc(h.name)}</span><small>${new Date(h.t).toLocaleString()}</small></div>`);
    modal("History", listOf(items, "No history yet.") + (hist.length ? '<button class="go" id="clr">Clear history</button>' : ""),
      () => { const c = $("clr"); if (c) c.onclick = () => { hist = []; store.set("srInfinityHistory", []); panel("hist"); }; });
  } else if (k === "settings") {
    modal("Settings", `<label>Your name<input id="sn" value="${esc(userName)}"></label>
      <label>Theme<select id="st"><option value="dark">Dark</option><option value="light">Light</option></select></label>
      <div class="row"><button class="go" id="ss">Save</button><button class="go" id="sc">Reset app data</button></div>`, () => {
      $("st").value = document.body.classList.contains("light") ? "light" : "dark";
      $("ss").onclick = () => { userName = $("sn").value.trim() || userName; store.set("srInfinityName", userName);
        $("userName").textContent = userName; updateTheme($("st").value === "dark"); store.set("srInfinityTheme", $("st").value); toast("Saved"); };
      $("sc").onclick = () => { if (!confirm("Remove added services, favorites and history?")) return;
        savedModules = []; favs = []; hist = [];
        ["srInfinityModules", "srInfinityFavs", "srInfinityHistory"].forEach(x => store.set(x, [])); renderModules(); toast("Data cleared"); };
    });
  } else if (k === "about") {
    modal("About", "<p><b>SR Infinity Super App</b></p><p>All your digital services in one place. Version 1.0.</p>");
  } else if (k === "help") {
    modal("Help &amp; Support", "<p>• Tap Open on a card to use a service.</p><p>• Tap the star to save a favorite.</p><p>• Use Add Service to add your own website.</p><p>• Tap Install App to add this app to your home screen.</p>");
  }
}
function bindOpen() {
  document.querySelectorAll("[data-open]").forEach(b => b.onclick = () => {
    const m = allModules().find(x => x.id === b.dataset.open); closeModal(); if (m) openService(m);
  });
}
document.querySelectorAll("[data-panel]").forEach(b => b.onclick = () => panel(b.dataset.panel));
$("addService").onclick = addNewModule;
$("viewAll").onclick = $("exploreMore").onclick = () => {
  modal("All Services", allModules().map(m => `<div class="li"><span>${esc(m.name)}</span><button data-open="${esc(m.id)}">Open</button></div>`).join(""), bindOpen);
};
$("search").oninput = renderModules;

/* ===== Install ===== */
let deferredPrompt;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });
document.querySelectorAll("[data-install]").forEach(b => b.onclick = async () => {
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
  else toast("Use your browser menu: Install app / Add to Home screen");
});

/* ===== Dark / Light Mode (dark is the default) ===== */
function updateTheme(dark) {
  document.body.classList.toggle("light", !dark);
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}
updateTheme(store.get("srInfinityTheme", "dark") !== "light");
themeToggle.addEventListener("click", () => {
  const dark = document.body.classList.contains("light");
  updateTheme(dark);
  store.set("srInfinityTheme", dark ? "dark" : "light");
});

/* ===== Init ===== */
icons();
renderModules();

/* ===== Service Worker ===== */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => console.error("Service Worker:", error));
  });
}
