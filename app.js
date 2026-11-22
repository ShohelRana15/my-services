/*!
 * SR Infinity Super App
 * © 2026 SR Infinity. All rights reserved.
 * This source code is proprietary. Do not copy, modify, distribute, sell or
 * use it to build a similar app without written permission. See LICENSE.
 */
/* ===== SERVICES =====
   To activate a service: set active:true and add its url. */
const modules = [
  { id: "qrhub", name: "QR Hub", lines: ["Generate & Scan", "QR Codes"], icon: "qr", color: 0,
    url: "https://shohelrana15.github.io/image-qr-generator/", active: true },
  { id: "ai", name: "AI Assistant", lines: ["Your Smart", "AI Helper"], icon: "ai", color: 1, active: false },
  { id: "browser", name: "Web Browser", lines: ["Browse Websites", "Inside App"], icon: "globe", color: 2, active: false },
  { id: "image", name: "Image Tools", lines: ["Edit & Convert", "Images"], icon: "image", color: 3, active: false },
  { id: "Scanner", name: "Scanner Tools", lines: ["Scan & Edit", "Download Now"], icon: "Scanner", color: 4,
    url: "https://www.camscanner.com/file/recent?login_type=home&login_from_part=CSOfficialHome&login_from=tab_click", active: true }
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
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  userplus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6.5 7-6.5M19 8v6M16 11h6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 4-.9"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>'
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
const allModules = () => [...modules, ...savedModules.map(m => ({ ...m, icon: m.icon || "🌐", color: 5 }))];

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
      <div class="module-icon">${IC[module.icon] ? svg(module.icon) : `<span class="emo">${esc(module.icon || "🌐")}</span>`}</div>
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

/* ===== Sidebar & panels ===== */
const NAV = [["home", "Dashboard", "dash"], ["grid", "My Services", "svc"], ["star", "Favorites", "favs", "ic-y"],
  ["clock", "History", "hist", "ic-p"], ["gear", "Settings", "settings"], ["info", "About", "about"], ["help", "Help &amp; Support", "help"]];
$("nav").innerHTML = NAV.map((n, i) => (i === 0 ? '<div class="nlab">Main</div>' : i === 4 ? '<div class="nlab">More</div>' : "") + `<button class="${i ? "" : "on"} ${n[3] || ""}" data-k="${n[2]}">${svg(n[0])}<span>${n[1]}</span></button>`).join("");
$("nav").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  document.body.classList.remove("nav"); go(b.dataset.k);
};
$("menuBtn").onclick = () => document.body.classList.add("nav");
$("scrim").onclick = () => document.body.classList.remove("nav");

