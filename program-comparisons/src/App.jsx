import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
         ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell,
         BarChart, Bar, LabelList } from 'recharts';

const programs = [
  { id: 'uw', name: 'UW CFRM', shortName: 'UW', location: 'Seattle, WA', duration: '15 mo', durationMonths: 15,
    cost: '~$63k total', totalCost: 63, tuitionOnly: '$49k tuition + $14k living', overBudget: false,
    track: 'Quant Finance', color: '#5e8a85',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 115,
    topRoles: 'Quant risk, fintech, tech-finance, risk modeling',
    topEmployers: "Russell, Parametric, Amazon Finance, MSFT Treasury, Moody's",
    scores: { roi: 7, affordability: 7, jobMarket: 7, weatherFit: 3, lifestyle: 7, duration: 6, capstone: 7, prestige: 6, versatility: 7 } },
  { id: 'calpoly', name: 'Cal Poly SLO MSBA', shortName: 'Cal Poly', location: 'San Luis Obispo, CA', duration: '10 mo', durationMonths: 10,
    cost: '~$46k total', totalCost: 46, tuitionOnly: '$31k tuition + $15k living', overBudget: false,
    track: 'Business Analytics', color: '#d4a952',
    admitOdds: 'Safety', admitOddsScore: 85, expectedSalary: 79,
    topRoles: 'Data analyst, BI, product analytics, marketing analytics',
    topEmployers: 'Oracle, Google, Deloitte, Capital One, PwC, T-Mobile',
    scores: { roi: 6, affordability: 10, jobMarket: 5, weatherFit: 10, lifestyle: 10, duration: 9, capstone: 5, prestige: 3, versatility: 6 } },
  { id: 'utaustin', name: 'UT Austin MSBA', shortName: 'UT Austin', location: 'Austin, TX', duration: '12 mo', durationMonths: 12,
    cost: '~$80k total', totalCost: 80, tuitionOnly: '$53k tuition + $27k living', overBudget: false,
    track: 'Business Analytics', color: '#b8923b',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 103,
    topRoles: 'Data scientist, BI, product analytics, consulting',
    topEmployers: 'Apple, Tesla, Google, Oracle, Dell, Indeed, Meta, Deloitte',
    scores: { roi: 8, affordability: 5, jobMarket: 7, weatherFit: 7, lifestyle: 8, duration: 9, capstone: 7, prestige: 7, versatility: 8 } },
  { id: 'gatech', name: 'Georgia Tech MSBA', shortName: 'GA Tech', location: 'Atlanta, GA', duration: '12 mo', durationMonths: 12,
    cost: '~$70k total', totalCost: 70, tuitionOnly: '$50k tuition + $20k living', overBudget: false,
    track: 'Business Analytics', color: '#a0614a',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 109,
    topRoles: 'Data scientist, ML engineer, business analyst, consultant',
    topEmployers: 'Delta, Home Depot, UPS, Coca-Cola, Microsoft, ICE/NYSE, Truist',
    scores: { roi: 9, affordability: 6, jobMarket: 8, weatherFit: 6, lifestyle: 6, duration: 9, capstone: 9, prestige: 8, versatility: 9 } },
  { id: 'unc', name: 'UNC Kenan MSBA', shortName: 'UNC', location: 'Chapel Hill, NC', duration: '21 mo', durationMonths: 21,
    cost: '~$103k total', totalCost: 103, tuitionOnly: '$75k tuition + $28k living', overBudget: false,
    track: 'Business Analytics', color: '#6b8cae',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 100,
    topRoles: 'Data analyst, BI, consulting, financial analyst',
    topEmployers: 'IBM, Cisco, SAS, Red Hat, Fidelity, Deloitte, BoA (Charlotte)',
    scores: { roi: 4, affordability: 2, jobMarket: 6, weatherFit: 8, lifestyle: 7, duration: 3, capstone: 6, prestige: 7, versatility: 8 } },
  { id: 'gwu', name: 'GWU MSBA', shortName: 'GWU', location: 'Washington, DC', duration: '12 mo', durationMonths: 12,
    cost: '~$90k total', totalCost: 90, tuitionOnly: '$60k tuition + $30k living', overBudget: false,
    track: 'Business Analytics', color: '#8b5a8a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 95,
    topRoles: 'Consulting, federal analytics, business analyst, BI',
    topEmployers: 'Deloitte, Accenture, Booz Allen, Guidehouse, IBM, MITRE, federal',
    scores: { roi: 5, affordability: 4, jobMarket: 7, weatherFit: 6, lifestyle: 7, duration: 8, capstone: 8, prestige: 5, versatility: 7 } },
  { id: 'rutgers', name: 'Rutgers MQF', shortName: 'Rutgers', location: 'Newark, NJ', duration: '18 mo', durationMonths: 18,
    cost: '~$90k total', totalCost: 90, tuitionOnly: '$58k tuition + $32k living', overBudget: false,
    track: 'Quant Finance', color: '#4a6b4a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 87,
    topRoles: 'Quant analyst, risk, quant research, trading, asset mgmt',
    topEmployers: 'Goldman, JPM, MS, Bloomberg, Prudential, BNY, Citi',
    scores: { roi: 7, affordability: 4, jobMarket: 9, weatherFit: 5, lifestyle: 5, duration: 5, capstone: 6, prestige: 7, versatility: 6 } },
  { id: 'ncstate', name: 'NC State MS Financial Math', shortName: 'NC State', location: 'Raleigh, NC', duration: '18 mo', durationMonths: 18,
    cost: '~$55k total', totalCost: 55, tuitionOnly: '$35k tuition + $20k living', overBudget: false,
    track: 'Quant Finance', color: '#6e5a9e',
    admitOdds: 'Target', admitOddsScore: 70, expectedSalary: 112,
    topRoles: 'Quant risk, financial analyst, risk modeling',
    topEmployers: 'BoA (Charlotte pipeline), Wells Fargo, Truist, Fidelity, SAS',
    scores: { roi: 8, affordability: 8, jobMarket: 7, weatherFit: 8, lifestyle: 7, duration: 5, capstone: 8, prestige: 6, versatility: 6 } },
  { id: 'uiuc', name: 'UIUC MSFE', shortName: 'UIUC', location: 'Champaign, IL', duration: '18 mo', durationMonths: 18,
    cost: '~$95k total', totalCost: 95, tuitionOnly: '$65k tuition + $30k living', overBudget: false,
    track: 'Quant Finance', color: '#8c8a4a',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 130,
    topRoles: 'Quant analyst, risk, quant research, trading',
    topEmployers: 'Citadel, Jump, DRW, IMC, Morningstar, CME, Allstate',
    scores: { roi: 6, affordability: 3, jobMarket: 8, weatherFit: 4, lifestyle: 4, duration: 5, capstone: 9, prestige: 8, versatility: 6 } },
  { id: 'cmu', name: 'CMU EPP', shortName: 'CMU', location: 'Pittsburgh, PA', duration: '9 mo', durationMonths: 9,
    cost: '~$95k total', totalCost: 95, tuitionOnly: '$72k tuition + $23k living', overBudget: false,
    track: 'Policy/Consulting', color: '#9e7b5a',
    admitOdds: 'Reach', admitOddsScore: 35, expectedSalary: 110,
    topRoles: 'Tech-policy consultant, strategy analyst, govt, industry strategy',
    topEmployers: 'Deloitte Gov, Booz Allen, MBB consulting, RAND, think tanks',
    scores: { roi: 6, affordability: 3, jobMarket: 7, weatherFit: 2, lifestyle: 4, duration: 8, capstone: 7, prestige: 8, versatility: 8 } },
];

