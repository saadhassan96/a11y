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

  /* ---------- Earlier news: "Show less" closes it and returns to News ---------- */
  var newsMore = document.querySelector('.news-more');
  var newsLess = document.querySelector('.news-less');
  if (newsMore && newsLess) {
    var summary = newsMore.querySelector('summary');
    newsLess.addEventListener('click', function () {
      newsMore.open = false;
      document.getElementById('news').scrollIntoView();
      summary.focus();
    });
    newsMore.addEventListener('toggle', function () {
      summary.textContent = newsMore.open ? 'Hide earlier news' : 'Earlier news';
    });
  }

  /* ---------- Highlight the current section in the nav as you scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav ul a[href^="#"]'))
    .filter(function (a) { return !a.classList.contains('nav-join'); });
  var spySections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var ticking = false;

  function updateSpy() {
    ticking = false;
    var navBar = document.querySelector('.site-nav');
    /* A section becomes current once its top passes 30% down the window */
    var offset = Math.max((navBar ? navBar.offsetHeight : 0) + 40, window.innerHeight * 0.3);
    var current = -1;
    spySections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= offset) current = i;
    });
    /* At the very bottom, the last section is current even if it is short */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = spySections.length - 1;
    }
    navLinks.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateSpy); }
  }, { passive: true });
  window.addEventListener('resize', updateSpy);
  updateSpy();

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