function modal(title, html, init, wide) {
  $("modTitle").textContent = title; $("modBody").innerHTML = html;
  $("mod").classList.toggle("wide", !!wide); $("mod").classList.add("on"); init && init();
}
function closeModal() { $("mod").classList.remove("on", "wide"); setActive(pageKey); }
$("modClose").onclick = closeModal;
$("mod").onclick = e => { if (e.target.id === "mod") closeModal(); };
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function listOf(items, empty) {
  return items.length ? items.join("") : `<p>${empty}</p>`;
}
let pageKey = "dash";
function setActive(k) { document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.k === k)); }
let scrollRaf = 0;
function smoothTo(y, dur) {
  const max = document.documentElement.scrollHeight - innerHeight, start = scrollY, to = Math.max(0, Math.min(y, max)), dist = to - start;
  cancelAnimationFrame(scrollRaf); if (Math.abs(dist) < 2) return;
  dur = dur || Math.min(900, 450 + Math.abs(dist) * 0.25);
  const t0 = performance.now(), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = now => { const t = Math.min(1, (now - t0) / dur); scrollTo(0, start + dist * ease(t)); if (t < 1) scrollRaf = requestAnimationFrame(step); };
  scrollRaf = requestAnimationFrame(step);
}
const stopScroll = () => cancelAnimationFrame(scrollRaf);
addEventListener("wheel", stopScroll, { passive: true }); addEventListener("touchstart", stopScroll, { passive: true });
function ring(el) {
  const r = el.getBoundingClientRect(), d = document.createElement("div");
  d.className = "rgbring";
  d.style.cssText = `left:${r.left + scrollX - 6}px;top:${r.top + scrollY - 6}px;width:${r.width + 12}px;height:${r.height + 12}px`;
  d.innerHTML = '<div class="rg-glow"><i></i></div><i></i>';
  document.body.appendChild(d); setTimeout(() => d.remove(), 3700);
}
function go(k) {
  setActive(k);
  if (k === "dash" || k === "svc") {
    pageKey = k;
    const el = $(k === "dash" ? "dash" : "services");
    smoothTo(k === "dash" ? 0 : el.getBoundingClientRect().top + scrollY - 16);
    ring(el);
  } else panel(k);
}
function bindOpen(root) {
  (root || document).querySelectorAll("[data-open]").forEach(b => b.onclick = () => {
    const m = allModules().find(x => x.id === b.dataset.open); closeModal(); if (m) openService(m);
  });
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
    openSettings();
  } else if (k === "about") {
    modal("About", "<p><b>SR Infinity Super App</b></p><p>All your digital services in one place.</p><p>Version: " + (loadedVersion ? "v" + loadedVersion : "–") + "</p>");
  } else if (k === "help") {
    modal("Help &amp; Support", "<p>• Tap Open on a card to use a service.</p><p>• Tap the star to save a favorite.</p><p>• Use Add Service to add your own website.</p><p>• Use Upgrade in the sidebar to see plans and payment methods.</p>");
  }
}

