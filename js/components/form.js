// ═══ Multi-Step Form Component ═══
// Country-aware academic fields (India: 12th marks, USA: GPA, etc.)
import { EDUCATION_LEVELS, FIELDS, REGIONS } from '../data/scholarships.js';
import { saveProfile } from '../utils/storage.js';

const COUNTRY_LIST = ['Afghanistan','Argentina','Australia','Bangladesh','Brazil','Canada','China','Colombia','Egypt','Ethiopia','France','Germany','Ghana','India','Indonesia','Iran','Iraq','Ireland','Italy','Jamaica','Japan','Jordan','Kenya','Malaysia','Mexico','Morocco','Nepal','Netherlands','New Zealand','Nigeria','Pakistan','Philippines','Poland','Russia','Saudi Arabia','Senegal','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sweden','Switzerland','Tanzania','Thailand','Turkey','UAE','Uganda','UK','Ukraine','USA','Vietnam','Zimbabwe'];

// ─── Country-specific academic system configurations ───
const ACADEMIC_SYSTEMS = {
  India: {
    schoolScore: { label: '12th Marks / Percentage', placeholder: 'e.g. 85', unit: '%', max: 100, step: 1 },
    ugEntrance: [
      { id: 'jee', label: 'JEE Main/Advanced Percentile', placeholder: 'e.g. 95', optional: true },
      { id: 'neet', label: 'NEET Score', placeholder: 'e.g. 620', optional: true },
      { id: 'cuet', label: 'CUET Score', placeholder: 'e.g. 750', optional: true },
    ],
    pgEntrance: [
      { id: 'gate', label: 'GATE Score', placeholder: 'e.g. 550', optional: true },
      { id: 'cat', label: 'CAT Percentile', placeholder: 'e.g. 98', optional: true },
    ],
    ugScore: { label: 'CGPA / Percentage', placeholder: 'e.g. 8.5 or 82', unit: 'CGPA (10) or %', max: 100, step: 0.1 },
    abroadTests: ['TOEFL','IELTS','GRE','GMAT'],
  },
  USA: {
    schoolScore: { label: 'High School GPA', placeholder: 'e.g. 3.8', unit: '/ 4.0', max: 4, step: 0.1 },
    ugEntrance: [
      { id: 'sat', label: 'SAT Score', placeholder: 'e.g. 1450', optional: true },
      { id: 'act', label: 'ACT Score', placeholder: 'e.g. 32', optional: true },
    ],
    pgEntrance: [
      { id: 'gre', label: 'GRE Score', placeholder: 'e.g. 325', optional: true },
      { id: 'gmat', label: 'GMAT Score', placeholder: 'e.g. 720', optional: true },
    ],
    ugScore: { label: 'College GPA', placeholder: 'e.g. 3.5', unit: '/ 4.0', max: 4, step: 0.1 },
    abroadTests: [],
  },
  UK: {
    schoolScore: { label: 'A-Level Grades / UCAS Points', placeholder: 'e.g. A*AA or 144', unit: 'points', max: 200, step: 1 },
    ugEntrance: [],
    pgEntrance: [],
    ugScore: { label: 'Degree Classification (First = 4, 2:1 = 3.5, 2:2 = 3)', placeholder: 'e.g. 3.5', unit: 'equiv. GPA', max: 4, step: 0.1 },
    abroadTests: ['IELTS'],
  },
  China: {
    schoolScore: { label: 'Gaokao Score / Percentage', placeholder: 'e.g. 620 or 85', unit: 'score', max: 750, step: 1 },
    ugEntrance: [],
    pgEntrance: [],
    ugScore: { label: 'GPA / Percentage', placeholder: 'e.g. 3.6 or 88', unit: 'GPA or %', max: 100, step: 0.1 },
    abroadTests: ['TOEFL','IELTS','GRE'],
  },
  Germany: {
    schoolScore: { label: 'Abitur Grade', placeholder: 'e.g. 1.5 (1.0 best)', unit: '/ 6.0', max: 6, step: 0.1 },
    ugEntrance: [],
    pgEntrance: [],
    ugScore: { label: 'University Grade / ECTS', placeholder: 'e.g. 1.8', unit: '/ 6.0 (1.0 best)', max: 6, step: 0.1 },
    abroadTests: ['TOEFL','IELTS','TestDaF'],
  },
  Japan: {
    schoolScore: { label: 'High School GPA / Percentage', placeholder: 'e.g. 4.2 or 88', unit: '/ 5.0 or %', max: 100, step: 0.1 },
    ugEntrance: [{ id: 'eju', label: 'EJU Score', placeholder: 'e.g. 340', optional: true }],
    pgEntrance: [],
    ugScore: { label: 'University GPA', placeholder: 'e.g. 3.4', unit: '/ 4.0', max: 4, step: 0.1 },
    abroadTests: ['TOEFL','IELTS','JLPT'],
  },
  Australia: {
    schoolScore: { label: 'ATAR Score', placeholder: 'e.g. 92', unit: '/ 99.95', max: 99.95, step: 0.05 },
    ugEntrance: [],
    pgEntrance: [],
    ugScore: { label: 'WAM / GPA', placeholder: 'e.g. 78 or 6.2', unit: 'WAM(%) or GPA(/7)', max: 100, step: 0.1 },
    abroadTests: ['IELTS','TOEFL','PTE'],
  },
  Canada: {
    schoolScore: { label: 'High School Average (%)', placeholder: 'e.g. 88', unit: '%', max: 100, step: 1 },
    ugEntrance: [],
    pgEntrance: [{ id: 'gre', label: 'GRE Score', placeholder: 'e.g. 320', optional: true }],
    ugScore: { label: 'University GPA', placeholder: 'e.g. 3.6', unit: '/ 4.0 or / 4.3', max: 4.3, step: 0.1 },
    abroadTests: ['IELTS','TOEFL'],
  },
  South_Korea: {
    schoolScore: { label: 'CSAT Score / Rank', placeholder: 'e.g. 320 or Rank 2', unit: 'score', max: 400, step: 1 },
    ugEntrance: [],
    pgEntrance: [],
    ugScore: { label: 'University GPA', placeholder: 'e.g. 3.8', unit: '/ 4.5', max: 4.5, step: 0.1 },
    abroadTests: ['TOEFL','IELTS','TOPIK'],
  },
};

