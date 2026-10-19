// Scroll reveal + subtle parallax for the Figma-concept pages (halo, evora, niora, meloa).
// Each page's <html> already gets a `js` class from an inline bootstrap script in <head>.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll: fade/rise/scale in once, first time each element crosses into view.
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: .18, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  // Subtle parallax on a handful of the large full-bleed images, via the standalone
  // `transform` so it composes with the `translate`/`scale` the reveal CSS uses.
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduce) {
    var ticking = false;
    function apply() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0;
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * factor;
        el.style.transform = 'translateY(' + (-offset).toFixed(1) + 'px)';
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { requestAnimationFrame(apply); ticking = true; }
    }
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    apply();
  }
})();
