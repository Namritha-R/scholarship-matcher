// ═══ Saved Scholarships Tracker ═══
import { scholarships } from '../data/scholarships.js';
import { getSaved, removeScholarship } from '../utils/storage.js';
import { showToast, exportToCSV } from '../utils/helpers.js';

export function renderTracker(container, navigateTo) {
  function render() {
    const savedIds = getSaved();
    const savedScholarships = savedIds.map(id => scholarships.find(s => s.id === id)).filter(Boolean);

    if (!savedScholarships.length) {
      container.innerHTML = `
        <div class="tracker-section"><div class="container">
          <div class="tracker-empty">
            <div class="tracker-empty-icon">📌</div>
            <h3>No Saved Scholarships Yet</h3>
            <p>Find and save scholarships from the results page to track them here.</p>
            <button class="btn btn-primary" id="go-find">Find Scholarships</button>
          </div>
        </div></div>`;
      container.querySelector('#go-find')?.addEventListener('click', () => navigateTo('form'));
      return;
    }

    container.innerHTML = `
      <div class="tracker-section"><div class="container">
        <div class="tracker-header">
          <h2>📌 Saved Scholarships <span class="tracker-count">(${savedScholarships.length})</span></h2>
          <div class="tracker-actions">
            <button class="btn btn-sm btn-secondary" id="export-csv">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Export CSV
            </button>
          </div>
        </div>
        <div class="tracker-grid">
          ${savedScholarships.map(s => `
            <div class="tracker-card" data-id="${s.id}">
              <div class="tracker-card-header">
                <h3>${s.name}</h3>
                <button class="btn-remove" data-id="${s.id}" title="Remove">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="tracker-card-meta">
                <span>🏛️ ${s.org}</span>
                <span>📍 ${s.country}</span>
                <span class="deadline-badge soon">📅 ${s.deadline}</span>
              </div>
              <div class="card-tags">${s.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}</div>
              <div class="tracker-card-footer">
                <span class="card-amount">${s.amount}</span>
                <a href="${s.link}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">Apply ↗</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div></div>`;

    // Bind events
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeScholarship(parseInt(btn.dataset.id));
        showToast('Scholarship removed', 'info');
        render();
      });
    });

    container.querySelector('#export-csv')?.addEventListener('click', () => {
      exportToCSV(savedScholarships);
      showToast('CSV exported!', 'success');
    });
  }

  render();
}
