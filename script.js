(function(){
  'use strict';

  var doc = document;
  var win = window;

  /* --- Year --- */
  var yearEl = doc.getElementById('year');
  if(yearEl) yearEl.textContent = '' + (new Date()).getFullYear();

  /* --- Reading progress bar --- */
  var progressBar = doc.getElementById('progressBar');
  if(progressBar){
    win.addEventListener('scroll', function(){
      var scrollTop = win.scrollY || doc.documentElement.scrollTop;
      var docHeight = doc.documentElement.scrollHeight - win.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }, {passive: true});
  }

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

  /* --- Scroll reveal (two classes) --- */
  var revealed = new Set();
  var revealTargets = doc.querySelectorAll('.reveal, .reveal-scale');
  function checkReveals(){
    var h = win.innerHeight;
    revealTargets.forEach(function(el){
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

  /* --- Parallax doux sur hero --- */
  var heroFig = doc.querySelector('.hero-fig');
  if(heroFig){
    win.addEventListener('scroll', function(){
      var scrollY = win.scrollY || doc.documentElement.scrollTop;
      var offset = scrollY * 0.25;
      if(offset < 200){
        heroFig.style.transform = 'translateY(' + offset + 'px)';
      }
    }, {passive: true});
  }

  /* --- Désaturation au scroll --- */
  var heroSec = doc.querySelector('.hero');
  var festivalSec = doc.querySelector('.sec-festival');

  function updateSaturation(){
    var vh = win.innerHeight;

    // Hero: se désature à mesure qu'on scroll au-delà
    if(heroSec){
      var heroRect = heroSec.getBoundingClientRect();
      var heroProgress = 1 - (heroRect.bottom / vh); // 0=en haut, 1=passé
      heroProgress = Math.max(0, Math.min(1, heroProgress));
      var sat = 1.15 - heroProgress * 0.85; // 1.15 → 0.30
      var bright = 0.55 + heroProgress * 0.08; // 0.55 → 0.63 (éclaircit un peu)
      heroFig.style.filter = 'saturate(' + sat.toFixed(2) + ') contrast(1.02) brightness(' + bright.toFixed(2) + ')';
    }

    // Festival
    if(festivalSec){
      var festFig = festivalSec.querySelector('.festival-fig');
      if(festFig){
        var festRect = festivalSec.getBoundingClientRect();
        var festProgress = 1 - (festRect.bottom / vh);
        festProgress = Math.max(0, Math.min(1, festProgress));
        var fSat = 1.1 - festProgress * 0.8;
        var fBright = 0.5 + festProgress * 0.08;
        festFig.style.filter = 'saturate(' + fSat.toFixed(2) + ') contrast(1.02) brightness(' + fBright.toFixed(2) + ')';
      }
    }
  }

  win.addEventListener('scroll', updateSaturation, {passive: true});
  win.addEventListener('resize', updateSaturation, {passive: true});
  // Initial call
  setTimeout(updateSaturation, 100);

  /* --- Active nav link --- */
  var sections = doc.querySelectorAll('.sec');
  var navLinkEls = doc.querySelectorAll('.nav-link');
  if(sections.length && navLinkEls.length){
    var linkMap = new Map();
    navLinkEls.forEach(function(link){
      var href = (link.getAttribute('href') || '').replace('#','');
      if(href) linkMap.set(href, link);
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
    doc.querySelectorAll('.sec[id]').forEach(function(s){
      observer.observe(s);
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
