(function(){
  'use strict';

  var doc = document;

  /* Year */
  var year = doc.getElementById('year');
  if(year) year.textContent = (new Date()).getFullYear();

  /* Menu */
  var btn = doc.getElementById('menuBtn');
  var panel = doc.getElementById('navPanel');
  if(btn && panel){
    btn.addEventListener('click',function(){
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded',String(open));
      panel.setAttribute('aria-hidden',String(!open));
    });
    panel.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        panel.setAttribute('aria-hidden','true');
      });
    });
  }

  /* Scroll reveal */
  var revealed = new Set();
  var reveals = doc.querySelectorAll('.reveal');
  function checkReveals(){
    var h = window.innerHeight;
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
  window.addEventListener('scroll',checkReveals,{passive:true});
  window.addEventListener('resize',checkReveals,{passive:true});

  /* KPI counters */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counterEls = doc.querySelectorAll('[data-count]');
  if(prefersReduced){
    counterEls.forEach(function(el){
      var target = Number(el.getAttribute('data-count') || '0');
      var decimals = (el.getAttribute('data-count') || '').split('.')[1];
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = target.toFixed(decimals ? decimals.length : 0) + suffix;
    });
  } else if(counterEls.length){
    var counterObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },{threshold:0.7});
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
      var progress = Math.min((timestamp - start)/duration,1);
      var eased = 1 - Math.pow(1 - progress,3);
      var value = target * eased;
      el.textContent = value.toFixed(precision) + suffix;
      if(progress < 1){
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  /* Section menu highlight */
  var sectionLinks = doc.querySelectorAll('.section-menu a');
  var linkMap = new Map();
  sectionLinks.forEach(function(link){
    var id = (link.getAttribute('href') || '').replace('#','');
    if(id){
      linkMap.set(id, link);
    }
  });
  if(linkMap.size){
    var sectionObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          setActiveLink(entry.target.id);
        }
      });
    },{threshold:0.4});
    linkMap.forEach(function(_, id){
      var section = doc.getElementById(id);
      if(section){
        sectionObserver.observe(section);
      }
    });
  }

  function setActiveLink(id){
    sectionLinks.forEach(function(link){
      link.classList.toggle('is-active', (link.getAttribute('href') || '').replace('#','') === id);
    });
  }

  /* Filters */
  var filterButtons = doc.querySelectorAll('.filter-btn');
  var projectCards = doc.querySelectorAll('.project-card');
  if(filterButtons.length && projectCards.length){
    filterButtons.forEach(function(btn){
      btn.addEventListener('click',function(){
        var filter = btn.getAttribute('data-filter');
        filterButtons.forEach(function(other){ other.classList.toggle('is-active', other === btn); });
        projectCards.forEach(function(card){
          var type = card.getAttribute('data-type');
          var visible = !filter || filter === 'all' || type === filter;
          card.hidden = !visible;
        });
      });
    });
  }
})();
