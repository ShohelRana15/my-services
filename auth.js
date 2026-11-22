/*!
 * SR Infinity Super App
 * © 2026 SR Infinity. All rights reserved.
 * This source code is proprietary. Do not copy, modify, distribute, sell or
 * use it to build a similar app without written permission. See LICENSE.
 */
/* SR Infinity – auth.js
   Accounts (sign in / register / guest), profile, install guide, admin gate, click effects.
   Loaded after app.js. */
"use strict";

/* ===== ONLINE ACCOUNTS (works from any device) =====
   Leave null = accounts are saved on THIS device only.
   To enable sign-in from any device: create a free Firebase project, turn on
   Authentication > Email/Password, add your site domain under Authorized domains,
   then paste your web app config here, for example:
   const FIREBASE_CONFIG = { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." }; */
const FIREBASE_CONFIG = null;
const MODE_ONLINE = !!FIREBASE_CONFIG;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const enc = new TextEncoder();
const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function pbk(pw, salt) {
  if (!window.crypto || !crypto.subtle) throw new Error("insecure");
  const k = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
  return b64(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, k, 256));
}

/* ----- provider 1: this device (passwords are salted + hashed with PBKDF2) ----- */
const LOCAL = {
  users: () => store.get("srUsers", {}),
  async register(name, email, pw) {
    const u = this.users(); if (u[email]) throw new Error("exists");
    const salt = crypto.getRandomValues(new Uint8Array(16));
    u[email] = { name, salt: b64(salt), hash: await pbk(pw, salt), t: Date.now() };
    if (!store.set("srUsers", u)) throw new Error("storage");
    return { id: email, email, name };
  },
  async login(email, pw) {
    const r = this.users()[email]; if (!r) throw new Error("invalid");
    if (await pbk(pw, unb64(r.salt)) !== r.hash) throw new Error("invalid");
    return { id: email, email, name: r.name };
  },
  async logout() {},
  async reset() { throw new Error("noreset"); }
};

/* ----- provider 2: Firebase (any device) ----- */
const FB = {
  async init() {
    if (this.auth) return;
    const base = "https://www.gstatic.com/firebasejs/10.12.2/";
    const [app, au] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]);
    this.m = au; this.auth = au.getAuth(app.initializeApp(FIREBASE_CONFIG));
  },
  map(u, name) { return { id: u.uid, email: u.email, name: name || u.displayName || u.email.split("@")[0] }; },
  async current() { await this.init(); await this.auth.authStateReady(); const u = this.auth.currentUser; return u ? this.map(u) : null; },
  async register(name, email, pw) {
    await this.init(); await this.m.setPersistence(this.auth, this.m.browserLocalPersistence);
    const c = await this.m.createUserWithEmailAndPassword(this.auth, email, pw);
    try { await this.m.updateProfile(c.user, { displayName: name }); } catch (e) {}
    return this.map(c.user, name);
  },
  async login(email, pw, remember) {
    await this.init();
    await this.m.setPersistence(this.auth, remember ? this.m.browserLocalPersistence : this.m.browserSessionPersistence);
    return this.map((await this.m.signInWithEmailAndPassword(this.auth, email, pw)).user);
  },
  async logout() { await this.init(); await this.m.signOut(this.auth); },
  async reset(email) { await this.init(); await this.m.sendPasswordResetEmail(this.auth, email); }
};
const AUTH = MODE_ONLINE ? FB : LOCAL;

const ERR = {
  exists: "This email is already registered. Please sign in.", "auth/email-already-in-use": "This email is already registered. Please sign in.",
  invalid: "Incorrect email or password.", "auth/invalid-credential": "Incorrect email or password.", "auth/wrong-password": "Incorrect email or password.", "auth/user-not-found": "Incorrect email or password.",
  "auth/weak-password": "Password is too weak. Use at least 8 characters.", "auth/invalid-email": "Enter a valid email address.",
  "auth/network-request-failed": "Network error. Check your internet connection.", "auth/too-many-requests": "Too many attempts. Please try again later.",
  insecure: "Secure connection (https) is required to use accounts.", storage: "Could not save. Browser storage may be full or blocked.",
  noreset: "Password reset by email needs the online account service."
};
const errMsg = e => ERR[e && (e.code || e.message)] || "Something went wrong. Please try again.";

