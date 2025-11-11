document.addEventListener('DOMContentLoaded', () => {
  const html      = document.documentElement;
  const hamburger = document.getElementById('hamburger');
  const siteNav   = document.getElementById('site-nav');
  const navClose  = document.getElementById('nav-close');

  // Only proceed if we actually have the elements
  if (hamburger && siteNav) {
    const openNav = () => {
      siteNav.classList.add('open');
      siteNav.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      html.classList.add('nav-open');          // <-- hides hamburger via CSS
    };

    const closeNav = () => {
      siteNav.classList.remove('open');
      siteNav.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      html.classList.remove('nav-open');
      // collapse any open mobile dropdowns
      siteNav.querySelectorAll('.dropdown.open').forEach(li => li.classList.remove('open'));
    };

    hamburger.addEventListener('click', () => {
      siteNav.classList.contains('open') ? closeNav() : openNav();
    });

    if (navClose) navClose.addEventListener('click', closeNav);

    // backdrop click (click outside the centered list closes)
    siteNav.addEventListener('click', (e) => {
      const card = siteNav.querySelector('.nav-overlay-list');
      if (card && !card.contains(e.target)) closeNav();
    });

    // Mobile accordion: tap "Home ▾" to show "home1"
    siteNav.querySelectorAll('.dropdown > .dropbtn').forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', (e) => {
        if (!siteNav.classList.contains('open')) return; // desktop: allow normal nav
        e.preventDefault();
        const li = btn.closest('.dropdown');
        const isOpen = li.classList.contains('open');
        // optional: close others
        siteNav.querySelectorAll('.dropdown.open').forEach(x => { if (x !== li) x.classList.remove('open'); });
        li.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  // ---- Guard your video popup code so it doesn't crash when elements are missing ----
  const playBtn    = document.getElementById('playVideoBtn');
  const videoPopup = document.getElementById('videoPopup');
  const closePopup = document.getElementById('closePopup');
  const videoFrame = document.getElementById('videoFrame');

  if (playBtn && videoPopup && closePopup && videoFrame) {
    const videoURL = "https://www.youtube.com/embed/digpucxFbMo?autoplay=1&si=i5XZONAZM2mBjTM-";
    playBtn.addEventListener('click', () => {
      videoFrame.src = videoURL;
      videoPopup.classList.add('active');
    });
    closePopup.addEventListener('click', () => {
      videoPopup.classList.remove('active');
      videoFrame.src = "";
    });
    videoPopup.addEventListener('click', (e) => {
      if (e.target === videoPopup) {
        videoPopup.classList.remove('active');
        videoFrame.src = "";
      }
    });
  }
});
