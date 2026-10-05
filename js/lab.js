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

  /* ---------- Publications: project filters and show all / fewer ----------
     "Highlights" shows highlighted papers, plus all of them after
     "Show all". A project filter shows every paper in that project. */
  var list = document.getElementById('pub-list');
  var more = document.getElementById('pub-toggle');
  var filterBar = document.querySelector('.filters');
  var status = document.getElementById('pub-status');

  if (list && more && filterBar) {
    var pubs = Array.prototype.slice.call(list.querySelectorAll('.pub'));
    var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('button'));
    var state = { filter: 'all', expanded: false };
    var showAll = 'Show all ' + pubs.length + ' publications';

    function inProject(pub, f) { return pub.getAttribute('data-project') === f; }

    function render() {
      var shown = 0;
      pubs.forEach(function (pub) {
        var show = state.filter === 'all'
          ? (state.expanded || pub.classList.contains('highlight'))
          : inProject(pub, state.filter);
        pub.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === state.filter ? 'true' : 'false');
      });
      more.hidden = state.filter !== 'all';
      more.setAttribute('aria-expanded', state.expanded ? 'true' : 'false');
      more.textContent = state.expanded ? 'Show fewer publications' : showAll;
      if (status) status.textContent = 'Showing ' + shown + ' publications';
    }

    function setFilter(f) {
      state.filter = f;
      state.expanded = false;
      render();
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setFilter(b.getAttribute('data-filter')); });
    });

    more.addEventListener('click', function () {
      state.expanded = !state.expanded;
      render();
      if (!state.expanded) document.getElementById('publications').scrollIntoView();
    });

    /* "See N publications" links on project cards: count, then filter */
    Array.prototype.forEach.call(document.querySelectorAll('.see-pubs'), function (link) {
      var f = link.getAttribute('data-filter');
      var n = pubs.filter(function (p) { return inProject(p, f); }).length;
      link.textContent = 'See ' + n + (n === 1 ? ' publication' : ' publications');
      link.addEventListener('click', function () { setFilter(f); });
    });

    filterBar.hidden = false;
    list.classList.add('ready');
    render();
  }
})();