/* ----- session ----- */
const SKEY = "srSession";
function saveSession(u, remember) { try { (remember ? localStorage : sessionStorage).setItem(SKEY, JSON.stringify(u)); (remember ? sessionStorage : localStorage).removeItem(SKEY); } catch (e) {} }
function loadSession() { for (const s of [localStorage, sessionStorage]) { try { const v = JSON.parse(s.getItem(SKEY)); if (v && v.id) return v; } catch (e) {} } return null; }
function clearSession() { try { localStorage.removeItem(SKEY); sessionStorage.removeItem(SKEY); } catch (e) {} }
async function currentUser() {
  if (MODE_ONLINE) return FB.current();
  const s = loadSession(); if (!s) return null;
  if (LOCAL.users()[s.email]) return s; clearSession(); return null;
}

/* ----- profile (name + photo) ----- */
let ME = null;
const GUEST = () => ({ id: "guest", name: "Guest", guest: true });
const pk = () => "srProf:" + (ME ? ME.id : "guest");
const prof = () => store.get(pk(), {});
function setProf(o) { if (!store.set(pk(), { ...prof(), ...o })) throw new Error("storage"); }
function fillAvatar(el) {
  if (!el) return; const p = prof(); el.textContent = "";
  if (p.photo) { const im = new Image(); im.alt = ""; im.src = p.photo; el.appendChild(im); }
  else if (ME && !ME.guest) el.textContent = ((p.name || ME.name || "?").trim()[0] || "?").toUpperCase();
  else el.textContent = "👤";
}
function applyProfile() {
  const name = prof().name || (ME && ME.name) || "Guest";
  userName = name; $("userName").textContent = name;
  const av = $("avatar"); fillAvatar(av); av.title = name;
  const pc = $("pcName");
  if (pc) { pc.textContent = name; $("pcSub").textContent = ME && !ME.guest ? ME.email : "Guest mode"; fillAvatar($("pav2")); }
}
function processPhoto(file) {
  return new Promise((res, rej) => {
    if (!/^image\//.test(file.type)) return rej(new Error("type"));
    if (file.size > 5 * 1024 * 1024) return rej(new Error("size"));
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = 256;
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
      URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("bad")); };
    img.src = url;
  });
}

/* ===== Auth screen ===== */
function setErr(id, m) { const e = $(id); e.textContent = m; e.hidden = !m; }
function busy(b, on) { b.disabled = on; b.classList.toggle("busy", on); }
function authView(v) {
  $("viewIn").hidden = v !== "in"; $("viewUp").hidden = v !== "up";
  setErr("inErr", ""); setErr("upErr", "");
  const el = $(v === "in" ? "viewIn" : "viewUp"); el.classList.remove("swapin"); void el.offsetWidth; el.classList.add("swapin");
}
function showAuth(v) { $("auth").hidden = false; $("authLoad").hidden = true; $("authBox").hidden = false; document.body.classList.add("noscroll"); authView(v || "in"); }
function hideAuth() { $("auth").hidden = true; document.body.classList.remove("noscroll"); }
function finish(u, remember) {
  ME = u; if (!MODE_ONLINE) saveSession(u, remember);
  try { sessionStorage.removeItem("srGuest"); } catch (e) {}
  hideAuth(); applyProfile(); toast("Welcome, " + (prof().name || u.name) + "!");
}
async function logout() {
  try { await AUTH.logout(); } catch (e) {}
  clearSession(); try { sessionStorage.removeItem("srGuest"); sessionStorage.removeItem("srAdminAt"); } catch (e) {}
  ME = null; closeModal(); applyProfile(); $("formIn").reset(); $("formUp").reset(); showAuth("in");
}

