import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
         ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell,
         BarChart, Bar, LabelList } from 'recharts';

const programs = [
  { id: 'uw', name: 'UW CFRM', shortName: 'UW', location: 'Seattle, WA', duration: '12 mo', durationMonths: 12,
    cost: '~$75k total', totalCost: 75, tuitionOnly: '$49k tuition + $26k living', overBudget: false,
    track: 'Quant Finance', color: '#5e8a85',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 110,
    topRoles: 'Quant risk, fintech, tech-finance, risk modeling',
    topEmployers: 'Russell, Parametric, Amazon Finance, MSFT Treasury, Moody\'s',
    scores: { roi: 8, affordability: 7, jobMarket: 6, weatherFit: 10, lifestyle: 9, shortDuration: 7, capstone: 6, prestige: 7, versatility: 4 } },
  { id: 'calpoly', name: 'Cal Poly SLO MSBA', shortName: 'Cal Poly', location: 'San Luis Obispo, CA', duration: '10 mo', durationMonths: 10,
    cost: '~$50k total', totalCost: 50, tuitionOnly: '$31k tuition + $19k living', overBudget: false,
    track: 'Business Analytics', color: '#d4a952',
    admitOdds: 'Safety', admitOddsScore: 85, expectedSalary: 95,
    topRoles: 'Data analyst, BI, product analytics, marketing analytics',
    topEmployers: 'Oracle, Google, Deloitte, Capital One, PwC, T-Mobile',
    scores: { roi: 9, affordability: 10, jobMarket: 7, weatherFit: 10, lifestyle: 5, shortDuration: 9, capstone: 8, prestige: 5, versatility: 5 } },
  { id: 'utaustin', name: 'UT Austin MSBA', shortName: 'UT Austin', location: 'Austin, TX', duration: '10 mo', durationMonths: 10,
    cost: '~$72k total', totalCost: 72, tuitionOnly: '$53k tuition + $19k living', overBudget: false,
    track: 'Business Analytics', color: '#b8923b',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 115,
    topRoles: 'Data scientist, BI, product analytics, consulting',
    topEmployers: 'Apple, Tesla, Google, Oracle, Dell, Indeed, Meta, Deloitte',
    scores: { roi: 8, affordability: 7, jobMarket: 8, weatherFit: 3, lifestyle: 9, shortDuration: 9, capstone: 8, prestige: 9, versatility: 8 } },
  { id: 'gatech', name: 'Georgia Tech MSBA', shortName: 'GA Tech', location: 'Atlanta, GA', duration: '12 mo', durationMonths: 12,
    cost: '~$75k total', totalCost: 75, tuitionOnly: '$55k tuition + $20k living', overBudget: false,
    track: 'Business Analytics', color: '#a0614a',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 115,
    topRoles: 'Data scientist, ML engineer, business analyst, consultant',
    topEmployers: 'Delta, Home Depot, UPS, Coca-Cola, Microsoft, ICE/NYSE, Truist',
    scores: { roi: 8, affordability: 7, jobMarket: 8, weatherFit: 3, lifestyle: 7, shortDuration: 8, capstone: 8, prestige: 9, versatility: 8 } },
  { id: 'unc', name: 'UNC Kenan MSBA', shortName: 'UNC', location: 'Chapel Hill, NC', duration: '10 mo', durationMonths: 10,
    cost: '~$81k total', totalCost: 81, tuitionOnly: '$65k tuition + $16k living', overBudget: false,
    track: 'Business Analytics', color: '#6b8cae',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 105,
    topRoles: 'Data analyst, BI, consulting, financial analyst',
    topEmployers: 'IBM, Cisco, SAS, Red Hat, Fidelity, Deloitte, BoA (Charlotte)',
    scores: { roi: 7, affordability: 6, jobMarket: 8, weatherFit: 5, lifestyle: 7, shortDuration: 9, capstone: 8, prestige: 8, versatility: 7 } },
  { id: 'gwu', name: 'GWU MSBA', shortName: 'GWU', location: 'Washington, DC', duration: '12 mo', durationMonths: 12,
    cost: '~$82k total', totalCost: 82, tuitionOnly: '$55k tuition + $27k living', overBudget: false,
    track: 'Business Analytics', color: '#8b5a8a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 100,
    topRoles: 'Consulting, federal analytics, business analyst, BI',
    topEmployers: 'Deloitte, Accenture, Booz Allen, Guidehouse, IBM, MITRE, federal',
    scores: { roi: 7, affordability: 5, jobMarket: 8, weatherFit: 6, lifestyle: 9, shortDuration: 8, capstone: 8, prestige: 7, versatility: 8 } },
  { id: 'rutgers', name: 'Rutgers MQF', shortName: 'Rutgers', location: 'Newark, NJ', duration: '16 mo', durationMonths: 16,
    cost: '~$80k / $95k*', totalCost: 85, tuitionOnly: '$50k–65k tuition + $30k living', overBudget: false,
    track: 'Quant Finance', color: '#4a6b4a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 135,
    topRoles: 'Quant analyst, risk, quant research, trading, asset mgmt',
    topEmployers: 'Goldman, JPM, MS, Bloomberg, Prudential, BNY, Citi',
    scores: { roi: 9, affordability: 6, jobMarket: 10, weatherFit: 5, lifestyle: 6, shortDuration: 5, capstone: 8, prestige: 7, versatility: 7 } },
  { id: 'ncstate', name: 'NC State MS Financial Math', shortName: 'NC State', location: 'Raleigh, NC', duration: '14 mo', durationMonths: 14,
    cost: '~$62k total', totalCost: 62, tuitionOnly: '$40k tuition + $22k living', overBudget: false,
    track: 'Quant Finance', color: '#6e5a9e',
    admitOdds: 'Target', admitOddsScore: 70, expectedSalary: 105,
    topRoles: 'Quant risk, financial analyst, risk modeling',
    topEmployers: 'BoA (Charlotte pipeline), Wells Fargo, Truist, Fidelity, SAS',
    scores: { roi: 8, affordability: 8, jobMarket: 6, weatherFit: 5, lifestyle: 6, shortDuration: 6, capstone: 7, prestige: 6, versatility: 3 } },
  { id: 'uiuc', name: 'UIUC MSFE', shortName: 'UIUC', location: 'Champaign, IL', duration: '16 mo', durationMonths: 16,
    cost: '~$82k total', totalCost: 82, tuitionOnly: '$60k tuition + $22k living', overBudget: false,
    track: 'Quant Finance', color: '#8c8a4a',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 130,
    topRoles: 'Quant analyst, risk, quant research, trading',
    topEmployers: 'Citadel, Jump, DRW, IMC, Morningstar, CME, Allstate',
    scores: { roi: 7, affordability: 5, jobMarket: 8, weatherFit: 4, lifestyle: 4, shortDuration: 5, capstone: 7, prestige: 7, versatility: 3 } },
  { id: 'cmu', name: 'CMU EPP', shortName: 'CMU', location: 'Pittsburgh, PA', duration: '9 mo', durationMonths: 9,
    cost: '~$75k total', totalCost: 75, tuitionOnly: '$60k tuition + $15k living', overBudget: false,
    track: 'Policy/Consulting', color: '#9e7b5a',
    admitOdds: 'Reach', admitOddsScore: 35, expectedSalary: 110,
    topRoles: 'Tech-policy consultant, strategy analyst, govt, industry strategy',
    topEmployers: 'Deloitte Gov, Booz Allen, MBB consulting, RAND, think tanks',
    scores: { roi: 7, affordability: 7, jobMarket: 7, weatherFit: 7, lifestyle: 7, shortDuration: 9, capstone: 6, prestige: 9, versatility: 10 } },
];

