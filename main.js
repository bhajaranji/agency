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







(function () {
  document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
    const btn  = item.querySelector('.nav-link');
    const menu = item.querySelector('.dropdown');

    function setOpen(state){
      item.classList.toggle('open', state);
      btn.setAttribute('aria-expanded', String(state));
    }

    // Toggle on button click
    btn.addEventListener('click', function (e){
      e.preventDefault();
      const willOpen = !item.classList.contains('open');
      // close other open menus
      document.querySelectorAll('.nav-item.has-dropdown.open').forEach(el => {
        if (el !== item) el.classList.remove('open');
      });
      setOpen(willOpen);
    });

    // Close on outside click
    document.addEventListener('click', function(e){
      if (!item.contains(e.target)) setOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') setOpen(false);
    });
  });

})();





(function () {
  // Desktop-only behavior
  const mq = window.matchMedia('(min-width: 900px)');

  function wireDesktopDropdowns() {
    // Clean any previous handlers by cloning (simple reset when crossing breakpoints)
    document.querySelectorAll('.nav-desktop .dropdown').forEach((item) => {
      const btn  = item.querySelector('.dropbtn');
      const menu = item.querySelector('.dropdown-content');
      if (!btn || !menu) return;

      // remove old cloned state if any
      let hideTimer = null;

      const open = () => {
        clearTimeout(hideTimer);
        item.classList.add('open');
      };
      const scheduleClose = () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          item.classList.remove('open');
        }, 250); // <-- keeps it from "going fast" when mouse moves
      };

      // Ensure we start closed
      item.classList.remove('open');

      // Keep open while pointer is over button OR menu
      btn.addEventListener('mouseenter', open);
      menu.addEventListener('mouseenter', open);

      btn.addEventListener('mouseleave', scheduleClose);
      menu.addEventListener('mouseleave', scheduleClose);

      // Click should navigate normally; do not preventDefault on links
      // But stop the outside-click closer from firing immediately
      btn.addEventListener('click', (e) => {
        // If your .dropbtn is an <a> to a page (home2.html), let it navigate.
        // No toggle here; the menu is hover-controlled on desktop.
        e.stopPropagation();
      });
      menu.addEventListener('click', (e) => {
        e.stopPropagation(); // allow clicking links without closing too early
      });
    });
  }

  function unWireDesktopDropdowns() {
    // Close all when leaving desktop to avoid leftover states
    document.querySelectorAll('.nav-desktop .dropdown.open')
      .forEach((el) => el.classList.remove('open'));
  }

  // Initial attach
  if (mq.matches) wireDesktopDropdowns();

  // Re-run when crossing the 900px boundary
  mq.addEventListener('change', (e) => {
    if (e.matches) {
      wireDesktopDropdowns();
    } else {
      unWireDesktopDropdowns();
    }
  });

  // Outside click (desktop): close if open and click outside
  document.addEventListener('click', (e) => {
    if (!mq.matches) return; // desktop only
    document.querySelectorAll('.nav-desktop .dropdown.open').forEach((item) => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });
})();