const criteria = [
  { key: 'roi', label: 'ROI', description: 'Expected salary outcome relative to program cost' },
  { key: 'affordability', label: 'Affordability', description: 'Absolute program cost (cheaper = higher)' },
  { key: 'jobMarket', label: 'Job Market', description: 'Local employer depth for target roles' },
  { key: 'weatherFit', label: 'Weather Fit', description: 'Match to 50-70°F cloudy-morning preference' },
  { key: 'lifestyle', label: 'Lifestyle', description: 'Food, culture, activities, city vibe' },
  { key: 'duration', label: 'Duration', description: 'Program length (shorter = higher)' },
  { key: 'capstone', label: 'Capstone', description: 'Quality of applied project / industry partnership' },
  { key: 'prestige', label: 'Prestige', description: 'Brand strength with employers' },
  { key: 'versatility', label: 'Versatility', description: 'Breadth of career paths program opens (generalist vs specialist)' },
];

const TIER_COLORS = {
  'Reach': '#c96e5c',
  'Target': '#e4a853',
  'Safety': '#5e8a85',
};

const SCATTER_LABEL_OFFSETS = {
  uw:       { dx: 12,  dy: -18, anchor: 'start' },
  calpoly:  { dx: 12,  dy: -16, anchor: 'start' },
  utaustin: { dx: 12,  dy: -15, anchor: 'start' },
  gatech:   { dx: 0,   dy: -18, anchor: 'middle' },
  unc:      { dx: -12, dy: -18, anchor: 'end' },
  gwu:      { dx: -12, dy: -18, anchor: 'end' },
  rutgers:  { dx: 12,  dy: 14,  anchor: 'start' },
  ncstate:  { dx: -12, dy: -18, anchor: 'end' },
  uiuc:     { dx: 12,  dy: -18, anchor: 'start' },
  cmu:      { dx: -12, dy: 0,   anchor: 'end' },
};

