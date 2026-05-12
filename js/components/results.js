// ═══ Results Dashboard Component ═══
import { scholarships, EDUCATION_LEVELS, FIELDS, REGIONS, buildScholarshipSearchURLs } from '../data/scholarships.js';
import { matchScholarships } from '../engine/matcher.js';
import { isSaved, saveScholarship, removeScholarship, getProfile } from '../utils/storage.js';
import { showToast } from '../utils/helpers.js';
import { db } from '../utils/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export function renderResults(container, navigateTo, data = {}) {
  const profile = data.profile || getProfile();
  if (!profile || !profile.level) {
    container.innerHTML = `<div class="results-section"><div class="container"><div class="no-results"><div class="no-results-icon">📋</div><h3>No Profile Found</h3><p>Please fill in your profile first so we can match scholarships for you.</p><button class="btn btn-primary" id="go-form">Build Your Profile</button></div></div></div>`;
    container.querySelector('#go-form')?.addEventListener('click', () => navigateTo('form'));
    return;
  }

  // Show loading state
  container.innerHTML = `
    <div class="results-section">
      <div class="container">
        <div class="no-results" style="padding:var(--space-3xl) 0">
          <div class="loading-icon">⏳</div>
          <h3>Connecting to Database...</h3>
          <p>Fetching the most up-to-date scholarships from the internet.</p>
        </div>
      </div>
    </div>`;

  // Fetch and Render
  loadAndRender();

  async function loadAndRender() {
    let currentScholarships = scholarships; // fallback
    let isLive = false;
    
    try {
      if (db) {
        const snapshot = await getDocs(collection(db, 'scholarships'));
        if (!snapshot.empty) {
          currentScholarships = snapshot.docs.map(doc => doc.data());
          isLive = true;
          console.log(`Loaded ${currentScholarships.length} scholarships from Firestore.`);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch from Firestore. Using static fallback.", error);
    }

    let results = matchScholarships(profile, currentScholarships);
    let filtered = [...results];
    let sortBy = 'match';
    let activeFilters = { level: [], region: [], minAmount: 0 };

    function render() {
      const searchURLs = buildScholarshipSearchURLs(profile);
      container.innerHTML = `
        <div class="results-section">
          <div class="container">
            <div class="results-header">
              <div>
                <h2>Your <span class="gradient-text">Matched</span> Scholarships</h2>
                <p class="results-count">Showing <strong>${filtered.length}</strong> of ${results.length} matched scholarships ${isLive ? '<span class="live-badge">Live DB</span>' : ''}</p>
              </div>
              <div class="results-actions">
                <button class="btn btn-sm btn-secondary" id="toggle-filters-mobile" style="display:none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
                  Filters
                </button>
                <select class="sort-select" id="sort-select">
                  <option value="match">Best Match</option>
                  <option value="amount">Highest Amount</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>
            ${renderActiveFilters()}
            <div class="results-layout">
              <aside class="filter-sidebar" id="filter-sidebar">
                <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M4 6h16M7 12h10M10 18h4"/></svg> Filters</h3>
                <div class="filter-section">
                  <h4>Education Level</h4>
                  <div class="filter-options">${EDUCATION_LEVELS.map(l => `<label class="form-check"><input type="checkbox" data-filter="level" value="${l}" ${activeFilters.level.includes(l)?'checked':''}><span class="form-check-label">${l}</span></label>`).join('')}</div>
                </div>
                <div class="filter-section">
                  <h4>Region</h4>
                  <div class="filter-options">${REGIONS.filter(r=>r!=='Global').map(r => `<label class="form-check"><input type="checkbox" data-filter="region" value="${r}" ${activeFilters.region.includes(r)?'checked':''}><span class="form-check-label">${r}</span></label>`).join('')}</div>
                </div>
                <div class="filter-section">
                  <h4>Min. Amount ($)</h4>
                  <input type="range" min="0" max="90000" step="5000" value="${activeFilters.minAmount}" id="filter-amount">
                  <div class="range-value" id="filter-amount-val">$${activeFilters.minAmount.toLocaleString()}</div>
                </div>
              </aside>
              <div class="results-grid" id="results-grid">
                ${filtered.length ? filtered.map(s => renderCard(s)).join('') : `<div class="no-results"><div class="no-results-icon">🔍</div><h3>No Matches Found</h3><p>Try adjusting your filters or broadening your profile preferences.</p><button class="btn btn-secondary" id="clear-all-filters">Clear All Filters</button></div>`}
                <div class="web-search-cta">
                  <h4>🌐 Discover More Scholarships on the Web</h4>
                  <p>Our database is updated automatically, but you can always search for live, real-time listings on Google.</p>
                  <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
                    ${searchURLs.map(q => `<a href="${q.url}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary">${q.label} ↗</a>`).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      bindEvents();
    }

    function renderActiveFilters() {
      const chips = [];
      activeFilters.level.forEach(l => chips.push(`<span class="filter-chip">${l} <button data-remove="level" data-val="${l}">×</button></span>`));
      activeFilters.region.forEach(r => chips.push(`<span class="filter-chip">${r} <button data-remove="region" data-val="${r}">×</button></span>`));
      if (activeFilters.minAmount > 0) chips.push(`<span class="filter-chip">Min $${activeFilters.minAmount.toLocaleString()} <button data-remove="amount">×</button></span>`);
      if (!chips.length) return '';
      return `<div class="active-filters">${chips.join('')}<button class="clear-filters" id="clear-filters">Clear All</button></div>`;
    }

    function applyFilters() {
      filtered = results.filter(s => {
        if (activeFilters.level.length && !activeFilters.level.some(l => s.level.includes(l))) return false;
        if (activeFilters.region.length && !activeFilters.region.includes(s.region)) return false;
        if (activeFilters.minAmount > 0 && s.amountNum < activeFilters.minAmount) return false;
        return true;
      });
      applySort();
    }

    function applySort() {
      if (sortBy === 'match') filtered.sort((a, b) => b.matchScore - a.matchScore);
      else if (sortBy === 'amount') filtered.sort((a, b) => b.amountNum - a.amountNum);
      else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
      render();
    }

    function bindEvents() {
      container.querySelector('#sort-select').value = sortBy;
      container.querySelector('#sort-select').addEventListener('change', e => { sortBy = e.target.value; applySort(); });

      container.querySelectorAll('[data-filter]').forEach(cb => {
        cb.addEventListener('change', () => {
          const type = cb.dataset.filter;
          if (cb.checked) activeFilters[type].push(cb.value);
          else activeFilters[type] = activeFilters[type].filter(v => v !== cb.value);
          applyFilters();
        });
      });

      const amountRange = container.querySelector('#filter-amount');
      if (amountRange) {
        amountRange.addEventListener('input', e => {
          activeFilters.minAmount = parseInt(e.target.value);
          container.querySelector('#filter-amount-val').textContent = '$' + activeFilters.minAmount.toLocaleString();
        });
        amountRange.addEventListener('change', () => applyFilters());
      }

      container.querySelectorAll('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.remove;
          if (type === 'amount') activeFilters.minAmount = 0;
          else activeFilters[type] = activeFilters[type].filter(v => v !== btn.dataset.val);
          applyFilters();
        });
      });

      container.querySelector('#clear-filters')?.addEventListener('click', () => { activeFilters = { level: [], region: [], minAmount: 0 }; applyFilters(); });
      container.querySelector('#clear-all-filters')?.addEventListener('click', () => { activeFilters = { level: [], region: [], minAmount: 0 }; applyFilters(); });

      container.querySelectorAll('.scholarship-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-save')) return;
          const id = card.dataset.id;
          const s = results.find(x => x.id.toString() === id);
          if (s) showModal(s, profile);
        });
      });

      container.querySelectorAll('.btn-save').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          if (isSaved(id)) { removeScholarship(id); btn.classList.remove('saved'); showToast('Removed from saved', 'info'); }
          else { saveScholarship(id); btn.classList.add('saved'); showToast('Saved!', 'success'); }
        });
      });

      if (window.innerWidth <= 768) {
        container.querySelector('#toggle-filters-mobile').style.display = 'inline-flex';
        container.querySelector('#toggle-filters-mobile')?.addEventListener('click', () => {
          container.querySelector('#filter-sidebar').classList.toggle('open');
        });
      }
    }

    render();
  }
}

function renderCard(s) {
  const matchClass = s.matchScore >= 80 ? 'high' : s.matchScore >= 50 ? 'medium' : 'low';
  const saved = isSaved(s.id);
  return `
    <div class="scholarship-card" data-id="${s.id}">
      <div class="card-header">
        <h3>${s.name}</h3>
        <div class="match-badge ${matchClass}">${s.matchScore}%<small>match</small></div>
      </div>
      <div class="card-org">${s.org}</div>
      <div class="card-details">
        <span class="card-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${s.country}</span>
        <span class="card-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>${s.level.join(', ')}</span>
        <span class="card-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>${s.deadline}</span>
      </div>
      <div class="card-tags">${s.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
      <div class="card-footer">
        <span class="card-amount">${s.amount}</span>
        <div class="card-actions">
          <button class="btn-save ${saved?'saved':''}" data-id="${s.id}" title="${saved?'Remove':'Save'}">
            <svg viewBox="0 0 24 24" fill="${saved?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function showModal(s, profile) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('scholarship-modal');
  const matchClass = s.matchScore >= 80 ? 'high' : s.matchScore >= 50 ? 'medium' : 'low';

  modal.innerHTML = `
    <div class="modal-header">
      <div><div class="match-badge ${matchClass}" style="width:60px;height:60px;font-size:1rem;margin-bottom:8px">${s.matchScore}%<small>match</small></div></div>
      <button class="modal-close" id="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <h2>${s.name}</h2>
      <p class="modal-org">${s.org}</p>
      <div class="modal-stats">
        <div class="modal-stat"><div class="stat-val" style="color:var(--success)">${s.amount}</div><div class="stat-lbl">Funding</div></div>
        <div class="modal-stat"><div class="stat-val">${s.country}</div><div class="stat-lbl">Country</div></div>
        <div class="modal-stat"><div class="stat-val">${s.deadline}</div><div class="stat-lbl">Deadline</div></div>
      </div>
      <div class="modal-desc"><h4>About This Scholarship</h4><p>${s.description}</p></div>
      <h4 style="margin-bottom:8px">Eligibility</h4>
      <ul class="eligibility-list">
        <li><span class="${s.level.includes(profile.level)?'check':'cross'}">${s.level.includes(profile.level)?'✓':'✗'}</span> Level: ${s.level.join(', ')}</li>
        <li><span class="${!s.eligibility.gpa || (profile.gpa && profile.gpa >= s.eligibility.gpa)?'check':'cross'}">${!s.eligibility.gpa || (profile.gpa && profile.gpa >= s.eligibility.gpa)?'✓':'✗'}</span> Min GPA: ${s.eligibility.gpa || 'None'}</li>
        <li><span class="check">ℹ</span> Nationality: ${s.eligibility.nationality}</li>
        <li><span class="check">ℹ</span> Financial Need: ${s.eligibility.financialNeed ? 'Required' : 'Not Required'}</li>
        <li><span class="check">ℹ</span> Gender: ${s.eligibility.gender}</li>
      </ul>
      <div class="card-tags" style="margin-bottom:16px">${s.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
    </div>
    <div class="modal-footer">
      <a href="${s.link}" target="_blank" rel="noopener" class="btn btn-primary" style="flex:1">Apply Now ↗</a>
      <button class="btn btn-secondary modal-save-btn" data-id="${s.id}" style="flex:1">${isSaved(s.id)?'★ Saved':'☆ Save'}</button>
    </div>
  `;

  overlay.classList.add('active');

  modal.querySelector('#modal-close').addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });

  modal.querySelector('.modal-save-btn').addEventListener('click', (e) => {
    const id = e.currentTarget.dataset.id;
    if (isSaved(id)) { removeScholarship(id); e.currentTarget.textContent = '☆ Save'; showToast('Removed', 'info'); }
    else { saveScholarship(id); e.currentTarget.textContent = '★ Saved'; showToast('Saved!', 'success'); }
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') { overlay.classList.remove('active'); document.removeEventListener('keydown', escHandler); }
  });
}
