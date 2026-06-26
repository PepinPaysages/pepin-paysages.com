(function(){
  'use strict';

  /* Year */
  var year = document.getElementById('year');
  if(year) year.textContent = (new Date()).getFullYear();

  /* Menu */
  var btn = document.getElementById('menuBtn');
  var panel = document.getElementById('navPanel');
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
  var reveals = document.querySelectorAll('.reveal');
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
})();