const criteria = [
  { key: 'roi', label: 'ROI', description: 'Expected salary outcome relative to program cost' },
  { key: 'affordability', label: 'Affordability', description: 'Absolute program cost (cheaper = higher)' },
  { key: 'jobMarket', label: 'Job Market', description: 'Local employer depth for target roles' },
  { key: 'weatherFit', label: 'Weather Fit', description: 'Match to 50-70°F cloudy-morning preference' },
  { key: 'lifestyle', label: 'Lifestyle', description: 'Food, culture, activities, city vibe' },
  { key: 'shortDuration', label: 'Short Duration', description: 'Program length (shorter = higher)' },
  { key: 'capstone', label: 'Capstone', description: 'Quality of applied project / industry partnership' },
  { key: 'prestige', label: 'Prestige', description: 'Brand strength with employers' },
  { key: 'versatility', label: 'Versatility', description: 'Breadth of career paths program opens (generalist vs specialist)' },
];

const TIER_COLORS = {
  'Reach': '#c96e5c',
  'Target': '#e4a853',
  'Safety': '#5e8a85',
};

export default function ProgramComparison() {
  const [selected, setSelected] = useState(['cmu', 'uw', 'utaustin']);
  const [weights, setWeights] = useState({
    roi: 7, affordability: 5, jobMarket: 8, weatherFit: 4,
    lifestyle: 5, shortDuration: 5, capstone: 6, prestige: 6, versatility: 7,
  });
  const [trackFilter, setTrackFilter] = useState('All');

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const radarData = useMemo(() => {
    return criteria.map(c => {
      const entry = { criterion: c.label };
      selected.forEach(id => {
        const p = programs.find(x => x.id === id);
        if (p) entry[p.shortName] = p.scores[c.key];
      });
      return entry;
    });
  }, [selected]);

  const rankedPrograms = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0) || 1;
    return [...programs]
      .map(p => {
        const weighted = criteria.reduce(
          (sum, c) => sum + p.scores[c.key] * weights[c.key], 0
        ) / totalWeight;
        return { ...p, weightedScore: weighted };
      })
      .sort((a, b) => b.weightedScore - a.weightedScore);
  }, [weights]);

  const scatterData = useMemo(() => {
    return programs.map(p => ({
      x: p.totalCost,
      y: p.expectedSalary,
      z: p.admitOddsScore,
      name: p.shortName,
      fullName: p.name,
      location: p.location,
      admitOdds: p.admitOdds,
      color: p.color,
      id: p.id,
    }));
  }, []);

  const admitOddsData = useMemo(() => {
    return [...programs]
      .sort((a, b) => b.admitOddsScore - a.admitOddsScore)
      .map(p => ({
        name: p.shortName,
        odds: p.admitOddsScore,
        tier: p.admitOdds,
        color: p.color,
        id: p.id,
      }));
  }, []);

  const tracks = ['All', ...new Set(programs.map(p => p.track))];
  const filteredPrograms = trackFilter === 'All'
    ? programs
    : programs.filter(p => p.track === trackFilter);

  const maxWeightedScore = rankedPrograms[0]?.weightedScore || 10;

  const CustomScatterTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#0f1216', border: '1px solid #e4a853', padding: '10px 14px',
        fontFamily: 'IBM Plex Mono', fontSize: 12,
      }}>
        <div style={{ color: '#e4a853', fontWeight: 600, marginBottom: 4 }}>{d.fullName}</div>
        <div style={{ color: '#ebe3d0' }}>{d.location}</div>
        <div style={{ color: '#8f8876', marginTop: 4 }}>
          Cost: ${d.x}k · Salary: ${d.y}k · <span style={{ color: TIER_COLORS[d.admitOdds] }}>{d.admitOdds}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="pc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pc-root {
          --bg: #0f1216;
          --surface: #171b22;
          --surface-2: #1f242d;
          --border: #2a313c;
          --text: #ebe3d0;
          --text-dim: #8f8876;
          --text-faint: #595647;
          --accent: #e4a853;
          --accent-dim: #b8864a;
          --reach: #c96e5c;
          --target: #e4a853;
          --safety: #5e8a85;
          --serif: 'Fraunces', Georgia, 'Times New Roman', serif;
          --sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --mono: 'IBM Plex Mono', Menlo, Monaco, monospace;

          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          min-height: 100vh;
          padding: 32px 24px 64px;
          max-width: 1200px;
          margin: 0 auto;
          font-size: 14px;
          line-height: 1.5;
        }

        .pc-root * { box-sizing: border-box; }

        .pc-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .pc-kicker {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .pc-title {
          font-family: var(--serif);
          font-weight: 600;
          font-size: 42px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
          color: var(--text);
        }
        .pc-title em {
          font-style: italic;
          color: var(--accent);
          font-weight: 500;
        }
        .pc-subtitle {
          color: var(--text-dim);
          font-size: 15px;
          max-width: 680px;
          margin: 0;
        }
        .pc-stats-row {
          display: flex;
          gap: 40px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .pc-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pc-stat-label {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .pc-stat-value {
          font-family: var(--serif);
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .pc-stat-value .accent { color: var(--accent); }

        .pc-section {
          margin-bottom: 48px;
        }
        .pc-section-header {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .pc-section-number {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--accent);
          letter-spacing: 0.1em;
        }
        .pc-section-title {
          font-family: var(--serif);
          font-weight: 600;
          font-size: 22px;
          letter-spacing: -0.01em;
          margin: 0;
          flex: 1;
        }
        .pc-section-desc {
          font-size: 13px;
          color: var(--text-dim);
          margin: 0 0 16px 0;
        }

        .pc-filter-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .pc-filter-chip {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 12px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
        }
        .pc-filter-chip:hover { color: var(--text); border-color: var(--text-dim); }
        .pc-filter-chip.active {
          color: var(--bg);
          background: var(--accent);
          border-color: var(--accent);
        }

        .pc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pc-chip {
          padding: 10px 16px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 500;
        }
        .pc-chip:hover { color: var(--text); border-color: var(--text-dim); }
        .pc-chip.selected {
          color: var(--text);
          background: var(--surface-2);
          border-color: currentColor;
        }
        .pc-chip-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pc-chip-meta {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-faint);
        }
        .pc-chip.selected .pc-chip-meta { color: var(--text-dim); }

        .pc-selected-count {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text-faint);
          letter-spacing: 0.1em;
        }

        .pc-chart-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 24px;
        }
        .pc-chart-title {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin: 0 0 20px 0;
        }
        .pc-chart-subtitle {
          font-family: var(--sans);
          font-size: 12px;
          color: var(--text-faint);
          margin: 16px 0 0 0;
          font-style: italic;
        }
        .pc-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding-top: 20px;
          margin-top: 20px;
          border-top: 1px solid var(--border);
        }
        .pc-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-dim);
          font-family: var(--mono);
        }
        .pc-legend-swatch {
          width: 14px;
          height: 14px;
          border: 1px solid currentColor;
        }

        .pc-tier-legend {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .pc-tier-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pc-tier-dot {
          width: 10px;
          height: 10px;
        }

        .pc-sliders {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 20px;
        }
        .pc-slider-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pc-slider-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 13px;
        }
        .pc-slider-label .label-text { color: var(--text); font-weight: 500; }
        .pc-slider-label .label-value {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--accent);
        }
        .pc-slider-desc {
          font-size: 11px;
          color: var(--text-faint);
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .pc-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 2px;
          background: var(--border);
          outline: none;
          cursor: pointer;
        }
        .pc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: var(--accent);
          cursor: pointer;
          border: 2px solid var(--bg);
          border-radius: 0;
        }
        .pc-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: var(--accent);
          cursor: pointer;
          border: 2px solid var(--bg);
          border-radius: 0;
        }

        .pc-ranking {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pc-rank-row {
          display: grid;
          grid-template-columns: 40px 1fr auto 60px;
          gap: 16px;
          align-items: center;
          padding: 14px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid transparent;
          transition: all 0.15s;
          cursor: pointer;
        }
        .pc-rank-row:hover {
          background: var(--surface-2);
        }
        .pc-rank-row.top3 {
          border-left-color: var(--accent);
        }
        .pc-rank-num {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 600;
          color: var(--text-dim);
          font-variant-numeric: tabular-nums;
        }
        .pc-rank-row.top3 .pc-rank-num { color: var(--accent); }
        .pc-rank-name-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .pc-rank-name {
          font-family: var(--serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .pc-rank-meta {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-faint);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pc-rank-bar-container {
          width: 140px;
          height: 4px;
          background: var(--border);
          position: relative;
          overflow: hidden;
        }
        .pc-rank-bar {
          height: 100%;
          transition: width 0.3s ease-out;
        }
        .pc-rank-score {
          font-family: var(--mono);
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        .pc-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 12px;
        }
        .pc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 3px solid var(--border);
          padding: 20px;
          transition: all 0.15s;
          cursor: pointer;
        }
        .pc-card:hover {
          background: var(--surface-2);
          transform: translateY(-1px);
        }
        .pc-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 12px;
        }
        .pc-card-title {
          font-family: var(--serif);
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 0 0 4px 0;
        }
        .pc-card-loc {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .pc-card-tier {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 3px 8px;
          border: 1px solid currentColor;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pc-card-tier.Reach { color: var(--reach); }
        .pc-card-tier.Target { color: var(--target); }
        .pc-card-tier.Safety { color: var(--safety); }

        .pc-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 16px;
          padding: 12px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin-bottom: 12px;
        }
        .pc-card-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pc-card-stat-label {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
        }
        .pc-card-stat-value {
          font-family: var(--sans);
          font-size: 13px;
          color: var(--text);
          font-weight: 500;
        }

        .pc-card-section {
          margin-top: 10px;
        }
        .pc-card-section-label {
          font-family: var(--mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-faint);
          margin-bottom: 4px;
        }
        .pc-card-section-text {
          font-size: 12px;
          color: var(--text-dim);
          line-height: 1.4;
        }

        .pc-note {
          font-size: 12px;
          color: var(--text-faint);
          font-style: italic;
          margin-top: 16px;
          border-top: 1px solid var(--border);
          padding-top: 16px;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .pc-sliders { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="pc-header">
        <div className="pc-kicker">Personalized Decision Tool · 10 Programs</div>
        <h1 className="pc-title">Graduate Program <em>Comparison</em></h1>
        <p className="pc-subtitle">
          Ten master's programs scored across nine dimensions. Explore with radar overlays,
          cost-versus-outcome analysis, admit-odds estimates, and weighted rankings that reflect your priorities.
        </p>
        <div className="pc-stats-row">
          <div className="pc-stat">
            <div className="pc-stat-label">Programs</div>
            <div className="pc-stat-value">{programs.length}</div>
          </div>
          <div className="pc-stat">
            <div className="pc-stat-label">Cheapest Total</div>
            <div className="pc-stat-value"><span className="accent">${Math.min(...programs.map(p => p.totalCost))}k</span></div>
          </div>
          <div className="pc-stat">
            <div className="pc-stat-label">Highest Salary</div>
            <div className="pc-stat-value"><span className="accent">${Math.max(...programs.map(p => p.expectedSalary))}k</span></div>
          </div>
          <div className="pc-stat">
            <div className="pc-stat-label">Shortest</div>
            <div className="pc-stat-value">{Math.min(...programs.map(p => p.durationMonths))} <span style={{ fontSize: 16, color: 'var(--text-dim)' }}>mo</span></div>
          </div>
        </div>
      </header>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">01</span>
          <h2 className="pc-section-title">Program Overview</h2>
        </div>
        <p className="pc-section-desc">
          Each program at a glance. Click any card to toggle it on the radar chart below.
        </p>
        <div className="pc-tier-legend">
          <span className="pc-tier-badge" style={{ color: 'var(--reach)' }}>
            <span className="pc-tier-dot" style={{ background: 'var(--reach)' }} /> Reach
          </span>
          <span className="pc-tier-badge" style={{ color: 'var(--target)' }}>
            <span className="pc-tier-dot" style={{ background: 'var(--target)' }} /> Target
          </span>
          <span className="pc-tier-badge" style={{ color: 'var(--safety)' }}>
            <span className="pc-tier-dot" style={{ background: 'var(--safety)' }} /> Safety
          </span>
        </div>
        <div className="pc-cards">
          {programs.map(p => (
            <div
              key={p.id}
              className="pc-card"
              onClick={() => toggleSelect(p.id)}
              style={{
                borderTopColor: p.color,
                background: selected.includes(p.id) ? 'var(--surface-2)' : 'var(--surface)',
              }}
            >
              <div className="pc-card-header">
                <div>
                  <h3 className="pc-card-title">{p.name}</h3>
                  <div className="pc-card-loc">{p.location} · {p.track}</div>
                </div>
                <span className={`pc-card-tier ${p.admitOdds}`}>{p.admitOdds}</span>
              </div>
              <div className="pc-card-grid">
                <div className="pc-card-stat">
                  <div className="pc-card-stat-label">Duration</div>
                  <div className="pc-card-stat-value">{p.duration}</div>
                </div>
                <div className="pc-card-stat">
                  <div className="pc-card-stat-label">Total Cost</div>
                  <div className="pc-card-stat-value">${p.totalCost}k</div>
                </div>
                <div className="pc-card-stat">
                  <div className="pc-card-stat-label">Est. Salary</div>
                  <div className="pc-card-stat-value">${p.expectedSalary}k</div>
                </div>
                <div className="pc-card-stat">
                  <div className="pc-card-stat-label">Admit Odds</div>
                  <div className="pc-card-stat-value">~{p.admitOddsScore}%</div>
                </div>
              </div>
              <div className="pc-card-section">
                <div className="pc-card-section-label">Top Roles</div>
                <div className="pc-card-section-text">{p.topRoles}</div>
              </div>
              <div className="pc-card-section">
                <div className="pc-card-section-label">Top Employers</div>
                <div className="pc-card-section-text">{p.topEmployers}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">02</span>
          <h2 className="pc-section-title">Cost vs. Expected Salary</h2>
        </div>
        <p className="pc-section-desc">
          Upper-left quadrant is best ROI (low cost, high salary). Bubble size reflects admit odds — bigger dots are easier to get into.
        </p>
        <div className="pc-chart-panel">
          <div className="pc-chart-title">ROI Quadrant · All 10 Programs</div>
          <ResponsiveContainer width="100%" height={440}>
            <ScatterChart margin={{ top: 30, right: 40, bottom: 50, left: 70 }}>
              <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" />
              <XAxis
                type="number"
                dataKey="x"
                name="Cost"
                unit="k"
                domain={[40, 100]}
                tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                stroke="#2a313c"
                label={{ value: 'Total Cost ($k) — tuition + living', position: 'insideBottom', offset: -10, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Salary"
                unit="k"
                domain={[80, 150]}
                tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                stroke="#2a313c"
                label={{ value: 'Expected Starting Salary ($k)', angle: -90, position: 'insideLeft', offset: 10, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
              />
              <ZAxis type="number" dataKey="z" range={[80, 400]} />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData}>
                {scatterData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke={entry.color} strokeWidth={1} fillOpacity={0.7} />
                ))}
                <LabelList
                  dataKey="name"
                  position="top"
                  style={{ fill: '#ebe3d0', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                  offset={14}
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="pc-chart-subtitle">
            Salary estimates are median starting compensation (base + bonus) from recent cohort placement data. Bubble size encodes admit likelihood.
          </p>
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">03</span>
          <h2 className="pc-section-title">Admit Odds</h2>
        </div>
        <p className="pc-section-desc">
          Rough admit probability estimates given your profile (3.0→3.6 GPA trend, CS major + Management minor, honors thesis in progress, research + strong project).
          Use as relative guidance, not prediction.
        </p>
        <div className="pc-chart-panel">
          <div className="pc-chart-title">Estimated Admit Probability by Program</div>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={admitOddsData} layout="vertical" margin={{ top: 10, right: 50, bottom: 10, left: 100 }}>
              <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                stroke="#2a313c"
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#ebe3d0', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
                stroke="#2a313c"
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f1216',
                  border: '1px solid #e4a853',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 12,
                }}
                formatter={(v, n, props) => [`${v}% · ${props.payload.tier}`, 'Admit Odds']}
                cursor={{ fill: 'rgba(228, 168, 83, 0.05)' }}
              />
              <Bar dataKey="odds">
                {admitOddsData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="odds"
                  position="right"
                  formatter={(v) => `${v}%`}
                  style={{ fill: '#ebe3d0', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">04</span>
          <h2 className="pc-section-title">Radar Comparison</h2>
          <span className="pc-selected-count">{selected.length} / {programs.length} SELECTED</span>
        </div>
        <p className="pc-section-desc">
          Each axis is scored 0–10. Select 2–5 programs for best readability. Use the program cards above or the chips below to toggle.
        </p>
        <div className="pc-filter-row">
          {tracks.map(t => (
            <button
              key={t}
              className={`pc-filter-chip ${trackFilter === t ? 'active' : ''}`}
              onClick={() => setTrackFilter(t)}
            >
              {t}
            </button>
          ))}
          <button
            className="pc-filter-chip"
            onClick={() => setSelected(programs.map(p => p.id))}
          >
            Select All
          </button>
          <button
            className="pc-filter-chip"
            onClick={() => setSelected([])}
          >
            Clear
          </button>
        </div>
        <div className="pc-chips" style={{ marginBottom: 20 }}>
          {filteredPrograms.map(p => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                className={`pc-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSelect(p.id)}
                style={isSelected ? { color: p.color } : {}}
              >
                <span className="pc-chip-dot" style={{ background: p.color }} />
                <span>{p.shortName}</span>
                <span className="pc-chip-meta">{p.duration} · {p.cost}</span>
              </button>
            );
          })}
        </div>
        <div className="pc-chart-panel">
          <div className="pc-chart-title">Nine-Dimension Profile</div>
          <ResponsiveContainer width="100%" height={460}>
            <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <PolarGrid stroke="#2a313c" strokeDasharray="2 4" />
              <PolarAngleAxis
                dataKey="criterion"
                tick={{ fill: '#ebe3d0', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: '#595647', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
                tickCount={6}
                stroke="#2a313c"
              />
              {selected.map(id => {
                const p = programs.find(x => x.id === id);
                return (
                  <Radar
                    key={id}
                    name={p.shortName}
                    dataKey={p.shortName}
                    stroke={p.color}
                    fill={p.color}
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                );
              })}
              <Tooltip
                contentStyle={{
                  background: '#0f1216',
                  border: '1px solid #e4a853',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 12,
                }}
                labelStyle={{ color: '#e4a853', marginBottom: 4 }}
                itemStyle={{ color: '#ebe3d0' }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div className="pc-legend">
            {selected.map(id => {
              const p = programs.find(x => x.id === id);
              return (
                <div key={id} className="pc-legend-item" style={{ color: p.color }}>
                  <span className="pc-legend-swatch" style={{ background: p.color }} />
                  <span>{p.shortName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">05</span>
          <h2 className="pc-section-title">Your Priorities</h2>
        </div>
        <p className="pc-section-desc">
          Set importance weights from 0 (ignore) to 10 (critical). The ranking below updates in real time.
        </p>
        <div className="pc-sliders">
          {criteria.map(c => (
            <div key={c.key} className="pc-slider-item">
              <div className="pc-slider-label">
                <span className="label-text">{c.label}</span>
                <span className="label-value">{weights[c.key]}</span>
              </div>
              <div className="pc-slider-desc">{c.description}</div>
              <input
                type="range"
                min="0"
                max="10"
                value={weights[c.key]}
                onChange={e => setWeights({ ...weights, [c.key]: parseInt(e.target.value) })}
                className="pc-slider"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="pc-section">
        <div className="pc-section-header">
          <span className="pc-section-number">06</span>
          <h2 className="pc-section-title">Weighted Ranking</h2>
        </div>
        <p className="pc-section-desc">
          Scores reflect your weighting. Click any row to toggle it on the radar chart above.
        </p>
        <div className="pc-ranking">
          {rankedPrograms.map((p, i) => {
            const widthPct = (p.weightedScore / maxWeightedScore) * 100;
            return (
              <div
                key={p.id}
                className={`pc-rank-row ${i < 3 ? 'top3' : ''}`}
                onClick={() => toggleSelect(p.id)}
                style={selected.includes(p.id) ? { borderLeftColor: p.color, background: 'var(--surface-2)' } : {}}
              >
                <div className="pc-rank-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="pc-rank-name-group">
                  <div className="pc-rank-name">{p.name}</div>
                  <div className="pc-rank-meta">
                    {p.location} · {p.duration} · {p.cost} · {p.track} · {p.admitOdds}
                  </div>
                </div>
                <div className="pc-rank-bar-container">
                  <div
                    className="pc-rank-bar"
                    style={{ width: `${widthPct}%`, background: p.color }}
                  />
                </div>
                <div className="pc-rank-score">{p.weightedScore.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <p className="pc-note">
          Total cost = approximate tuition (2025–26) plus estimated living expenses for program duration.
          Salary estimates are median starting compensation for recent graduating cohorts, inclusive of bonus.
          Admit odds reflect your profile (3.0→3.6 GPA trend, CS major with Management minor, honors thesis in progress) — they are directional, not predictive.
          Rutgers MQF shows both scholarship-adjusted and list-price totals.
          Verify all figures directly with each school before making decisions.
        </p>
      </section>
    </div>
  );
}
