// College Scorecard API (US Dept of Education) — free key at https://api.data.gov/signup
// Returns institution-level earnings and tuition data.
// NOTE: data is school-wide (all programs/students), not specific to any master's program.

const BASE = 'https://api.data.gov/ed/collegescorecard/v1/schools.json';
const FIELDS = [
  'id',
  'school.name',
  'latest.earnings.6_yrs_after_entry.median',
  'latest.cost.tuition.out_of_state',
].join(',');

// idMap: { programId -> IPEDS unitId }
// Returns: { programId -> { earnings6yr, tuitionOOS, schoolName } }
export async function fetchScorecardData(idMap, apiKey) {
  const unitIds = Object.values(idMap).join(',');
  const url = `${BASE}?id=${unitIds}&fields=${FIELDS}&per_page=100&api_key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`College Scorecard ${res.status}`);
  const data = await res.json();

  const byUnit = {};
  for (const school of data.results ?? []) {
    byUnit[school.id] = {
      earnings6yr: school['latest.earnings.6_yrs_after_entry.median'],
      tuitionOOS:  school['latest.cost.tuition.out_of_state'],
      schoolName:  school['school.name'],
    };
  }

  const result = {};
  for (const [programId, unitId] of Object.entries(idMap)) {
    if (byUnit[unitId]) result[programId] = byUnit[unitId];
  }
  return result;
}
