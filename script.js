// mobile nav
const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
navToggle?.addEventListener('click', () => {
  menu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(menu.classList.contains('open')));
});

// close menu on link click (mobile)
menu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => menu.classList.remove('open'));
});

// active link helper (matches by pathname file name)
(function markActive(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && href.endsWith(here)) a.classList.add('active');
  });
})();