let fails = 0, lockUntil = 0;
$("formIn").onsubmit = async e => {
  e.preventDefault();
  const email = $("inEmail").value.trim().toLowerCase(), pw = $("inPw").value, btn = $("inBtn");
  if (!EMAIL.test(email)) return setErr("inErr", "Enter a valid email address.");
  if (!pw) return setErr("inErr", "Enter your password.");
  if (Date.now() < lockUntil) return setErr("inErr", `Too many attempts. Try again in ${Math.ceil((lockUntil - Date.now()) / 1000)}s.`);
  setErr("inErr", ""); busy(btn, true);
  try { const u = await AUTH.login(email, pw, $("inRem").checked); fails = 0; $("inPw").value = ""; finish(u, $("inRem").checked); }
  catch (er) { if (++fails >= 5) { lockUntil = Date.now() + 30000; fails = 0; } setErr("inErr", errMsg(er)); }
  finally { busy(btn, false); }
};
$("formUp").onsubmit = async e => {
  e.preventDefault();
  const name = $("upName").value.trim(), email = $("upEmail").value.trim().toLowerCase(), pw = $("upPw").value, btn = $("regBtn");
  if (name.length < 2) return setErr("upErr", "Enter your full name.");
  if (!EMAIL.test(email)) return setErr("upErr", "Enter a valid email address.");
  if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return setErr("upErr", "Password must be at least 8 characters with letters and numbers.");
  if (pw !== $("upPw2").value) return setErr("upErr", "Passwords do not match.");
  setErr("upErr", ""); busy(btn, true);
  try { const u = await AUTH.register(name, email, pw); $("formUp").reset(); finish(u, true); }
  catch (er) { setErr("upErr", errMsg(er)); }
  finally { busy(btn, false); }
};
$("forgot").onclick = async () => {
  const email = $("inEmail").value.trim().toLowerCase();
  if (!MODE_ONLINE) return setErr("inErr", ERR.noreset + " On this device, you can create a new account instead.");
  if (!EMAIL.test(email)) return setErr("inErr", "Type your email above first, then tap Forgot Password.");
  try { await AUTH.reset(email); setErr("inErr", ""); toast("Password reset email sent"); } catch (er) { setErr("inErr", errMsg(er)); }
};
$("guestBtn").onclick = () => { ME = GUEST(); try { sessionStorage.setItem("srGuest", "1"); } catch (e) {} hideAuth(); applyProfile(); toast("You are using Guest mode"); };
$("goUp").onclick = $("tUp").onclick = () => authView("up");
$("goIn").onclick = $("goIn2").onclick = () => authView("in");
document.querySelectorAll("[data-eye]").forEach(b => b.onclick = () => {
  const i = $(b.dataset.eye), show = i.type === "password";
  i.type = show ? "text" : "password"; b.innerHTML = svg(show ? "eyeoff" : "eye"); b.setAttribute("aria-label", show ? "Hide password" : "Show password");
});
document.querySelectorAll(".modeHint").forEach(h => h.textContent = MODE_ONLINE
  ? "Your account is saved online – sign in from any device."
  : "Accounts are saved on this device only. Connect the online account service to sign in from any device.");
$("avatar").onclick = $("pcard").onclick = () => go("settings");

/* ===== Install guide ===== */
const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const installed = () => { let f = false; try { f = localStorage.getItem("srInstalled") === "1"; } catch (e) {} return standalone() || (f && !deferredPrompt); };
function detect() {
  const u = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) return "ios";
  return /Android/.test(u) ? "android" : "pc";
}
const PLAT = {
  android: ["Android", ["Open this website in <b>Chrome</b> on your phone.", "Tap the <b>⋮ menu</b> at the top-right corner.", "Tap <b>Install app</b> (or <b>Add to Home screen</b>).", "Tap <b>Install</b> to confirm.", "Find the <b>SR Infinity</b> icon on your home screen and open it."]],
  ios: ["iPhone / iPad", ["Open this website in <b>Safari</b> (other browsers cannot add apps on iPhone).", "Tap the <b>Share</b> button (a square with an up arrow).", "Scroll down and tap <b>Add to Home Screen</b>.", "Tap <b>Add</b> at the top-right.", "Open <b>SR Infinity</b> from your home screen."]],
  pc: ["PC (Windows / Mac)", ["Open this website in <b>Chrome</b> or <b>Edge</b>.", "Click the <b>Install icon</b> (a small monitor with a down arrow) at the right end of the address bar.", "Or open the <b>⋮ menu</b> → <b>Cast, save and share</b> → <b>Install page as app</b> (Edge: <b>Apps</b> → <b>Install this site as an app</b>).", "Click <b>Install</b>.", "The app opens in its own window. Pin it to your taskbar or Dock."]]
};
/* One tap: opens the browser's own install dialog when the browser allows it.
   Otherwise (iPhone, Firefox, already installed, ...) shows the step-by-step guide. */
