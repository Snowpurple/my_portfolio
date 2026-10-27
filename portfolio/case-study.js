(function () {
  "use strict";
  var root = document.getElementById("case");
  var data = window.PROJECTS || {};
  var slug = new URLSearchParams(location.search).get("p");
  var p = data[slug];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function isUrl(u) { return /^https?:\/\//i.test(u || ""); }

  if (!p) {
    document.title = "Case study not found | Sneha Yadav";
    root.innerHTML = '<a class="cs__back" href="index.html#projects">&larr; Back to projects</a>' +
      '<h1 class="cs__title">Case study not found</h1>' +
      '<p class="cs__summary">That project does not exist. Please pick one from the projects section.</p>';
    return;
  }

  document.title = p.title + " case study | Sneha Yadav";

  var keys = Object.keys(data);
  var next = data[keys[(keys.indexOf(slug) + 1) % keys.length]];
  var nextSlug = keys[(keys.indexOf(slug) + 1) % keys.length];

  var meta = [["Role", p.role], ["Timeline", p.timeline], ["Tools", (p.tools || []).join(", ")]].filter(function (m) { return m[1]; });

  var hasProto = isUrl(p.prototypeUrl);
  var protoBtn = hasProto
    ? '<a class="btn btn--pill" href="' + esc(p.prototypeUrl) + '" target="_blank" rel="noopener">View prototype &nearr;</a>'
    : '<span class="btn btn--pill is-disabled" role="link" aria-disabled="true">Prototype link coming soon</span>';
  var liveBtn = isUrl(p.liveUrl) ? '<a class="btn btn--pill is-ghost" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener">Visit live site &nearr;</a>' : "";

  var sections = (p.sections || []).filter(function (s) { return s && s.heading && s.body && s.body.length; }).map(function (s) {
    return '<section class="cs__section"><h2>' + esc(s.heading) + "</h2>" +
      s.body.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</section>";
  }).join("");

  var gallery = (p.images || []).length
    ? '<div class="cs__gallery">' + p.images.map(function (src) { return '<img src="' + esc(src) + '" alt="' + esc(p.title) + ' design" loading="lazy" />'; }).join("") + "</div>"
    : "";

  // Figma prototype links can also be shown embedded on the page.
  var embed = hasProto && /figma\.com\/(proto|design|file)\//i.test(p.prototypeUrl)
    ? '<section class="cs__proto"><h2>Interactive prototype</h2>' +
      '<iframe title="' + esc(p.title) + ' prototype" src="https://www.figma.com/embed?embed_host=portfolio&url=' + encodeURIComponent(p.prototypeUrl) + '" allowfullscreen loading="lazy"></iframe></section>'
    : "";

  root.innerHTML =
    '<a class="cs__back" href="index.html#projects">&larr; Back to projects</a>' +
    '<p class="cs__type">' + esc(p.type) + "</p>" +
    '<h1 class="cs__title">' + esc(p.title) + "</h1>" +
    (p.summary ? '<p class="cs__summary">' + esc(p.summary) + "</p>" : "") +
    '<div class="cs__actions">' + protoBtn + liveBtn + "</div>" +
    (p.cover ? '<div class="cs__cover"><img src="' + esc(p.cover) + '" alt="' + esc(p.title) + ' preview" /></div>' : "") +
    (meta.length ? '<dl class="cs__meta">' + meta.map(function (m) { return "<div><dt>" + esc(m[0]) + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("") + "</dl>" : "") +
    sections + gallery + embed +
    '<nav class="cs__next" aria-label="More projects"><a class="cs__back" href="index.html#projects">&larr; All projects</a>' +
    (next && nextSlug !== slug ? '<a class="cs__back" href="case-study.html?p=' + encodeURIComponent(nextSlug) + '">Next: ' + esc(next.title) + " &rarr;</a>" : "") + "</nav>";
})();