/* ===== Upgrade: plans & Bangladesh payment methods (DEMO – connect real API later) ===== */
let bill = "m";
const PLANS = [
  { id: "free", n: "Free", p: 0, f: ["Core services", "QR Hub", "Community support"] },
  { id: "pro", n: "Pro", p: 199, hot: 1, f: ["All Free features", "Unlimited favorites", "Cloud backup", "Priority support"] },
  { id: "prem", n: "Premium", p: 499, f: ["All Pro features", "AI Assistant access", "Early access to new tools", "24/7 support"] }
];
const PAY = [
  { id: "bkash", n: "bKash", c: "#e2136e", t: "Mobile wallet" }, { id: "nagad", n: "Nagad", c: "#f6921e", t: "Mobile wallet" },
  { id: "rocket", n: "Rocket", c: "#8c3494", t: "Mobile wallet" }, { id: "upay", n: "Upay", c: "#e0a500", t: "Mobile wallet" },
  { id: "card", n: "Card", c: "#3b82f6", t: "Visa / Mastercard" }, { id: "bank", n: "Bank transfer", c: "#10b981", t: "Direct deposit" }
];
const taka = n => "৳" + n.toLocaleString("en-US");
const planPrice = p => bill === "m" ? p.p : p.p * 10;
const DEMO = '<div class="note">Demo only – no real payment is processed. A real payment gateway API will be connected later.</div>';
function plans() {
  const cur = store.get("srInfinityPlan", "free");
  modal("Upgrade your plan", `<div class="bill"><button data-b="m" class="${bill === "m" ? "on" : ""}">Monthly</button><button data-b="y" class="${bill === "y" ? "on" : ""}">Yearly <small>2 months free</small></button></div>
  <div class="plans">${PLANS.map(p => `<div class="plan ${p.hot ? "hot" : ""}">${p.hot ? "<em>Popular</em>" : ""}<h4>${p.n}</h4>
  <div class="pr">${taka(planPrice(p))}<small>/${bill === "m" ? "month" : "year"}</small></div><ul>${p.f.map(x => `<li>✓ ${x}</li>`).join("")}</ul>
  <button class="go" data-plan="${p.id}">${p.id === cur ? "Current plan" : p.p ? "Choose " + p.n : "Free plan"}</button></div>`).join("")}</div>
  <small>Prices in Bangladeshi Taka (BDT).</small>${DEMO}`, () => {
    const mb = $("modBody");
    mb.querySelectorAll("[data-b]").forEach(b => b.onclick = () => { bill = b.dataset.b; plans(); });
    mb.querySelectorAll("[data-plan]").forEach(b => b.onclick = () => {
      const p = PLANS.find(x => x.id === b.dataset.plan);
      if (!p.p || p.id === cur) toast(p.id === cur ? "This is your current plan" : "You are on the Free plan"); else payMethods(p);
    });
  }, true);
}
function payMethods(p) {
  modal("Choose payment method", `<button class="back" id="bk">← Back to plans</button><p><b>${p.n}</b> – ${taka(planPrice(p))} / ${bill === "m" ? "month" : "year"}</p>
  <div class="pay">${PAY.map(m => `<button data-pm="${m.id}"><i style="background:${m.c}">${m.n[0]}</i>${m.n}<small>${m.t}</small></button>`).join("")}</div>${DEMO}`, () => {
    $("bk").onclick = plans;
    $("modBody").querySelectorAll("[data-pm]").forEach(b => b.onclick = () => payForm(p, PAY.find(m => m.id === b.dataset.pm)));
  }, true);
}
function payForm(p, m) {
  const wallet = ["bkash", "nagad", "rocket", "upay"].includes(m.id), amt = taka(planPrice(p));
  let body;
  if (wallet) body = `<p>1. Open the ${m.n} app and choose <b>Send Money / Payment</b>.</p><p>2. Send <b>${amt}</b> to the merchant number <b>01XXXXXXXXX</b> (placeholder).</p><p>3. Enter your number and the Transaction ID below.</p>
    <label>Your ${m.n} number<input id="pn" inputmode="numeric" placeholder="01XXXXXXXXX" maxlength="11"></label><label>Transaction ID (TrxID)<input id="px" placeholder="e.g. 8N7A6D5EE1"></label>`;
  else if (m.id === "card") body = "<p>Card payments (Visa / Mastercard) will be available once the payment gateway is connected. For now, please choose a mobile wallet.</p>";
  else body = "<p>Bank transfer details will be added here (account name, number and branch). For now, please choose a mobile wallet.</p>";
  modal(m.n + " payment", `<button class="back" id="bk">← Back to methods</button><p><b>${p.n}</b> – ${amt}</p>${body}${DEMO}${wallet ? '<button class="go" id="pc">Confirm payment</button>' : ""}`, () => {
    $("bk").onclick = () => payMethods(p);
    if (!wallet) return;
    $("pc").onclick = () => {
      if (!/^01[3-9]\d{8}$/.test($("pn").value.trim())) return toast("Enter a valid 11-digit Bangladeshi mobile number");
      if (!/^[A-Za-z0-9]{6,}$/.test($("px").value.trim())) return toast("Enter a valid Transaction ID");
      store.set("srInfinityPlan", p.id);
      modal("Request received", `<p>✅ Thank you! Your <b>${p.n}</b> request has been recorded (demo).</p>${DEMO}<button class="go" onclick="closeModal()">Done</button>`);
    };
  }, true);
}
$("upBtn").onclick = plans;

const TICK = ["✨ Welcome to SR Infinity Super App – Everything You Need. One Super App.", "💎 Upgrade to Pro and unlock premium tools", "🚀 New services are coming soon – stay tuned", "💙 স্বাগতম! আপনার সব ডিজিটাল সার্ভিস এক জায়গায়"];
$("tk").innerHTML = (TICK.map(t => `<span>${esc(t)}</span>`).join("")).repeat(2);
document.querySelectorAll("[data-panel]").forEach(b => b.onclick = () => go(b.dataset.panel));
$("addService").onclick = () => addService();
$("viewAll").onclick = $("exploreMore").onclick = () => {
  modal("All Services", allModules().map(m => `<div class="li"><span>${esc(m.name)}</span><button data-open="${esc(m.id)}">Open</button></div>`).join(""), bindOpen);
};
$("search").oninput = renderModules;

/* ===== Install ===== */
let deferredPrompt;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });
document.querySelectorAll("[data-install]").forEach(b => b.onclick = () => installGuide());
addEventListener("appinstalled", () => { deferredPrompt = null; try { localStorage.setItem("srInstalled", "1"); } catch (e) {} toast("App installed ✓"); });