async function installGuide() {
  if (!standalone() && deferredPrompt) {
    try {
      deferredPrompt.prompt(); const r = await deferredPrompt.userChoice; deferredPrompt = null;
      toast(r.outcome === "accepted" ? "Installing SR Infinity…" : "Installation cancelled");
    } catch (e) { installSteps(); }
    return;
  }
  installSteps();
}
function installSteps() {
  const done = installed(), can = !!deferredPrompt, cur = detect();
  const stat = done ? '<div class="istat">✅ <b>SR Infinity is already installed</b> on this device. Open it from your home screen or app list.</div>'
    : can ? '<div class="istat">⚡ Your browser can install the app in one tap.</div><button class="go" id="inow" style="width:100%;margin-bottom:12px">Install now</button>'
    : '<div class="istat" style="background:rgba(245,158,11,.15);border-color:rgba(245,158,11,.45)">Follow the steps below to install the app on your device.</div>';
  const list = k => PLAT[k][1].map((s, i) => `<li style="animation-delay:${i * 0.07}s"><span>${s}</span></li>`).join("");
  modal("Install SR Infinity", `${stat}
    <div class="itabs">${Object.keys(PLAT).map(k => `<button data-p="${k}" class="${k === cur ? "on" : ""}">${PLAT[k][0]}</button>`).join("")}</div>
    <ol class="steps" id="steps">${list(cur)}</ol>
    <small>Once installed, the app opens in its own window and works like a normal app. Firefox on PC does not support installing apps – use Chrome or Edge.</small>`, () => {
    $("modBody").querySelectorAll("[data-p]").forEach(b => b.onclick = () => {
      $("modBody").querySelectorAll("[data-p]").forEach(x => x.classList.toggle("on", x === b)); $("steps").innerHTML = list(b.dataset.p);
    });
    const n = $("inow");
    if (n) n.onclick = async () => {
      try { deferredPrompt.prompt(); const r = await deferredPrompt.userChoice; deferredPrompt = null; closeModal(); toast(r.outcome === "accepted" ? "Installing…" : "Installation cancelled"); }
      catch (e) { toast("Please use the steps below"); }
    };
  });
}

/* ===== Admin gate (add / remove services) =====
   Note: this protects the screen on this device only. It is not server security. */