// Default system for countries not explicitly listed
const DEFAULT_SYSTEM = {
  schoolScore: { label: 'High School Score / GPA', placeholder: 'e.g. 85 or 3.5', unit: '% or GPA', max: 100, step: 0.1 },
  ugEntrance: [],
  pgEntrance: [],
  ugScore: { label: 'University GPA (on 4.0 scale)', placeholder: 'e.g. 3.5', unit: '/ 4.0', max: 4, step: 0.1 },
  abroadTests: ['TOEFL','IELTS','GRE','GMAT'],
};

function getSystem(nationality) {
  const key = nationality?.replace(/\s+/g, '_');
  return ACADEMIC_SYSTEMS[key] || DEFAULT_SYSTEM;
}

// ─── Normalize any score to 4.0 GPA for matching engine ───
export function normalizeToGPA(value, nationality, level, isAbroad) {
  if (!value && value !== 0) return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  const sys = getSystem(nationality);

  // If studying abroad from certain countries, they enter GPA directly for abroad tests
  if (level === 'School (K-12)' || level === 'Undergraduate') {
    const sc = sys.schoolScore;
    if (sc.max === 4) return Math.min(v, 4); // Already GPA/4
    if (sc.max === 100) return (v / 100) * 4; // Percentage -> GPA
    if (sc.max === 6) return ((6 - v) / 5) * 4; // German scale (1=best, 6=worst)
    if (sc.max === 99.95) return (v / 99.95) * 4; // ATAR
    if (sc.max === 750) return (v / 750) * 4; // Gaokao
    if (sc.max === 200) return (v / 200) * 4; // UCAS
    return Math.min(v, 4);
  }

  // Masters/PhD level - university score
  const ug = sys.ugScore;
  if (ug.max <= 5) return (v / ug.max) * 4;
  if (ug.max === 6) return ((6 - v) / 5) * 4; // German
  if (ug.max === 100) return (v / 100) * 4; // Percentage
  if (ug.max === 7) return (v / 7) * 4; // Australian GPA/7
  return Math.min(v, 4);
}