/* ===== Dark / Light Mode (dark is the default) ===== */
function updateTheme(dark) {
  document.body.classList.toggle("light", !dark);
  const st = $("st"); if (st) st.value = dark ? "dark" : "light";
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


let pe=null,pr=0;document.addEventListener('pointermove',e=>{pe=e;if(pr)return;pr=1;requestAnimationFrame(()=>{pr=0;const c=pe.target.closest&&pe.target.closest('.module-card,.box');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',(pe.clientX-r.left)+'px');c.style.setProperty('--my',(pe.clientY-r.top)+'px')})},{passive:true});

(()=>{const g0=document.getElementById('moduleGrid');
if(matchMedia('(hover:hover)').matches){const g=document.createElement('div');g.className='glow';document.body.appendChild(g);let x=innerWidth/2,y=200,tx=x,ty=y;let run=0;const f=()=>{x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform='translate3d('+x+'px,'+y+'px,0)';if(Math.abs(tx-x)+Math.abs(ty-y)>.5)requestAnimationFrame(f);else run=0};addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!run){run=1;requestAnimationFrame(f)}},{passive:true})}
g0.addEventListener('pointermove',e=>{const c=e.target.closest('.module-card');if(!c)return;const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;c.style.setProperty('--rx',((.5-py)*10).toFixed(2)+'deg');c.style.setProperty('--ry',((px-.5)*12).toFixed(2)+'deg')});
g0.addEventListener('pointerout',e=>{const c=e.target.closest('.module-card');if(c){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});
document.querySelectorAll('nav button').forEach((b,i)=>b.style.animationDelay=(.1+i*.05)+'s');

})();

(()=>{let t,r=document.documentElement;addEventListener('scroll',()=>{r.classList.add('sc');clearTimeout(t);t=setTimeout(()=>r.classList.remove('sc'),140)},{passive:true})})();

/* ===== Service Worker + Auto-update ===== */
let swReg = null, loadedVersion = null, updating = false;
const VKEY = "srAppVersion";
async function fetchVersion() {
  try {
    const r = await fetch("version.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json(); return j && j.version != null ? String(j.version) : null;
  } catch (e) { return null; }
}
function updBar(t) {
  let b = $("updbar");
  if (!b) { b = document.createElement("div"); b.id = "updbar"; document.body.appendChild(b); }
  b.textContent = t; b.hidden = !t;
}
function safeToReload() {
  const a = document.activeElement;
  const typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== "checkbox" && a.value;
  const authBusy = !$("auth").hidden && [...$("auth").querySelectorAll("input")].some(i => i.type !== "checkbox" && i.value);
  return !($("mod").classList.contains("on") || !appViewer.hidden || typing || authBusy);
}
function applyUpdate(v) {
  if (updating) return; updating = true;
  const run = async () => {
    if (!safeToReload()) { updBar("New version found – it will update when you finish."); return setTimeout(run, 4000); }
    updBar("Updating to the new version…");
    try { localStorage.setItem(VKEY, v); } catch (e) {}
    try { for (const k of await caches.keys()) await caches.delete(k); if (swReg) await swReg.update(); } catch (e) {}
    location.reload();
  };
  run();
}
async function checkUpdate(manual) {
  const v = await fetchVersion();
  if (!v) { if (manual) toast("Could not check for updates. Please check your internet."); return; }
  if (!loadedVersion) { loadedVersion = v; try { localStorage.setItem(VKEY, v); } catch (e) {} }
  else if (v !== loadedVersion) { applyUpdate(v); return; }
  if (manual) toast("You have the latest version (v" + v + ")");
}
(async () => {
  const v = await fetchVersion();
  let old = null; try { old = localStorage.getItem(VKEY); } catch (e) {}
  loadedVersion = v || old;
  if (v) { try { localStorage.setItem(VKEY, v); } catch (e) {} }
})();
setInterval(() => checkUpdate(false), 15 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkUpdate(false); });
addEventListener("online", () => checkUpdate(false));

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" })
      .then(r => { swReg = r; r.update().catch(() => {}); })
      .catch(error => console.error("Service Worker:", error));
  });
}