const scatterData = programs.map(p => ({
  x: p.totalCost, y: p.expectedSalary, z: p.admitOddsScore,
  name: p.shortName, fullName: p.name, location: p.location,
  admitOdds: p.admitOdds, color: p.color, id: p.id,
}));

const admitOddsData = [...programs]
  .sort((a, b) => b.admitOddsScore - a.admitOddsScore)
  .map(p => ({ name: p.shortName, odds: p.admitOddsScore, tier: p.admitOdds, color: p.color, id: p.id }));

function CustomScatterTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#0f1216', border: '1px solid #e4a853', padding: '10px 14px', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>
      <div style={{ color: '#e4a853', fontWeight: 600, marginBottom: 4 }}>{d.fullName}</div>
      <div style={{ color: '#ebe3d0' }}>{d.location}</div>
      <div style={{ color: '#8f8876', marginTop: 4 }}>
        Cost: ${d.x}k · Salary: ${d.y}k · <span style={{ color: TIER_COLORS[d.admitOdds] }}>{d.admitOdds}</span>
      </div>
    </div>
  );
}

function ScatterDot({ cx, cy, r, payload }) {
  if (!cx || !cy || !payload) return null;
  const radius = r || 10;
  const { dx, dy, anchor } = SCATTER_LABEL_OFFSETS[payload.id] || { dx: 0, dy: -16, anchor: 'middle' };
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={payload.color} fillOpacity={0.75} stroke={payload.color} strokeWidth={1} />
      <text x={cx + dx} y={cy + dy} fill="#ebe3d0" fontSize={11} fontFamily="IBM Plex Mono" textAnchor={anchor}>
        {payload.name}
      </text>
    </g>
  );
}

const SectionHeader = ({ num, title, extra, onToggle, open }) => (
  <div className="pc-section-header" onClick={onToggle} role="button" aria-expanded={open}>
    <span className="pc-section-number">{num}</span>
    <h2 className="pc-section-title">{title}</h2>
    {extra}
    <span className="pc-collapse-btn" aria-label={open ? 'Collapse' : 'Expand'}>
      {open ? '−' : '+'}
    </span>
  </div>
);