const ADMIN_KEY = "srAdmin";
const adminOk = () => Date.now() - (+sessionStorage.getItem("srAdminAt") || 0) < 10 * 60 * 1000;
let aFails = 0, aLock = 0;
function adminGate(next) {
  if (adminOk()) return next();
  const a = store.get(ADMIN_KEY, null);
  modal(a ? "Admin password" : "Create admin password",
    `<p>${a ? "Enter the admin password to continue." : "No admin password is set on this device yet. Create one – it will be required to add or remove services."}</p>
    <label>Password<input id="ap1" type="password" autocomplete="${a ? "current-password" : "new-password"}"></label>
    ${a ? "" : '<label>Confirm password<input id="ap2" type="password" autocomplete="new-password"></label>'}
    <p class="err" id="apE" hidden></p><button class="go" id="apB">${a ? "Unlock" : "Create password"}</button>`, () => {
    const err = m => setErr("apE", m);
    const run = async () => {
      const pw = $("ap1").value;
      try {
        if (a) {
          if (Date.now() < aLock) return err("Too many attempts. Wait a moment and try again.");
          if (await pbk(pw, unb64(a.salt)) !== a.hash) { if (++aFails >= 5) { aLock = Date.now() + 30000; aFails = 0; } return err("Wrong admin password."); }
        } else {
          if (pw.length < 6) return err("Use at least 6 characters.");
          if (pw !== $("ap2").value) return err("Passwords do not match.");
          const salt = crypto.getRandomValues(new Uint8Array(16));
          if (!store.set(ADMIN_KEY, { salt: b64(salt), hash: await pbk(pw, salt) })) return err(ERR.storage);
        }
      } catch (e) { return err(errMsg(e)); }
      aFails = 0; sessionStorage.setItem("srAdminAt", Date.now()); closeModal(); next();
    };
    $("apB").onclick = run; $("modBody").onkeydown = e => { if (e.key === "Enter") run(); };
  });
}
function changeAdmin() {
  modal("Change admin password", `<label>New password<input id="ap1" type="password" autocomplete="new-password"></label><label>Confirm new password<input id="ap2" type="password" autocomplete="new-password"></label><p class="err" id="apE" hidden></p><button class="go" id="apB">Save password</button>`, () => {
    $("apB").onclick = async () => {
      const pw = $("ap1").value; if (pw.length < 6) return setErr("apE", "Use at least 6 characters.");
      if (pw !== $("ap2").value) return setErr("apE", "Passwords do not match.");
      try { const salt = crypto.getRandomValues(new Uint8Array(16)); if (!store.set(ADMIN_KEY, { salt: b64(salt), hash: await pbk(pw, salt) })) throw new Error("storage"); }
      catch (e) { return setErr("apE", errMsg(e)); }
      closeModal(); toast("Admin password changed");
    };
  });
}
function addService() { adminGate(addForm); }
function addForm() {
  const ICONS = ["🌐", "🛒", "📚", "🎮", "🎵", "📰", "💼", "🏦"]; let icon = ICONS[0];
  const list = () => savedModules.length ? savedModules.map(m => `<div class="li"><span>${esc(m.icon || "🌐")} ${esc(m.name)}</span><button class="rm" data-rm="${esc(m.id)}">Remove</button></div>`).join("") : "<small>No custom services yet.</small>";
  modal("Add service", `<label>Service name<input id="an" maxlength="24" placeholder="e.g. My Shop"></label>
    <label>Website address (https)<input id="au" inputmode="url" placeholder="https://example.com"></label>
    <label>Short description<input id="ad" maxlength="40" placeholder="e.g. Order online"></label>
    <small>Choose an icon</small><div class="iconpick" id="ip">${ICONS.map((e, i) => `<button type="button" class="${i ? "" : "on"}">${e}</button>`).join("")}</div>
    <p class="err" id="aE" hidden></p><button class="go" id="ag">Add service</button>
    <h4>Your added services</h4><div id="al">${list()}</div>`, () => {
    const bindRm = () => $("al").querySelectorAll("[data-rm]").forEach(b => b.onclick = () => {
      savedModules = savedModules.filter(m => m.id !== b.dataset.rm); store.set("srInfinityModules", savedModules);
      favs = favs.filter(x => x !== b.dataset.rm); store.set("srInfinityFavs", favs); renderModules(); $("al").innerHTML = list(); bindRm(); toast("Service removed");
    });
    bindRm();
    $("ip").onclick = e => { const b = e.target.closest("button"); if (!b) return; icon = b.textContent; $("ip").querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); };
    $("ag").onclick = () => {
      const name = $("an").value.trim(); let url = $("au").value.trim();
      if (!name) return setErr("aE", "Enter a service name.");
      if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
      let u; try { u = new URL(url); } catch (e) { return setErr("aE", "Enter a valid website address."); }
      if (u.protocol !== "https:") return setErr("aE", "Only secure https websites are allowed.");
      const m = { id: "custom-" + Date.now(), name, description: $("ad").value.trim() || "Your digital service", icon, url: u.href, active: true };
      savedModules.push(m);
      if (!store.set("srInfinityModules", savedModules)) { savedModules.pop(); return setErr("aE", ERR.storage); }
      $("search").value = ""; closeModal(); renderModules();
      const card = moduleGrid.lastElementChild; card.classList.add("newcard");
      smoothTo(card.getBoundingClientRect().top + scrollY - 140); setTimeout(() => ring(card), 120); toast("Service added: " + name);
    };
  });
}

