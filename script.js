/* ============================================
   AMAZON CLONE — SCRIPT.JS
   ============================================ */

/* ── HERO SLIDER ── */
(function(){
  const track = document.getElementById('heroTrack');
  const dots  = document.querySelectorAll('.hero__dot');
  let cur = 0, timer;

  function goTo(i){
    if(i<0) i=2; if(i>2) i=0;
    cur = i;
    track.style.transform = `translateX(-${cur*100}%)`;
    dots.forEach((d,idx)=> d.classList.toggle('hero__dot--active', idx===cur));
  }

  document.getElementById('heroPrev').onclick = ()=>{ goTo(cur-1); reset(); };
  document.getElementById('heroNext').onclick = ()=>{ goTo(cur+1); reset(); };
  dots.forEach(d => d.addEventListener('click',()=>{ goTo(+d.dataset.i); reset(); }));

  document.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')  { goTo(cur-1); reset(); }
    if(e.key==='ArrowRight') { goTo(cur+1); reset(); }
  });

  let tx=0;
  track.addEventListener('touchstart',e=>{ tx=e.touches[0].clientX; },{passive:true});
  track.addEventListener('touchend',e=>{
    const d=tx-e.changedTouches[0].clientX;
    if(Math.abs(d)>50){ d>0?goTo(cur+1):goTo(cur-1); reset(); }
  });

  function start(){ timer=setInterval(()=>goTo(cur+1),4000); }
  function reset(){ clearInterval(timer); start(); }
  goTo(0); start();
})();

/* ── ROW SLIDERS (all 6) ── */
(function(){
  /* Map slider index → track element ID prefix */
  const CONFIG = [
    { idx:0, trackId:'rsaTrack0', arrowSel:'.rsa__arrow' },
    { idx:1, trackId:'rsaTrack1', arrowSel:'.rsa__arrow' },
    { idx:2, trackId:'rsbTrack2', arrowSel:'.rsb__arrow' },
    { idx:3, trackId:'rsbTrack3', arrowSel:'.rsb__arrow' },
    { idx:4, trackId:'rscTrack4', arrowSel:'.rsc__arrow' },
    { idx:5, trackId:'rscTrack5', arrowSel:'.rsc__arrow' },
  ];

  const VISIBLE=7, TOTAL=18, STEP=7;
  const offsets = [0,0,0,0,0,0];

  function itemWidth(trackEl){
    const item = trackEl.querySelector('[class$="__item"]');
    return item ? item.offsetWidth + 12 : 0;
  }

  function update(cfg){
    const track = document.getElementById(cfg.trackId);
    if(!track) return;
    track.style.transform = `translateX(-${offsets[cfg.idx] * itemWidth(track)}px)`;
    // update arrow states for THIS slider only
    document.querySelectorAll(`${cfg.arrowSel}[data-slider="${cfg.idx}"]`).forEach(btn=>{
      if(btn.classList.contains(cfg.arrowSel.replace('.','')+'--l') ||
         btn.classList.contains(cfg.arrowSel.replace('.','').replace('__arrow','__arrow--l'))){
        btn.disabled = offsets[cfg.idx] <= 0;
      } else {
        btn.disabled = offsets[cfg.idx] >= TOTAL - VISIBLE;
      }
    });
  }

  CONFIG.forEach(cfg=>{
    // left arrows
    document.querySelectorAll(`${cfg.arrowSel}--l[data-slider="${cfg.idx}"]`).forEach(btn=>{
      btn.disabled = true; // start disabled
      btn.addEventListener('click',()=>{
        offsets[cfg.idx] = Math.max(0, offsets[cfg.idx]-STEP);
        updateById(cfg);
      });
    });
    // right arrows
    document.querySelectorAll(`${cfg.arrowSel}--r[data-slider="${cfg.idx}"]`).forEach(btn=>{
      btn.addEventListener('click',()=>{
        offsets[cfg.idx] = Math.min(TOTAL-VISIBLE, offsets[cfg.idx]+STEP);
        updateById(cfg);
      });
    });
  });

  function updateById(cfg){
    const track = document.getElementById(cfg.trackId);
    if(!track) return;
    track.style.transform = `translateX(-${offsets[cfg.idx] * itemWidth(track)}px)`;
    const lBtn = document.querySelector(`${cfg.arrowSel}--l[data-slider="${cfg.idx}"]`);
    const rBtn = document.querySelector(`${cfg.arrowSel}--r[data-slider="${cfg.idx}"]`);
    if(lBtn) lBtn.disabled = offsets[cfg.idx] <= 0;
    if(rBtn) rBtn.disabled = offsets[cfg.idx] >= TOTAL-VISIBLE;
  }

  window.addEventListener('resize',()=> CONFIG.forEach(cfg=> updateById(cfg)));
})();
var VISIBLE = 5;
  var current = 0;
  var track = document.getElementById('sliderTrack');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dotsEl = document.getElementById('dots');
  var total = track.children.length;
  var maxIndex = total - VISIBLE;
  var pages = Math.ceil(total / VISIBLE);
 
  for (var i = 0; i < pages; i++) {
    var btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Page ' + (i + 1));
    (function(pageIndex) {
      btn.addEventListener('click', function() {
        current = Math.min(pageIndex * VISIBLE, maxIndex);
        update();
      });
    })(i);
    dotsEl.appendChild(btn);
  }
 
  function update() {
    var items = track.children;
    var itemW = items[0].getBoundingClientRect().width;
    var gap = 10;
    track.style.transform = 'translateX(-' + (current * (itemW + gap)) + 'px)';
 
    if (current === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }
 
    if (current >= maxIndex) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
 
    var activePage = Math.round(current / VISIBLE);
    var allDots = document.querySelectorAll('.dot');
    for (var j = 0; j < allDots.length; j++) {
      if (j === activePage) {
        allDots[j].classList.add('active');
      } else {
        allDots[j].classList.remove('active');
      }
    }
  }
 
  function slide(dir) {
    current = current + VISIBLE * dir;
    if (current < 0) { current = 0; }
    if (current > maxIndex) { current = maxIndex; }
    update();
  }
 
  window.addEventListener('resize', update);
  update();