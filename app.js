// Scroll reveal with IntersectionObserver + per-item stagger
const revealEls = [...document.querySelectorAll('[data-reveal]')];

const revealObserver = new IntersectionObserver((entries) =>
 {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const baseDelay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      el.style.transitionDelay = (baseDelay/1000).toFixed(2) + 's';
      el.classList.add('in-view');
      revealObserver.unobserve(el);

    }
  });
}, { threshold: 0.16 });

revealEls.forEach(el => revealObserver.observe(el));


// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Stackly Scroll Reveal =====
(function(){
  const els = Array.from(document.querySelectorAll('[data-sr]'));

  const srObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const el = e.target;
        const delay = parseInt(el.getAttribute('data-sr-delay') || '0', 10);
        el.style.animationDelay = (delay/1000).toFixed(2) + 's';
        el.classList.add('sr-in');
       srObserver.unobserve(el);

      }
    }
  }, { threshold: 0.18 });

els.forEach(el => srObserver.observe(el));

})();




(() => {
  const drawer    = document.getElementById('mobileNav');
  const toggleBtn = document.getElementById('menuToggle');
  const backdrop  = document.getElementById('navBackdrop');
  const body      = document.body;
  const MOBILE_Q  = '(max-width: 900px)';
  const isMobile  = () => matchMedia(MOBILE_Q).matches;

  /* ---------- Drawer ---------- */
  function openDrawer(){
    drawer.classList.add('open');
    toggleBtn.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded','true');
    backdrop.classList.add('show');
    body.classList.add('no-scroll');

    // collapse all submenus initially
    drawer.querySelectorAll('.nav-item.has-menu').forEach(collapse);
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    toggleBtn.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded','false');
    backdrop.classList.remove('show');
    body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeDrawer(); });
  window.addEventListener('resize', () => { if (!isMobile()) closeDrawer(); bindAccordions(); });

  /* ---------- Accordions (mobile only) ---------- */
  function expand(item){
    const dd = item.querySelector('.dropdown');
    if (!dd) return;
    item.classList.add('expanded');
    dd.style.maxHeight = dd.scrollHeight + 'px';
    const caret = item.querySelector('.caret');
    caret?.setAttribute('aria-expanded','true');
  }
  function collapse(item){
    const dd = item.querySelector('.dropdown');
    if (!dd) return;
    item.classList.remove('expanded');
    dd.style.maxHeight = '0px';
    const caret = item.querySelector('.caret');
    caret?.setAttribute('aria-expanded','false');
  }
  function toggleItem(item){
    item.classList.contains('expanded') ? collapse(item) : expand(item);
  }

  function bindAccordions(){
    const items = drawer.querySelectorAll('.nav-item.has-menu');
    items.forEach(item => {
      const link  = item.querySelector('.nav-link');
      const caret = item.querySelector('.caret');
      const dd    = item.querySelector('.dropdown');
      if (!link || !dd) return;

      // clear old listeners
      link.replaceWith(link.cloneNode(true));
      const link2 = item.querySelector('.nav-link');
      if (caret){
        caret.replaceWith(caret.cloneNode(true));
      }

      if (isMobile()){
        // tap either caret or label to toggle
        link2.addEventListener('click', (ev) => { ev.preventDefault(); toggleItem(item); });
        item.querySelector('.caret')?.addEventListener('click', (ev) => { ev.preventDefault(); toggleItem(item); });
        collapse(item); // ensure closed by default
      } else {
        // desktop uses hover CSS only — keep collapsed state clean
        dd.style.maxHeight = '';
        item.classList.remove('expanded');
        item.querySelector('.caret')?.setAttribute('aria-expanded','false');
      }
    });

    // close drawer when a leaf link is clicked (mobile)
    drawer.querySelector('.nav').addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const isDropdownLink = !!a.closest('.dropdown');
      const parentHasMenu  = !!a.closest('.has-menu');
      if (isMobile() && (isDropdownLink || !parentHasMenu)) closeDrawer();
    }, { once:true });
  }

  bindAccordions();
})();



// this function is came from main.html images grid 

const psEls = document.querySelectorAll("[data-p-s]");

