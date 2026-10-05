/* NOLA A11y Lab: theme switch and "show all publications". */
(function () {
  var root = document.documentElement;

  /* ---------- Theme switch ---------- */
  var toggle = document.querySelector('.theme-toggle');

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function label() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    toggle.setAttribute('title', toggle.getAttribute('aria-label'));
  }

  if (toggle) {
    label();
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label);
    }
  }

  /* ---------- Show all / show fewer publications ---------- */
  var list = document.getElementById('pub-list');
  var more = document.getElementById('pub-toggle');

  if (list && more) {
    var total = list.querySelectorAll('.pub').length;
    var showAll = 'Show all ' + total + ' publications';
    more.textContent = showAll;
    more.hidden = false;

    more.addEventListener('click', function () {
      var open = list.classList.toggle('expanded');
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'Show fewer publications' : showAll;
      if (!open) document.getElementById('publications').scrollIntoView();
    });
  }
})();
