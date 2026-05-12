// ═══ Hero Page Component ═══
import { animateCounter } from '../utils/helpers.js';

export function renderHero(container, navigateTo) {
  container.innerHTML = `
    <div class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge"><span class="pulse-dot"></span> Live Scholarship Discovery</div>
          <h1 class="hero-title">Find Your Perfect<br><span class="gradient-text">Scholarship</span> — Anywhere</h1>
          <p class="hero-subtitle">Discover scholarships for every education level — school to PhD — across 50+ countries. Our smart matching engine finds opportunities tailored to your unique profile.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" id="hero-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Find Scholarships
            </button>
            <button class="btn btn-secondary btn-lg" id="hero-learn">
              How It Works
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-card"><div class="stat-number"><span class="gradient-text counter" data-target="500">0</span>+</div><div class="stat-label">Scholarships</div></div>
            <div class="stat-card"><div class="stat-number"><span class="gradient-text counter" data-target="50">0</span>+</div><div class="stat-label">Countries</div></div>
            <div class="stat-card"><div class="stat-number"><span class="gradient-text counter" data-target="6">0</span></div><div class="stat-label">Education Levels</div></div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-floating-cards">
            <div class="floating-card">
              <div class="fc-icon" style="background:var(--success-bg);color:var(--success)">🎓</div>
              <div class="fc-title">Fulbright Scholarship</div>
              <div class="fc-desc">USA • Full Funding</div>
              <div class="fc-amount">$70,000</div>
            </div>
            <div class="floating-card">
              <div class="fc-icon" style="background:var(--primary-muted);color:var(--primary)">🇬🇧</div>
              <div class="fc-title">Chevening Scholars</div>
              <div class="fc-desc">UK • Master's Degree</div>
              <div class="fc-amount">£65,000</div>
            </div>
            <div class="floating-card">
              <div class="fc-icon" style="background:var(--warning-bg);color:var(--warning)">🌍</div>
              <div class="fc-title">Erasmus Mundus</div>
              <div class="fc-desc">Europe • Joint Degree</div>
              <div class="fc-amount">€25,000</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="how-section container" id="how-section">
      <div class="section-header">
        <h2>How <span class="gradient-text">ScholarPath</span> Works</h2>
        <p>Three simple steps to find scholarships perfectly matched to your profile</p>
      </div>
      <div class="how-grid">
        <div class="how-card"><div class="how-step">1</div><div class="how-icon">📋</div><h3>Build Your Profile</h3><p>Tell us about your education level, field of interest, nationality, and goals. It takes less than 2 minutes.</p></div>
        <div class="how-card"><div class="how-step">2</div><div class="how-icon">🤖</div><h3>Smart Matching</h3><p>Our algorithm scores every scholarship against your profile and ranks them by compatibility percentage.</p></div>
        <div class="how-card"><div class="how-step">3</div><div class="how-icon">🌐</div><h3>Discover & Apply</h3><p>Browse matched scholarships, save favorites, and search the web for even more live opportunities.</p></div>
      </div>
    </div>

    <div class="levels-section container">
      <div class="section-header">
        <h2>Scholarships for <span class="gradient-text">Every Level</span></h2>
        <p>Whether you're in school or pursuing a postdoc, we've got you covered</p>
      </div>
      <div class="levels-grid">
        <div class="level-card" data-level="School (K-12)"><div class="level-icon">🏫</div><h4>School (K-12)</h4><p>IB, Exchange Programs</p></div>
        <div class="level-card" data-level="Undergraduate"><div class="level-icon">🎓</div><h4>Undergraduate</h4><p>Bachelor's Degrees</p></div>
        <div class="level-card" data-level="Masters"><div class="level-icon">📚</div><h4>Master's</h4><p>Postgraduate Study</p></div>
        <div class="level-card" data-level="PhD"><div class="level-icon">🔬</div><h4>PhD</h4><p>Doctoral Research</p></div>
        <div class="level-card" data-level="Postdoctoral"><div class="level-icon">🧬</div><h4>Postdoctoral</h4><p>Research Fellowships</p></div>
        <div class="level-card" data-level="Professional"><div class="level-icon">💼</div><h4>Professional</h4><p>Career Development</p></div>
      </div>
    </div>

    <footer class="hero-footer container">
      <div class="footer-content">
        <p>© ${new Date().getFullYear()} ScholarPath — Built to empower learners worldwide</p>
        <p>Data is curated + live web search powered</p>
      </div>
    </footer>
  `;

  // Animate counters on view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        container.querySelectorAll('.counter').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        observer.disconnect();
      }
    });
  });
  const statsEl = container.querySelector('.hero-stats');
  if (statsEl) observer.observe(statsEl);

  // Navigation
  container.querySelector('#hero-cta').addEventListener('click', () => navigateTo('form'));
  container.querySelector('#hero-learn').addEventListener('click', () => {
    document.getElementById('how-section').scrollIntoView({ behavior: 'smooth' });
  });

  // Level cards navigate to form with pre-selected level
  container.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo('form', { level: card.dataset.level });
    });
  });
}