window.addEventListener("scroll", () => {
  psEls.forEach((el, i) => {
    const speed = 0.1 + i * 0.02; 
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});





// scrolling the iamge the approach function

(() => {
  const section = document.querySelector('#approach');
  const cardsA = [...document.querySelectorAll('.ap-a')]; // top two
  const cardB  = document.querySelector('.ap-b');          // middle one
  const cardsC = [...document.querySelectorAll('.ap-c')]; // bottom two

  // initial vertical anchors (in pixels) so cards start visible in the viewport
  const startY = {
    a1: 120,   // first group baseline
    a2: 180,
    b : 260,   // middle
    c1: 380,   // last group
    c2: 440
  };

  // apply initial Y positions
  function setInitial() {
    if (cardsA[0]) cardsA[0].style.transform = `translateY(${startY.a1}px)`;
    if (cardsA[1]) cardsA[1].style.transform = `translateY(${startY.a2}px)`;
    if (cardB)     cardB.style.transform     = `translateY(${startY.b}px)`;
    if (cardsC[0]) cardsC[0].style.transform = `translateY(${startY.c1}px)`;
    if (cardsC[1]) cardsC[1].style.transform = `translateY(${startY.c2}px)`;
  }
  setInitial();

  // map [0..1] -> [from..to]
  const lerp = (t, from, to) => from + (to - from) * Math.min(1, Math.max(0, t));

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;

    // progress of the whole section across the viewport (0 at enter, 1 near exit)
    const total = section.offsetHeight - viewH;
    const scrolled = Math.min(Math.max(window.scrollY - (section.offsetTop), 0), total);
    const progress = total > 0 ? scrolled / total : 0;

    // Split into three stages (0-0.33, 0.33-0.66, 0.66-1)
    const pA = Math.min(progress / 0.33, 1);                     // first stage
    const pB = Math.min(Math.max((progress - 0.33)/0.33, 0), 1); // second stage
    const pC = Math.min(Math.max((progress - 0.66)/0.34, 0), 1); // third stage

    // Move amounts (negative goes up)
    const upShort = -220;
    const upMid   = -260;

    // Group A: translate during stage A
    if (cardsA[0]) cardsA[0].style.transform = `translateY(${lerp(pA, startY.a1, startY.a1 + upShort)}px)`;
    if (cardsA[1]) cardsA[1].style.transform = `translateY(${lerp(pA, startY.a2, startY.a2 + upShort)}px)`;

    // Group B: translate during stage B
    if (cardB)     cardB.style.transform     = `translateY(${lerp(pB, startY.b,  startY.b  + upMid)}px)`;

    // Group C: translate during stage C
    if (cardsC[0]) cardsC[0].style.transform = `translateY(${lerp(pC, startY.c1, startY.c1 + upShort)}px)`;
    if (cardsC[1]) cardsC[1].style.transform = `translateY(${lerp(pC, startY.c2, startY.c2 + upShort)}px)`;
  }

  // run
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();











/* ✅ isolate testimonials slider and avoid 'slides' name clash */
(() => {
  const tSlides = [
    { leftImg:"assets/images/cleint.jpg",  rightImg:"assets/images/cleint.jpg",
      text:"A rebrand is not typically done in a chaotic, archaic industry like ours, so their work has really set us apart. 10/10 for the team.",
      name:"B. Gordon", title:"CEO Founder, Archin Studio" },
    { leftImg:"assets/images/cleni3.jpg",  rightImg:"assets/images/cleni3.jpg",
      text:"They understood our brand instantly and delivered assets that just work in the real world. Super smooth collaboration.",
      name:"Priya N.", title:"Marketing Head, Auric Labs" },
    { leftImg:"assets/images/client2.jpg", rightImg:"assets/images/client2.jpg",
      text:"From strategy to execution, everything felt thoughtful and high quality. We saw results in weeks.",
      name:"J. Morales", title:"Director, Finch Co." }
  ];

  const leftImg = document.querySelector(".t-img-left");
  const rightImg = document.querySelector(".t-img-right");
  const textEl  = document.querySelector(".t-text");
  const nameEl  = document.querySelector(".t-name");
  const titleEl = document.querySelector(".t-title");
  const prevBtn = document.querySelector(".t-prev");
  const nextBtn = document.querySelector(".t-next");
  const idxCur  = document.getElementById("t-index-cur");
  const idxMax  = document.getElementById("t-index-max");
  if (!leftImg || !rightImg) return;

  idxMax.textContent = tSlides.length;
  let i = 0, timer;

  function render(index, animate=true){
    const s = tSlides[index];
    const swap = () => {
      leftImg.src  = s.leftImg;
      rightImg.src = s.rightImg;
      textEl.textContent  = s.text;
      nameEl.textContent  = s.name;
      titleEl.textContent = s.title;
    };
    if (!animate) { swap(); idxCur.textContent = index+1; return; }

    [leftImg, rightImg, textEl].forEach(el=>{
      el.classList.remove("t-enter-active");
      el.classList.add("t-exit");
      requestAnimationFrame(()=>{
        el.classList.add("t-exit-active");
        setTimeout(()=>{
          el.classList.remove("t-exit","t-exit-active");
          el.classList.add("t-enter");
          swap();
          requestAnimationFrame(()=>{
            el.classList.add("t-enter-active");
            el.classList.remove("t-enter");
          });
        }, 220);
      });
    });
    idxCur.textContent = index + 1;
  }

  function next(){ i = (i + 1) % tSlides.length; render(i); restart(); }
  function prev(){ i = (i - 1 + tSlides.length) % tSlides.length; render(i); restart(); }

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  function restart(){ clearInterval(timer); timer = setInterval(next, 5000); }

  render(0, false);
  timer = setInterval(next, 5000);
})();