export default function ProgramComparison() {
  const [selected, setSelected] = useState(['cmu', 'uw', 'utaustin']);
  const [weights, setWeights] = useState({
    roi: 9, affordability: 7, jobMarket: 10, weatherFit: 4,
    lifestyle: 6, duration: 5, capstone: 9, prestige: 9, versatility: 8,
  });
  const [trackFilter, setTrackFilter] = useState('All');
  const [collapsed, setCollapsed] = useState({});
  const [rankingTab, setRankingTab] = useState('weighted');
  const [personalRanking, setPersonalRanking] = useState(() => {
    try {
      const saved = localStorage.getItem('pc-personal-ranking');
      return saved ? JSON.parse(saved) : programs.map(p => p.id);
    } catch {
      return programs.map(p => p.id);
    }
  });
  const [dragState, setDragState] = useState({ dragging: null, over: null });

  const toggleCollapse = (key) =>
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  const isOpen = (key) => !collapsed[key];

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(x => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ dragging: id, over: null });
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(s => ({ ...s, over: id }));
  };
  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const fromId = dragState.dragging;
    if (!fromId || fromId === targetId) { setDragState({ dragging: null, over: null }); return; }
    const next = [...personalRanking];
    const fromIdx = next.indexOf(fromId);
    const toIdx = next.indexOf(targetId);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, fromId);
    setPersonalRanking(next);
    localStorage.setItem('pc-personal-ranking', JSON.stringify(next));
    setDragState({ dragging: null, over: null });
  };
  const handleDragEnd = () => setDragState({ dragging: null, over: null });
  const resetPersonalRanking = () => {
    const reset = programs.map(p => p.id);
    setPersonalRanking(reset);
    localStorage.removeItem('pc-personal-ranking');
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

  const tracks = ['All', ...new Set(programs.map(p => p.track))];
  const filteredPrograms = trackFilter === 'All'
    ? programs
    : programs.filter(p => p.track === trackFilter);

  const maxWeightedScore = rankedPrograms[0]?.weightedScore || 10;

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
          padding: 32px clamp(12px, 3vw, 48px) 64px;
          width: 100%;
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
          font-size: clamp(28px, 5vw, 42px);
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
          gap: 32px;
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
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .pc-stat-value .accent { color: var(--accent); }

        .pc-section {
          margin-bottom: 40px;
        }

        /* Section header — full-width clickable strip */
        .pc-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--border);
          cursor: pointer;
          user-select: none;
          transition: background 0.15s, border-left-color 0.15s;
          margin-bottom: 16px;
        }
        .pc-section-header:hover {
          background: var(--surface-2);
          border-left-color: var(--accent);
        }
        .pc-section-number {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--accent);
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }
        .pc-section-title {
          font-family: var(--serif);
          font-weight: 600;
          font-size: clamp(18px, 3vw, 22px);
          letter-spacing: -0.01em;
          margin: 0;
          flex: 1;
          color: var(--text);
          transition: color 0.15s;
          text-align: left;
        }
        .pc-section-header:hover .pc-section-title {
          color: var(--accent);
        }
        .pc-collapse-btn {
          width: 32px;
          height: 32px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          line-height: 1;
          font-family: var(--mono);
          font-weight: 400;
          flex-shrink: 0;
          border-radius: 2px;
          transition: all 0.15s;
          pointer-events: none;
        }
        .pc-section-header:hover .pc-collapse-btn {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
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

        .pc-tab-row {
          display: flex;
          gap: 0;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .pc-tab {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          border: none;
          background: transparent;
          color: var(--text-dim);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.15s;
        }
        .pc-tab:hover { color: var(--text); }
        .pc-tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

        .pc-personal-ranking {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pc-personal-row {
          display: grid;
          grid-template-columns: 28px 40px 1fr;
          gap: 12px;
          align-items: center;
          padding: 12px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid transparent;
          transition: background 0.1s, border-top 0.1s;
          cursor: grab;
          user-select: none;
        }
        .pc-personal-row:active { cursor: grabbing; }
        .pc-personal-row.dragging { opacity: 0.35; }
        .pc-personal-row.dragover { border-top: 2px solid var(--accent); }
        .pc-drag-handle {
          color: var(--text-faint);
          font-size: 15px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-personal-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }

        .pc-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

        /* Mobile */
        @media (max-width: 768px) {
          .pc-root {
            padding: 20px 12px 48px;
          }
          .pc-stats-row { gap: 20px; }
          .pc-subtitle { font-size: 13px; }
          .pc-sliders { grid-template-columns: 1fr; }
          .pc-cards { grid-template-columns: 1fr; }
          .pc-rank-row {
            grid-template-columns: 36px 1fr 52px;
            gap: 10px;
            padding: 12px 12px;
          }
          .pc-rank-bar-container { display: none; }
          .pc-rank-num { font-size: 18px; }
          .pc-rank-name { font-size: 14px; }
          .pc-rank-meta { font-size: 9px; }
          .pc-personal-row { padding: 12px; }
          .pc-section-header { padding: 12px 14px; gap: 10px; }
          .pc-collapse-btn { width: 28px; height: 28px; font-size: 18px; }
          .pc-chart-panel { padding: 16px 12px; }
          .pc-chip { padding: 8px 12px; font-size: 12px; }
          .pc-chip-meta { display: none; }
        }

        @media (max-width: 480px) {
          .pc-rank-meta { display: none; }
          .pc-cards { gap: 8px; }
          .pc-tier-legend { gap: 12px; }
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

      {/* 01 — Program Overview */}
      <section className="pc-section">
        <SectionHeader num="01" title="Program Overview" onToggle={() => toggleCollapse('01')} open={isOpen('01')} />
        {isOpen('01') && (
          <>
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
          </>
        )}
      </section>

      {/* 02 — Cost vs. Expected Salary */}
      <section className="pc-section">
        <SectionHeader num="02" title="Cost vs. Expected Salary" onToggle={() => toggleCollapse('02')} open={isOpen('02')} />
        {isOpen('02') && (
          <>
            <p className="pc-section-desc">
              Upper-left is best ROI (low cost, high salary). Bubble size encodes admit odds — bigger means easier to get in. Hover for details.
            </p>
            <div className="pc-chart-panel">
              <div className="pc-chart-title">ROI Quadrant · All 10 Programs</div>
              <ResponsiveContainer width="100%" height={460}>
                <ScatterChart margin={{ top: 30, right: 80, bottom: 56, left: 70 }}>
                  <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Cost"
                    unit="k"
                    domain={[38, 112]}
                    ticks={[40, 50, 60, 70, 80, 90, 100, 110]}
                    tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                    stroke="#2a313c"
                    label={{ value: 'Total Cost ($k) — tuition + living', position: 'insideBottom', offset: -14, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Salary"
                    unit="k"
                    domain={[70, 140]}
                    ticks={[75, 90, 105, 120, 135]}
                    tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                    stroke="#2a313c"
                    label={{ value: 'Expected Starting Salary ($k)', angle: -90, position: 'insideLeft', offset: 10, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }}
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 420]} />
                  <Tooltip content={CustomScatterTooltip} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} shape={ScatterDot} />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="pc-chart-subtitle">
                Salary estimates are median starting compensation (base + bonus) from recent cohort placement data. Bubble size encodes admit likelihood.
              </p>
            </div>
          </>
        )}
      </section>

      {/* 03 — Admit Odds */}
      <section className="pc-section">
        <SectionHeader num="03" title="Admit Odds" onToggle={() => toggleCollapse('03')} open={isOpen('03')} />
        {isOpen('03') && (
          <>
            <p className="pc-section-desc">
              Rough admit probability estimates given your profile (3.0→3.6 GPA trend, CS major + Management minor, honors thesis in progress, research + strong projects).
              Use as relative guidance, not prediction.
            </p>
            <div className="pc-chart-panel">
              <div className="pc-chart-title">Estimated Admit Probability by Program</div>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={admitOddsData} layout="vertical" margin={{ top: 10, right: 70, bottom: 10, left: 100 }}>
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
                    interval={0}
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
                    formatter={(v, _n, props) => [`${v}% · ${props.payload.tier}`, 'Admit Odds']}
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
          </>
        )}
      </section>

      {/* 04 — Radar Comparison */}
      <section className="pc-section">
        <SectionHeader
          num="04"
          title="Radar Comparison"
          extra={<span className="pc-selected-count">{selected.length} / {programs.length} SELECTED</span>}
          onToggle={() => toggleCollapse('04')}
          open={isOpen('04')}
        />
        {isOpen('04') && (
          <>
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
              <button className="pc-filter-chip" onClick={() => setSelected(programs.map(p => p.id))}>
                Select All
              </button>
              <button className="pc-filter-chip" onClick={() => setSelected([])}>
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
          </>
        )}
      </section>

      {/* 05 — Priorities */}
      <section className="pc-section">
        <SectionHeader num="05" title="Priorities" onToggle={() => toggleCollapse('05')} open={isOpen('05')} />
        {isOpen('05') && (
          <>
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
          </>
        )}
      </section>

      {/* 06 — Ranking */}
      <section className="pc-section">
        <SectionHeader num="06" title="Ranking" onToggle={() => toggleCollapse('06')} open={isOpen('06')} />
        {isOpen('06') && (
          <>
            <div className="pc-tab-row">
              <button
                className={`pc-tab ${rankingTab === 'weighted' ? 'active' : ''}`}
                onClick={() => setRankingTab('weighted')}
              >
                Weighted Ranking
              </button>
              <button
                className={`pc-tab ${rankingTab === 'personal' ? 'active' : ''}`}
                onClick={() => setRankingTab('personal')}
              >
                Personal Ranking
              </button>
            </div>

            {rankingTab === 'weighted' && (
              <>
                <p className="pc-section-desc">
                  Scores reflect your weighting from section 05. Click any row to toggle it on the radar chart.
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
              </>
            )}

            {rankingTab === 'personal' && (
              <>
                <p className="pc-section-desc">
                  Drag rows to rank programs in your own order. Saved automatically in your browser.
                </p>
                <div className="pc-personal-ranking">
                  {personalRanking.map((id, i) => {
                    const p = programs.find(x => x.id === id);
                    if (!p) return null;
                    const isDragging = dragState.dragging === id;
                    const isDragOver = dragState.over === id;
                    return (
                      <div
                        key={id}
                        className={`pc-personal-row${isDragging ? ' dragging' : ''}${isDragOver ? ' dragover' : ''}`}
                        style={{ borderLeftColor: p.color }}
                        draggable
                        onDragStart={e => handleDragStart(e, id)}
                        onDragOver={e => handleDragOver(e, id)}
                        onDrop={e => handleDrop(e, id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="pc-drag-handle">⠿</div>
                        <div className="pc-rank-num" style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-dim)' }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="pc-rank-name-group">
                          <div className="pc-rank-name">{p.name}</div>
                          <div className="pc-rank-meta">
                            {p.location} · {p.duration} · {p.cost} · {p.track} · {p.admitOdds}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pc-personal-actions">
                  <button
                    className="pc-filter-chip"
                    onClick={resetPersonalRanking}
                  >
                    Reset to Default
                  </button>
                </div>
              </>
            )}

            <p className="pc-note">
              Total cost = approximate tuition (2025–26) plus estimated living expenses for program duration (graduating March 2027).
              Salary estimates are median starting compensation for recent graduating cohorts, inclusive of bonus.
              Admit odds reflect your profile (3.0→3.6 GPA trend, CS major with Management minor, honors thesis in progress) — they are directional, not predictive.
              Verify all figures directly with each school before making decisions.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
