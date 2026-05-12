// ═══ Matching Engine ═══
// Scores scholarships against user profile (0-100%)

export function matchScholarships(profile, scholarships) {
  return scholarships
    .map(s => ({ ...s, matchScore: calcScore(profile, s) }))
    .filter(s => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function calcScore(profile, scholarship) {
  let score = 0, maxScore = 0;

  // 1. Education Level Match (25 pts)
  maxScore += 25;
  if (scholarship.level.includes(profile.level)) {
    score += 25;
  } else if (isAdjacentLevel(profile.level, scholarship.level)) {
    score += 10;
  } else {
    return 0; // Hard filter: level must at least be adjacent
  }

  // 2. Field of Study Match (20 pts)
  maxScore += 20;
  if (scholarship.field.includes('Any') || !profile.field || profile.field === 'Any') {
    score += 20;
  } else if (scholarship.field.includes(profile.field)) {
    score += 20;
  } else if (isRelatedField(profile.field, scholarship.field)) {
    score += 10;
  }

  // 3. Region / Destination Match (15 pts)
  maxScore += 15;
  if (!profile.destinations || profile.destinations.length === 0) {
    score += 15; // No preference = match all
  } else {
    const destMatch = profile.destinations.some(d =>
      scholarship.region.toLowerCase().includes(d.toLowerCase()) ||
      scholarship.country.toLowerCase().includes(d.toLowerCase()) ||
      d.toLowerCase() === 'global' ||
      scholarship.region === 'Global'
    );
    if (destMatch) score += 15;
    else if (scholarship.region === 'Global') score += 12;
  }

  // 4. Academic Merit / GPA (15 pts)
  maxScore += 15;
  if (!scholarship.eligibility.gpa || !profile.gpa) {
    score += 15;
  } else if (profile.gpa >= scholarship.eligibility.gpa) {
    score += 15;
  } else if (profile.gpa >= scholarship.eligibility.gpa - 0.3) {
    score += 8;
  }

  // 5. Financial Need (10 pts)
  maxScore += 10;
  if (!scholarship.eligibility.financialNeed) {
    score += 10; // No financial need required
  } else if (profile.financialNeed) {
    score += 10;
  } else {
    score += 3; // Still possible, just lower priority
  }

  // 6. Special Criteria (15 pts)
  maxScore += 15;
  let specialScore = 0, specialChecks = 0;

  // Gender
  if (scholarship.eligibility.gender !== 'Any') {
    specialChecks++;
    if (profile.gender && profile.gender.toLowerCase() === scholarship.eligibility.gender.toLowerCase()) {
      specialScore++;
    }
  }

  // Minority
  if (scholarship.eligibility.minority) {
    specialChecks++;
    if (profile.minority) specialScore++;
  }

  if (specialChecks > 0) {
    score += Math.round((specialScore / specialChecks) * 15);
  } else {
    score += 15;
  }

  return Math.round((score / maxScore) * 100);
}

function isAdjacentLevel(userLevel, scholarshipLevels) {
  const order = ['School (K-12)', 'Undergraduate', 'Masters', 'PhD', 'Postdoctoral', 'Professional'];
  const userIdx = order.indexOf(userLevel);
  return scholarshipLevels.some(l => {
    const idx = order.indexOf(l);
    return Math.abs(userIdx - idx) <= 1;
  });
}

function isRelatedField(userField, scholarshipFields) {
  const related = {
    'STEM': ['Engineering', 'Computer Science', 'Environmental Science'],
    'Engineering': ['STEM', 'Computer Science'],
    'Computer Science': ['STEM', 'Engineering'],
    'Medicine': ['STEM'],
    'Business': ['Social Sciences', 'Law'],
    'Law': ['Social Sciences', 'Business', 'Humanities'],
    'Arts': ['Humanities'],
    'Humanities': ['Arts', 'Social Sciences', 'Education'],
    'Social Sciences': ['Humanities', 'Business', 'Education', 'Law'],
    'Education': ['Humanities', 'Social Sciences'],
    'Agriculture': ['Environmental Science', 'STEM'],
    'Environmental Science': ['STEM', 'Agriculture'],
  };
  const userRelated = related[userField] || [];
  return scholarshipFields.some(f => userRelated.includes(f));
}
