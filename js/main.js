// ═══ SkolarX — Main Entry Point ═══
import { renderHero } from './components/hero.js';
import { renderForm } from './components/form.js';
import { renderResults } from './components/results.js';
import { renderTracker } from './components/tracker.js';
import { getTheme, setTheme } from './utils/storage.js';

// ─── Theme ───
const html = document.documentElement;
html.setAttribute('data-theme', getTheme());

document.getElementById('theme-toggle').addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  setTheme(next);
});

// ─── Scroll-based navbar ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ─── Hamburger ───
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// ─── Router ───
const pages = { hero: 'page-hero', form: 'page-form', results: 'page-results', tracker: 'page-tracker' };
let currentPage = 'hero';

function navigateTo(page, data = {}) {
  // Hide all
  Object.values(pages).forEach(id => {
    document.getElementById(id).classList.remove('active');
  });

  // Update nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  currentPage = page;
  const container = document.getElementById(pages[page]);

  // Render page
  switch (page) {
    case 'hero': renderHero(container, navigateTo); break;
    case 'form': renderForm(container, navigateTo, data); break;
    case 'results': renderResults(container, navigateTo, data); break;
    case 'tracker': renderTracker(container, navigateTo); break;
  }

  // Activate + scroll to top
  container.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  navLinks.classList.remove('open');
}

// Nav links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// Logo click -> home
document.getElementById('nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('hero');
});

// ─── Initial render ───
navigateTo('hero');
