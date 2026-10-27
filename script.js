(function () {
  "use strict";

  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2600);
  }

  /* Images that are not added yet keep their grey placeholder instead of showing a broken icon. */
  document.addEventListener("error", function (e) {
    var t = e.target;
    if (t && t.tagName === "IMG") t.classList.add("is-missing");
  }, true);
  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.classList.add("is-missing");
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.matchMedia("(min-width: 821px)").addEventListener("change", function () { setMenu(false); });
  }

  /* ---------- Highlight the menu item of the section in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__menu a[data-section]"));
  var sections = links.map(function (a) { return document.getElementById(a.dataset.section); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      var best = null, bestRatio = 0;
      sections.forEach(function (s) { if ((visible[s.id] || 0) > bestRatio) { best = s.id; bestRatio = visible[s.id]; } });
      if (!best) return;
      links.forEach(function (a) {
        var on = a.dataset.section === best;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Resume / LinkedIn buttons ---------- */
  [["resume-link", "Resume link not added yet"], ["linkedin-link", "LinkedIn link not added yet"]].forEach(function (pair) {
    var a = document.getElementById(pair[0]);
    if (!a) return;
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href");
      if (!href || href === "#") { e.preventDefault(); toast(pair[1]); }
    });
  });
})();
