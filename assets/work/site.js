// Shared behaviour for the Work section pages: theme toggle, mobile menu, nav scroll state,
// and a simple reveal-on-scroll (no parallax/marquee — these pages stay lighter than index.html).
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme toggle (persisted; the inline head script already applied a saved 'dark' before paint)
  var themeBtn = $('#theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var d = document.documentElement, isDark = d.classList.toggle('dark');
      try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  // Mobile menu
  var menuBtn = $('#menuBtn'), menu = $('#menu'), nav = $('#nav');
  if (menuBtn && menu) {
    var menuOpen = false;
    function setMenu(open) {
      menuOpen = open;
      menu.classList.toggle('open', open);
      menu.inert = !open;
      menuBtn.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('menu-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    }
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  // Nav background once scrolled
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