/* ===== Settings ===== */
function openSettings() {
  const p = prof(), nm = p.name || (ME && ME.name) || "Guest", acct = ME && !ME.guest;
  modal("Settings", `
    <div class="prof"><div class="pav" id="pav"></div><div><b>${esc(nm)}</b><br><small>${acct ? esc(ME.email) : "Guest mode – saved on this device only"}</small></div></div>
    <label>Your name<input id="sn" maxlength="40" value="${esc(nm)}"></label>
    <label>Profile photo<input id="sp" type="file" accept="image/png,image/jpeg,image/webp"></label>
    <small class="tip">Photo guide: use a square (1:1) picture, at least 256 × 256 px, in JPG, PNG or WebP, up to 5 MB. It is cropped to a circle and compressed automatically, then becomes your profile picture.</small>
    <label>Theme<select id="st"><option value="dark">Dark mode</option><option value="light">Light mode</option></select></label>
    <div class="row"><button class="go" id="ss">Save</button><button class="go" id="rp">Remove photo</button><button class="go" id="pi">Install App</button></div>
    <div class="row"><button class="go" id="sa">Admin password</button><button class="go" id="sc">Clear favorites &amp; history</button><button class="go" id="cu">Check for updates</button><button class="go" id="so">${acct ? "Log out" : "Sign in / Register"}</button></div>
    <small>App version: ${loadedVersion ? "v" + loadedVersion : "–"}</small>`, () => {
    fillAvatar($("pav")); $("st").value = document.body.classList.contains("light") ? "light" : "dark";
    $("sp").onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      try { setProf({ photo: await processPhoto(f) }); applyProfile(); fillAvatar($("pav")); toast("Profile photo updated"); }
      catch (er) { toast({ size: "Photo is larger than 5 MB", type: "Please choose an image file", storage: ERR.storage }[er.message] || "Could not read this image"); }
      e.target.value = "";
    };
    $("rp").onclick = () => { try { setProf({ photo: "" }); } catch (e) {} applyProfile(); fillAvatar($("pav")); toast("Photo removed"); };
    $("ss").onclick = () => {
      const n = $("sn").value.trim(); if (!n) return toast("Please enter your name");
      try { setProf({ name: n }); } catch (e) { return toast(ERR.storage); }
      applyProfile(); updateTheme($("st").value === "dark"); store.set("srInfinityTheme", $("st").value); toast("Saved");
    };
    $("pi").onclick = () => { closeModal(); installGuide(); };
    $("sa").onclick = () => { if (store.get(ADMIN_KEY, null)) adminGate(changeAdmin); else adminGate(() => toast("Admin password created")); };
    $("sc").onclick = () => { favs = []; hist = []; store.set("srInfinityFavs", []); store.set("srInfinityHistory", []); renderModules(); toast("Cleared"); };
    $("cu").onclick = () => checkUpdate(true);
    $("so").onclick = logout;
  });
}

/* ===== Liquid-glass hearts on click (anywhere) ===== */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const heart = k => `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#hg${k})" stroke="rgba(255,255,255,.85)" stroke-width="1.1"/><ellipse cx="8.2" cy="8" rx="2.6" ry="1.3" transform="rotate(-35 8.2 8)" fill="rgba(255,255,255,.75)"/></svg>`;
  let n = 0;
  addEventListener("pointerdown", e => {
    if (e.button > 0 || n > 8) return; n++;
    const d = document.createElement("div"); d.className = "hearts"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px";
    let h = "";
    for (let k = 0; k < 6; k++) {
      const sz = 11 + Math.random() * 7, dx = (Math.random() - 0.5) * 90, up = 10 + Math.random() * 22, fall = 50 + Math.random() * 70, rot = (Math.random() - 0.5) * 60, dur = 0.9 + Math.random() * 0.5;
      h += `<i style="--sz:${sz | 0}px;--dx:${dx | 0}px;--up:${up | 0}px;--fall:${fall | 0}px;--rot:${rot | 0}deg;animation-duration:${dur.toFixed(2)}s">${heart(k % 3)}</i>`;
    }
    d.innerHTML = h; document.body.appendChild(d); setTimeout(() => { d.remove(); n--; }, 1700);
  }, { passive: true, capture: true });
})();

/* ===== Start ===== */
(async () => {
  if (MODE_ONLINE) { $("auth").hidden = false; }
  try { ME = await currentUser(); } catch (e) { ME = null; }
  if (!ME) { try { if (sessionStorage.getItem("srGuest")) ME = GUEST(); } catch (e) {} }
  applyProfile();
  if (ME) hideAuth(); else showAuth("in");
})();