export function renderForm(container, navigateTo, preselect = {}) {
  let step = 1;
  const totalSteps = 5;
  const profile = {
    level: preselect.level || '', field: '', nationality: '', gpa: null,
    destinations: [], financialNeed: false, gender: '', minority: false,
    name: '', age: '', countryOfResidence: '', institution: '',
    workExperience: 0, extracurriculars: '',
    // Country-specific scores (raw)
    rawScore: '', entranceScores: {}, testScores: {},
    studyingAbroad: false,
  };

  container.innerHTML = `
    <div class="form-section">
      <div class="form-wrapper container">
        <div class="form-header">
          <h2>Build Your <span class="gradient-text">Profile</span></h2>
          <p>Answer a few questions so we can find the best scholarships for you</p>
        </div>
        <div class="progress-container">
          <div class="progress-steps">
            <div class="progress-line" id="progress-line" style="width:0%"></div>
            ${[{n:1,l:'Personal'},{n:2,l:'Education'},{n:3,l:'Academics'},{n:4,l:'Eligibility'},{n:5,l:'Extras'}].map(s => `
              <div class="progress-step ${s.n === 1 ? 'active' : ''}" data-step="${s.n}">
                <div class="step-circle">${s.n}</div>
                <span class="step-label">${s.l}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div id="form-steps-container"></div>
        <div class="form-navigation">
          <button class="btn btn-secondary" id="btn-prev" style="visibility:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Previous
          </button>
          <button class="btn btn-primary" id="btn-next">
            Next Step
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const stepsContainer = container.querySelector('#form-steps-container');
  const btnPrev = container.querySelector('#btn-prev');
  const btnNext = container.querySelector('#btn-next');

  function renderStep() {
    stepsContainer.innerHTML = `<div class="form-step active">${getStepHTML(step, profile)}</div>`;
    updateProgress();
    bindStepEvents(step);
    btnPrev.style.visibility = step === 1 ? 'hidden' : 'visible';
    btnNext.innerHTML = step === totalSteps
      ? `Find Scholarships <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`
      : `Next Step <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }

  function updateProgress() {
    const pct = ((step - 1) / (totalSteps - 1)) * 100;
    container.querySelector('#progress-line').style.width = pct + '%';
    container.querySelectorAll('.progress-step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('active', s === step);
      el.classList.toggle('completed', s < step);
      el.querySelector('.step-circle').innerHTML = s < step ? '✓' : s;
    });
  }

  function gv(id) { const el = container.querySelector('#' + id); return el ? el.value : ''; }

  function collectData() {
    if (step === 1) {
      profile.name = gv('input-name');
      profile.age = gv('input-age');
      profile.nationality = gv('input-nationality');
      profile.countryOfResidence = gv('input-residence');
      profile.gender = gv('input-gender');
    } else if (step === 2) {
      profile.level = gv('input-level') || profile.level;
      profile.field = gv('input-field');
      profile.institution = gv('input-institution');
      profile.studyingAbroad = container.querySelector('#input-abroad')?.checked || false;
      profile.destinations = Array.from(container.querySelectorAll('.dest-chip.selected')).map(c => c.dataset.value);
    } else if (step === 3) {
      // Collect raw academic score
      profile.rawScore = gv('input-academic-score');
      // Collect entrance exam scores
      container.querySelectorAll('[data-entrance]').forEach(inp => {
        if (inp.value) profile.entranceScores[inp.dataset.entrance] = inp.value;
      });
      // Collect standardized test scores
      container.querySelectorAll('[data-test]').forEach(inp => {
        if (inp.value) profile.testScores[inp.dataset.test] = inp.value;
      });
      // Normalize to GPA for matching
      profile.gpa = normalizeToGPA(profile.rawScore, profile.nationality, profile.level, profile.studyingAbroad);
    } else if (step === 4) {
      profile.financialNeed = container.querySelector('#input-financial')?.checked || false;
      profile.minority = container.querySelector('#input-minority')?.checked || false;
      profile.workExperience = parseInt(gv('input-experience')) || 0;
    } else if (step === 5) {
      profile.extracurriculars = gv('input-extras');
    }
  }

  btnNext.addEventListener('click', () => {
    collectData();
    if (step < totalSteps) { step++; renderStep(); }
    else { saveProfile(profile); navigateTo('results', { profile }); }
  });

  btnPrev.addEventListener('click', () => {
    collectData();
    if (step > 1) { step--; renderStep(); }
  });

  function bindStepEvents(s) {
    if (s === 2) {
      container.querySelectorAll('.dest-chip').forEach(chip => {
        if (profile.destinations.includes(chip.dataset.value)) chip.classList.add('selected');
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
      });
    }
  }

  renderStep();
}

function getStepHTML(step, profile) {
  const countryOpts = COUNTRY_LIST.map(c => `<option value="${c}" ${profile.nationality===c?'selected':''}>${c}</option>`).join('');
  const sys = getSystem(profile.nationality);
  const isSchool = profile.level === 'School (K-12)';
  const isUG = profile.level === 'Undergraduate';
  const isPG = profile.level === 'Masters' || profile.level === 'PhD' || profile.level === 'Postdoctoral';
  const wantsAbroad = profile.studyingAbroad;
  const countryName = profile.nationality || 'your country';

  switch(step) {
    case 1: return `
      <h3 class="step-title">👤 Personal Information</h3>
      <p class="step-description">Tell us about yourself so we can find region-specific scholarships</p>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Full Name <span class="optional">(optional)</span></label><input class="form-input" id="input-name" value="${profile.name}" placeholder="Your name"></div>
        <div class="form-group"><label class="form-label">Age</label><input class="form-input" id="input-age" type="number" value="${profile.age}" placeholder="e.g. 20" min="10" max="70"></div>
        <div class="form-group"><label class="form-label">Nationality / Home Country</label><select class="form-select" id="input-nationality"><option value="">Select your nationality</option>${countryOpts}</select></div>
        <div class="form-group"><label class="form-label">Country of Residence</label><select class="form-select" id="input-residence"><option value="">Select country</option>${countryOpts}</select></div>
        <div class="form-group full-width"><label class="form-label">Gender</label><select class="form-select" id="input-gender"><option value="">Prefer not to say</option><option ${profile.gender==='Male'?'selected':''}>Male</option><option ${profile.gender==='Female'?'selected':''}>Female</option><option ${profile.gender==='Non-binary'?'selected':''}>Non-binary</option></select></div>
      </div>`;

    case 2: return `
      <h3 class="step-title">🎓 Education & Destination</h3>
      <p class="step-description">Your education level, field, and where you'd like to study</p>
      <div class="form-grid">
        <div class="form-group"><label class="form-label">Current Education Level</label><select class="form-select" id="input-level"><option value="">Select level</option>${EDUCATION_LEVELS.map(l => `<option ${profile.level===l?'selected':''} value="${l}">${l}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Field of Study / Interest</label><select class="form-select" id="input-field"><option value="">Select field</option>${FIELDS.map(f => `<option ${profile.field===f?'selected':''} value="${f}">${f}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Institution Name <span class="optional">(optional)</span></label><input class="form-input" id="input-institution" value="${profile.institution}" placeholder="Your school/university"></div>
        <div class="form-group">
          <label class="form-check"><input type="checkbox" id="input-abroad" ${profile.studyingAbroad?'checked':''}><span class="form-check-label">I want to study abroad (outside my home country)</span></label>
        </div>
        <div class="form-group full-width">
          <label class="form-label">Preferred Study Destinations <span class="optional">(select all that apply)</span></label>
          <div class="chips-container">${REGIONS.map(r => `<div class="chip dest-chip" data-value="${r}">${r}</div>`).join('')}</div>
        </div>
      </div>`;

    case 3: {
      // ─── Country-Aware Academic Scores ───
      const scoreField = (isSchool || isUG) ? sys.schoolScore : sys.ugScore;
      const entranceExams = isUG ? sys.ugEntrance : (isPG ? sys.pgEntrance : []);
      const needsAbroadTests = wantsAbroad && sys.abroadTests.length > 0;
      const systemNote = profile.nationality
        ? `<div class="system-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span>Academic fields adapted for <strong>${countryName}</strong>'s education system. ${wantsAbroad ? 'Standardized test scores (TOEFL/GRE/IELTS) shown for abroad applications.' : ''}</span></div>`
        : '<div class="system-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span>Select your nationality in Step 1 to see country-specific academic fields.</span></div>';

      return `
        <h3 class="step-title">📊 Academic Scores & Tests</h3>
        <p class="step-description">Enter your scores — fields are adapted to ${countryName}'s education system</p>
        ${systemNote}
        <div class="form-grid" style="margin-top:var(--space-lg)">
          <div class="form-group full-width">
            <label class="form-label">${scoreField.label} <span class="optional">(${scoreField.unit})</span></label>
            <input class="form-input" id="input-academic-score" type="number" value="${profile.rawScore}" placeholder="${scoreField.placeholder}" min="0" max="${scoreField.max}" step="${scoreField.step}">
          </div>
          ${entranceExams.length ? `
            <div class="form-group full-width"><h4 style="margin-bottom:4px;font-size:0.95rem">📝 Entrance Exams</h4></div>
            ${entranceExams.map(e => `
              <div class="form-group">
                <label class="form-label">${e.label} <span class="optional">(optional)</span></label>
                <input class="form-input" data-entrance="${e.id}" type="number" value="${profile.entranceScores[e.id]||''}" placeholder="${e.placeholder}">
              </div>
            `).join('')}
          ` : ''}
          ${needsAbroadTests ? `
            <div class="form-group full-width"><h4 style="margin-bottom:4px;font-size:0.95rem">🌐 Standardized Tests (for studying abroad)</h4></div>
            ${sys.abroadTests.map(t => `
              <div class="form-group">
                <label class="form-label">${t} Score <span class="optional">(optional)</span></label>
                <input class="form-input" data-test="${t}" type="number" value="${profile.testScores[t]||''}" placeholder="${getTestPlaceholder(t)}">
              </div>
            `).join('')}
          ` : ''}
        </div>`;
    }

    case 4: return `
      <h3 class="step-title">✅ Eligibility Details</h3>
      <p class="step-description">Help us filter scholarships you qualify for</p>
      <div class="form-grid">
        <div class="form-group full-width">
          <label class="form-check"><input type="checkbox" id="input-financial" ${profile.financialNeed?'checked':''}><span class="form-check-label">I need financial assistance (need-based scholarships)</span></label>
        </div>
        <div class="form-group full-width">
          <label class="form-check"><input type="checkbox" id="input-minority" ${profile.minority?'checked':''}><span class="form-check-label">I identify as part of an underrepresented or minority group</span></label>
        </div>
        <div class="form-group full-width"><label class="form-label">Work Experience (years) <span class="optional">(optional)</span></label><input class="form-input" id="input-experience" type="number" value="${profile.workExperience||''}" placeholder="0" min="0" max="40"></div>
      </div>`;

    case 5: return `
      <h3 class="step-title">🌟 Extras & Achievements</h3>
      <p class="step-description">Optional — helps match merit-based scholarships</p>
      <div class="form-grid">
        <div class="form-group full-width"><label class="form-label">Extracurriculars, achievements, or research <span class="optional">(optional)</span></label><textarea class="form-input" id="input-extras" rows="5" placeholder="E.g., Published 2 research papers, President of debate club, Volunteered 200+ hours...">${profile.extracurriculars||''}</textarea></div>
      </div>`;
  }
}

function getTestPlaceholder(test) {
  const map = { TOEFL: 'e.g. 100', IELTS: 'e.g. 7.5', GRE: 'e.g. 325', GMAT: 'e.g. 720', PTE: 'e.g. 72', TestDaF: 'e.g. 18', JLPT: 'e.g. N2', TOPIK: 'e.g. Level 5' };
  return map[test] || 'Score';
}
