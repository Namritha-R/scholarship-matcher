// ═══ LocalStorage Utilities ═══

const SAVED_KEY = 'skolarx_saved';
const PROFILE_KEY = 'skolarx_profile';
const THEME_KEY = 'skolarx_theme';

export function getSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; }
  catch { return []; }
}

export function saveScholarship(id) {
  const saved = getSaved();
  if (!saved.includes(id)) { saved.push(id); localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }
  return saved;
}

export function removeScholarship(id) {
  let saved = getSaved().filter(s => s !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  return saved;
}

export function isSaved(id) { return getSaved().includes(id); }

export function saveProfile(profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
export function getProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch { return null; } }

export function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }
export function setTheme(theme) { localStorage.setItem(THEME_KEY, theme); }
