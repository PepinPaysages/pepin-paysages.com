(function(){
  'use strict';

  var doc = document;
  var win = window;

  /* --- Year --- */
  var yearEl = doc.getElementById('year');
  if(yearEl) yearEl.textContent = '' + (new Date()).getFullYear();

  /* --- Mobile menu --- */
  var menuBtn = doc.getElementById('menuBtn');
  var navLinks = doc.getElementById('navLinks');
  if(menuBtn && navLinks){
    menuBtn.addEventListener('click', function(){
      var open = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navLinks.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Scroll reveal --- */
  var revealed = new Set();
  var reveals = doc.querySelectorAll('.reveal');
  function checkReveals(){
    var h = win.innerHeight;
    reveals.forEach(function(el){
      var rect = el.getBoundingClientRect();
      if(rect.top < h * 0.88 && rect.bottom > 0){
        if(!revealed.has(el)){
          revealed.add(el);
          el.classList.add('visible');
        }
      }
    });
  }
  checkReveals();
  win.addEventListener('scroll', checkReveals, {passive: true});
  win.addEventListener('resize', checkReveals, {passive: true});

  /* --- Active nav link --- */
  var sections = doc.querySelectorAll('.sec');
  var navLinkEls = doc.querySelectorAll('.nav-link');
  if(sections.length && navLinkEls.length){
    var sectionMap = {};
    sections.forEach(function(s){
      if(s.id) sectionMap[s.id] = s;
    });
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.id;
          navLinkEls.forEach(function(link){
            var href = (link.getAttribute('href') || '').replace('#','');
            link.classList.toggle('is-active', href === id);
          });
        }
      });
    }, {threshold: 0.35});
    Object.keys(sectionMap).forEach(function(id){
      observer.observe(sectionMap[id]);
    });
  }

  /* --- KPI counters --- */
  var prefersReduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counterEls = doc.querySelectorAll('[data-count]');

  if(prefersReduced){
    counterEls.forEach(function(el){
      var target = Number(el.getAttribute('data-count') || '0');
      var decimals = (el.getAttribute('data-count') || '').split('.')[1];
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = (decimals ? target.toFixed(decimals.length) : Math.round(target)) + suffix;
    });
  } else if(counterEls.length){
    var counterObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.6});
    counterEls.forEach(function(el){
      counterObserver.observe(el);
    });
  }

  function animateCounter(el){
    var target = Number(el.getAttribute('data-count') || '0');
    var decimals = (el.getAttribute('data-count') || '').split('.')[1];
    var suffix = el.getAttribute('data-suffix') || '';
    var precision = decimals ? decimals.length : 0;
    var duration = 1600;
    var start;

    function tick(timestamp){
      if(!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = (precision ? value.toFixed(precision) : Math.round(value)) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

})();
