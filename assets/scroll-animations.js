/* Scroll animations.
   Design rule: content must never be stuck invisible. CSS only hides
   .fade-in when html.js is set, and every failure path below reveals
   everything rather than leaving the page blank. */
(function () {
  'use strict';

  var SELECTOR = '.card, .pricing-card, .fade-in';

  function revealAll() {
    var els = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
  }

  function init() {
    var reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) { revealAll(); return; }

    try {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      var els = document.querySelectorAll(SELECTOR);
      for (var i = 0; i < els.length; i++) observer.observe(els[i]);

      // Failsafe: nothing stays hidden past 1.5s, whatever happens.
      setTimeout(revealAll, 1500);
    } catch (e) { revealAll(); }
  }

  function initCountUp() {
    var els = document.querySelectorAll('[data-count-up]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || entry.target.dataset.counted) return;
        entry.target.dataset.counted = '1';
        obs.unobserve(entry.target);
        var target = parseInt(entry.target.dataset.countUp, 10);
        if (isNaN(target)) return;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          entry.target.textContent = Math.floor(p * target);
          if (p < 1) requestAnimationFrame(step); else entry.target.textContent = target;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    for (var i = 0; i < els.length; i++) obs.observe(els[i]);
  }

  function initCoursework() {
    var btns = document.querySelectorAll('.coursework-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        var open = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', open ? 'false' : 'true');
        var panel = document.getElementById(this.getAttribute('aria-controls'));
        if (panel) panel.hidden = open;
      });
    }
  }

  function boot() { init(); initCountUp(); initCoursework(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
