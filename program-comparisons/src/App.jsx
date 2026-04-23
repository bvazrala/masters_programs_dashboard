import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
         ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell,
         BarChart, Bar, LabelList } from 'recharts';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const programs = [
  {
    id: 'uw', name: 'UW CFRM', shortName: 'UW', location: 'Seattle, WA', duration: '15 mo', durationMonths: 15,
    cost: '~$70k total', totalCost: 70, overBudget: false, track: 'Quant Finance', color: '#5e8a85',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 105,
    coordinates: [-122.30, 47.66],
    placementRate: 95, pipelineScore: 7,
    topRoles: 'Quant risk, fintech, tech-finance, risk modeling',
    topEmployers: "Russell Investments, Parametric, Amazon Finance, MSFT Treasury, Moody's",
    pros: [
      'Affordable at ~$70k all-in — among the cheapest quant finance programs nationally',
      'Recruiting pipeline to Amazon, Microsoft, Parametric, and Russell Investments; 95% placement at graduation',
      '15-month structure includes an embedded internship, providing real-world finance experience before graduating',
    ],
    cons: [
      'Seattle averages only ~47% sunny days annually — worst weather match on this list',
      'Placement is heavily Seattle-centric; limited access to East Coast or Wall Street firms',
      'No published salary data; all salary estimates are based on industry benchmarks, not verified reports',
    ],
    applyUrl: 'https://foster.uw.edu/academics/degree-programs/master-of-science-in-computational-finance-risk-management/',
    scores: { roi: 7, affordability: 7, jobMarket: 7, weatherFit: 3, lifestyle: 7, duration: 6, capstone: 7, prestige: 6, versatility: 7 },
  },
  {
    id: 'calpoly', name: 'Cal Poly SLO MSBA', shortName: 'Cal Poly', location: 'San Luis Obispo, CA', duration: '10 mo', durationMonths: 10,
    cost: '~$46k total', totalCost: 46, overBudget: false, track: 'Business Analytics', color: '#d4a952',
    admitOdds: 'Safety', admitOddsScore: 85, expectedSalary: 95,
    coordinates: [-120.66, 35.31],
    placementRate: 88, pipelineScore: 4,
    topRoles: 'Data analyst, BI, product analytics, marketing analytics',
    topEmployers: 'Oracle, Google, Deloitte, Capital One, PwC, T-Mobile',
    pros: [
      'Cheapest program on this list at ~$46k all-in; best salary-to-cost ratio (~2×) of any program',
      'San Luis Obispo offers the best lifestyle on the list: 260+ sunny days, beaches, wine country',
      '10-month timeline — fastest program to complete; earliest possible workforce entry',
    ],
    cons: [
      '2025 placement report had only 13 respondents — data is statistically uncertain',
      'Regional California brand; limited access to East Coast finance, national consulting, or Wall Street',
      'Less quant depth; best for general business analytics rather than specialized quantitative roles',
    ],
    applyUrl: 'https://orfalea.calpoly.edu/graduate/ms-business-analytics',
    scores: { roi: 9, affordability: 10, jobMarket: 5, weatherFit: 10, lifestyle: 10, duration: 10, capstone: 6, prestige: 4, versatility: 6 },
  },
  {
    id: 'utaustin', name: 'UT Austin MSBA', shortName: 'UT Austin', location: 'Austin, TX', duration: '10 mo', durationMonths: 10,
    cost: '~$80k total', totalCost: 80, overBudget: false, track: 'Business Analytics', color: '#b8923b',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 106,
    coordinates: [-97.73, 30.28],
    placementRate: 98, pipelineScore: 8,
    topRoles: 'Data scientist, BI, product analytics, consulting',
    topEmployers: 'Apple, Tesla, Google, Oracle, Dell, Indeed, Meta, Deloitte',
    pros: [
      '98% placement within 6 months (Class of 2024); $105,507 verified average base salary',
      'Financial services placed 38% of Class of 2024 — far stronger finance pipeline than a typical analytics program',
      'Austin ecosystem includes Apple, Tesla, Oracle, Dell, Google, and Meta — all within the metro',
    ],
    cons: [
      'Texas summers exceed 95°F+ routinely; fall and spring are excellent but summer comfort is a concern',
      'Out-of-state tuition pushes all-in cost to ~$80k — mid-range for this list',
      'Selectivity has increased sharply as reputation has grown; admission is increasingly competitive',
    ],
    applyUrl: 'https://www.mccombs.utexas.edu/graduate/masters-programs/ms-business-analytics/',
    scores: { roi: 8, affordability: 5, jobMarket: 8, weatherFit: 7, lifestyle: 8, duration: 10, capstone: 7, prestige: 7, versatility: 8 },
  },
  {
    id: 'gatech', name: 'Georgia Tech MSA', shortName: 'GA Tech', location: 'Atlanta, GA', duration: '12 mo', durationMonths: 12,
    cost: '~$70k total', totalCost: 70, overBudget: false, track: 'Business Analytics', color: '#a0614a',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 109,
    coordinates: [-84.40, 33.78],
    placementRate: 87, pipelineScore: 9,
    topRoles: 'Data scientist, ML engineer, business analyst, consultant',
    topEmployers: 'Delta, Home Depot, UPS, Coca-Cola, Microsoft, ICE/NYSE, Truist',
    pros: [
      'Applied Analytics Practicum (6 credits) with named company sponsors — one of the best-structured capstones nationally',
      '~$109k average salary on ~$70k all-in (~1.55× ROI); consistently ranked top-3 analytics programs nationally',
      'Tri-college structure (Engineering + Computing + Scheller) opens tech, data science, analytics, and consulting simultaneously',
    ],
    cons: [
      'Atlanta traffic is notoriously severe and is a consistent quality-of-life friction point',
      'Hot and humid summers; climate does not match SoCal coastal preferences',
      'Less finance-specific pipeline than Rutgers or UIUC; best for tech, consulting, and analytics roles',
    ],
    applyUrl: 'https://scheller.gatech.edu/degree-programs/master-of-science/master-of-science-in-analytics/',
    scores: { roi: 9, affordability: 6, jobMarket: 8, weatherFit: 6, lifestyle: 6, duration: 9, capstone: 9, prestige: 8, versatility: 9 },
  },
  {
    id: 'usc', name: 'USC Marshall MSBA', shortName: 'USC', location: 'Los Angeles, CA', duration: '12 mo', durationMonths: 12,
    cost: '~$88k total', totalCost: 88, overBudget: false, track: 'Business Analytics', color: '#a32035',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 105,
    coordinates: [-118.29, 34.02],
    placementRate: 90, pipelineScore: 8,
    topRoles: 'Data scientist, product analytics, fintech, consulting, entertainment analytics',
    topEmployers: 'Amazon, Netflix, Disney, Deloitte, JPMorgan, Google, Goldman Sachs, SpaceX',
    pros: [
      'LA location and 90,000+ Marshall alumni network — natural fit from UCI, same job market and weather',
      'Broadest employer diversity: tech (Google, Amazon, SpaceX), entertainment (Netflix, Disney), and finance (JPMorgan) all recruit directly',
      '12-month program at a nationally recognized brand with dominant West Coast employer relationships',
    ],
    cons: [
      'At ~$88k all-in, sits at the top of the stated budget; LA cost of living adds real pressure during the program',
      'More generalist and MBA-adjacent; less quantitative depth than UIUC, Rutgers, or NC State',
      'Rising selectivity; increasingly competitive admission as the program\'s reputation has grown',
    ],
    applyUrl: 'https://www.marshall.usc.edu/programs/specialized-masters-programs/master-science-business-analytics',
    scores: { roi: 7, affordability: 5, jobMarket: 9, weatherFit: 10, lifestyle: 10, duration: 9, capstone: 7, prestige: 8, versatility: 8 },
  },
  {
    id: 'gwu', name: 'GWU MSBA', shortName: 'GWU', location: 'Washington, DC', duration: '12 mo', durationMonths: 12,
    cost: '~$90k total', totalCost: 90, overBudget: false, track: 'Business Analytics', color: '#8b5a8a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 90,
    coordinates: [-77.05, 38.90],
    placementRate: 80, pipelineScore: 6,
    topRoles: 'Consulting, federal analytics, business analyst, BI',
    topEmployers: 'Deloitte, Accenture, Booz Allen, Guidehouse, IBM, MITRE, federal agencies',
    pros: [
      'Unique access to federal analytics, government contracting (Booz Allen, MITRE), and regulatory roles unavailable at most programs',
      'Capstone with named sponsors: Deloitte, Accenture, IBM, SAS, MITRE — full-cycle applied projects each semester',
      'DC location provides career flexibility across government, consulting, and finance simultaneously',
    ],
    cons: [
      'No published MSBA salary data; estimated $80–100k range is based on DC market benchmarks, not verified placement reports',
      'GWU brand is strong in DC but has limited national employer recognition outside government and consulting',
      'High DC cost of living relative to program salary outcomes reduces effective financial return',
    ],
    applyUrl: 'https://business.gwu.edu/masters-program-business-analytics',
    scores: { roi: 5, affordability: 4, jobMarket: 7, weatherFit: 6, lifestyle: 7, duration: 8, capstone: 8, prestige: 5, versatility: 7 },
  },
  {
    id: 'rutgers', name: 'Rutgers MQF', shortName: 'Rutgers', location: 'Newark, NJ', duration: '18 mo', durationMonths: 18,
    cost: '~$115k total', totalCost: 115, overBudget: true, track: 'Quant Finance', color: '#4a6b4a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 106,
    coordinates: [-74.17, 40.73],
    placementRate: 89, pipelineScore: 9,
    topRoles: 'Quant analyst, risk, quant research, trading, asset mgmt',
    topEmployers: 'Goldman Sachs, JPMorgan, Morgan Stanley, Bloomberg, Prudential, BNY, Citi, HSBC, UBS',
    pros: [
      'Best Wall Street pipeline on this list: Goldman Sachs, JPMorgan, Morgan Stanley, Bloomberg, BNY, and Citi all recruit directly',
      '$106k average salary (QuantNet 2024 reported cohort); NYC accessible by NJ Transit in under 45 minutes',
      'QuantNet-ranked; specifically respected in quant finance and risk management hiring circles',
    ],
    cons: [
      'Most expensive program on this list at ~$115k OOS all-in — $25–55k above the stated budget',
      '18-month timeline is the longest among quant programs, increasing opportunity cost',
      'Specialist track; less effective if career interests shift toward general tech, analytics, or consulting',
    ],
    applyUrl: 'https://business.rutgers.edu/master-quantitative-finance',
    scores: { roi: 7, affordability: 3, jobMarket: 9, weatherFit: 5, lifestyle: 5, duration: 5, capstone: 6, prestige: 7, versatility: 6 },
  },
  {
    id: 'ncstate', name: 'NC State MFM', shortName: 'NC State', location: 'Raleigh, NC', duration: '18 mo', durationMonths: 18,
    cost: '~$68k total', totalCost: 68, overBudget: false, track: 'Quant Finance', color: '#6e5a9e',
    admitOdds: 'Target', admitOddsScore: 70, expectedSalary: 118,
    coordinates: [-78.69, 35.79],
    placementRate: 100, pipelineScore: 8,
    topRoles: 'Quant risk, financial analyst, risk modeling, derivatives',
    topEmployers: 'Goldman Sachs, JPMorgan, Morgan Stanley, UBS, BlackRock, Fidelity, T. Rowe Price, BoA',
    pros: [
      'Best documented ROI on this list: ~$118k average salary on ~$68k all-in (~1.7×); 100% placement at 6 months',
      'National quant placement at Goldman Sachs, JPMorgan, Morgan Stanley, UBS, BlackRock, Fidelity — all verified in placement reports',
      'QuantNet #12 (2025) and Risk.net #5 in mathematical finance; recognized specifically by quant hiring managers',
    ],
    cons: [
      '18-month program is longer than the 12-month ideal, increasing opportunity cost versus faster programs',
      'Research Triangle is affordable but lacks the energy and lifestyle of a major metro',
      'Specialist quant track — pivoting to general tech analytics, consulting, or product management is harder',
    ],
    applyUrl: 'https://financial.math.ncsu.edu/',
    scores: { roi: 10, affordability: 7, jobMarket: 7, weatherFit: 8, lifestyle: 7, duration: 5, capstone: 8, prestige: 6, versatility: 6 },
  },
  {
    id: 'uiuc', name: 'UIUC MSFE', shortName: 'UIUC', location: 'Champaign, IL', duration: '18 mo', durationMonths: 18,
    cost: '~$98k total', totalCost: 98, overBudget: true, track: 'Quant Finance', color: '#8c8a4a',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 115,
    coordinates: [-88.23, 40.10],
    placementRate: 91, pipelineScore: 9,
    topRoles: 'Quant analyst, risk, quant research, trading',
    topEmployers: 'Citadel, Jane Street, Jump Trading, DRW, IMC, CME Group, Morgan Stanley, JPMorgan',
    pros: [
      'Highest verified average salary on this list: $115,167 (Class of 2024, per msfe.illinois.edu)',
      'Elite Chicago quant trading pipeline: Citadel, Jane Street, Jump, DRW, IMC, and CME Group all recruit directly',
      'UIUC is a top-5 CS and engineering brand globally — carries strong recognition across tech and quantitative finance',
    ],
    cons: [
      'At ~$98k all-in, exceeds the stated budget by $8–38k',
      'Champaign-Urbana is a small college town with limited lifestyle and no independent metro job market',
      'Cold midwestern winters with extended grey periods November through March — significant weather mismatch',
    ],
    applyUrl: 'https://msfe.illinois.edu/',
    scores: { roi: 7, affordability: 3, jobMarket: 8, weatherFit: 4, lifestyle: 4, duration: 5, capstone: 9, prestige: 8, versatility: 6 },
  },
  {
    id: 'cmu', name: 'CMU EPP', shortName: 'CMU', location: 'Pittsburgh, PA', duration: '9 mo', durationMonths: 9,
    cost: '~$92k total', totalCost: 92, overBudget: true, track: 'Policy/Consulting', color: '#9e7b5a',
    admitOdds: 'Reach', admitOddsScore: 35, expectedSalary: 97,
    coordinates: [-79.94, 40.44],
    placementRate: 85, pipelineScore: 7,
    topRoles: 'Tech-policy consultant, strategy analyst, govt, industry strategy',
    topEmployers: 'Deloitte Gov, Booz Allen, RAND, McKinsey, BCG, Bain (via CMU halo), federal agencies',
    pros: [
      '9-month program — fastest on this list; CMU brand opens doors globally in CS, engineering, and policy',
      'Unique program intersection: engineering + policy + quantitative methods opens tech-policy, fintech regulation, and strategy consulting',
      'CMU network provides access to consulting firms (MBB via CMU CS halo), government tech, and think tanks',
    ],
    cons: [
      '~$92k all-in for 9 months is the highest cost-per-month ratio on this list',
      'No published MS EPP salary data; outcomes depend heavily on chosen specialization and are hard to benchmark',
      'Pittsburgh is the cloudiest major US city (~42% sunshine) and has limited lifestyle appeal',
    ],
    applyUrl: 'https://www.cmu.edu/epp/master/',
    scores: { roi: 5, affordability: 3, jobMarket: 7, weatherFit: 2, lifestyle: 4, duration: 8, capstone: 7, prestige: 8, versatility: 7 },
  },
  // ── 5 new programs ──────────────────────────────────────────
  {
    id: 'sjsu', name: 'SJSU MS Financial Analytics', shortName: 'SJSU', location: 'San Jose, CA', duration: '12 mo', durationMonths: 12,
    cost: '~$40k total', totalCost: 40, overBudget: false, track: 'Quant Finance', color: '#3b7dbf',
    admitOdds: 'Safety', admitOddsScore: 78, expectedSalary: 100,
    coordinates: [-121.89, 37.34],
    placementRate: 80, pipelineScore: 6,
    topRoles: 'Fintech analyst, quantitative analyst, financial data analyst, risk analyst',
    topEmployers: 'PayPal, Visa, Charles Schwab, Wells Fargo, Bloomberg, Salesforce, Bay Area fintech firms',
    pros: [
      'Cheapest quant-adjacent program near a major tech-finance hub at ~$40k all-in',
      'Silicon Valley location: direct access to PayPal, Visa, Charles Schwab, Bloomberg, and the Bay Area fintech ecosystem',
      'STEM-designated program; qualifies for OPT STEM extension, extending post-graduation work authorization',
    ],
    cons: [
      'Limited national brand recognition; SJSU is not well known outside the Bay Area and Silicon Valley',
      'Competitive Bay Area market heavily favors graduates from Stanford, Berkeley, and top-ranked MFE programs',
      'No well-documented salary or placement data published; outcomes are harder to verify than most programs here',
    ],
    applyUrl: 'https://www.sjsu.edu/lucas/programs/ms-financial-analytics/',
    scores: { roi: 9, affordability: 9, jobMarket: 8, weatherFit: 7, lifestyle: 7, duration: 9, capstone: 5, prestige: 4, versatility: 6 },
  },
  {
    id: 'tamu', name: 'Texas A&M Mays MSBA', shortName: 'TX A&M', location: 'College Station, TX', duration: '12 mo', durationMonths: 12,
    cost: '~$48k total', totalCost: 48, overBudget: false, track: 'Business Analytics', color: '#7d2a1e',
    admitOdds: 'Target', admitOddsScore: 70, expectedSalary: 95,
    coordinates: [-96.33, 30.63],
    placementRate: 88, pipelineScore: 7,
    topRoles: 'Business analyst, data analyst, consulting, supply chain analytics, energy analytics',
    topEmployers: 'EY, KPMG, Deloitte, Dell, AT&T, Chevron, ExxonMobil, Capital One',
    pros: [
      'One of the most affordable programs at ~$48k OOS all-in; best cost value for an accredited analytics program',
      'Aggie alumni network is famously loyal; particularly strong in Texas (Dallas, Houston, Austin) and energy/finance sectors',
      'Recruits across diverse industries: EY, Deloitte, Dell, AT&T, Chevron, and Capital One all hire directly',
    ],
    cons: [
      'College Station is a small college town with limited lifestyle, culture, and independent career connections',
      'Texas heat and humidity is a significant mismatch for SoCal coastal weather preferences',
      'Employer pipeline skews Texas-based and energy-sector; less access to West Coast tech or Wall Street finance',
    ],
    applyUrl: 'https://mays.tamu.edu/master-of-science-in-business-analytics/',
    scores: { roi: 9, affordability: 9, jobMarket: 7, weatherFit: 6, lifestyle: 5, duration: 9, capstone: 7, prestige: 7, versatility: 8 },
  },
  {
    id: 'asu', name: 'ASU W.P. Carey MSBA', shortName: 'ASU', location: 'Tempe, AZ', duration: '12 mo', durationMonths: 12,
    cost: '~$58k total', totalCost: 58, overBudget: false, track: 'Business Analytics', color: '#d4651a',
    admitOdds: 'Target', admitOddsScore: 68, expectedSalary: 98,
    coordinates: [-111.94, 33.42],
    placementRate: 85, pipelineScore: 6,
    topRoles: 'Data analyst, supply chain analyst, operations analytics, consulting',
    topEmployers: 'Intel, Amazon, Honeywell, Deloitte, American Express, GoDaddy, TSMC',
    pros: [
      'Affordable at ~$58k all-in; W.P. Carey is ranked top-25 nationally in analytics with a growing employer footprint',
      'Phoenix averages 300+ sunny days per year — one of the best weather matches on this list',
      'Growing tech hub: Intel, Amazon, TSMC, and American Express all have major Phoenix operations and recruit directly',
    ],
    cons: [
      'Phoenix summers reach 110°F+ — outdoor lifestyle is effectively impossible June through September',
      'W.P. Carey has limited employer recognition on the East Coast or in quant finance circles',
      'Pipeline skews toward supply chain, operations analytics, and Arizona-based corporates',
    ],
    applyUrl: 'https://wpcarey.asu.edu/master-science-business-analytics',
    scores: { roi: 8, affordability: 8, jobMarket: 7, weatherFit: 8, lifestyle: 7, duration: 9, capstone: 7, prestige: 6, versatility: 8 },
  },
  {
    id: 'vanderbilt', name: 'Vanderbilt Owen MSBA', shortName: 'Vandy', location: 'Nashville, TN', duration: '12 mo', durationMonths: 12,
    cost: '~$78k total', totalCost: 78, overBudget: false, track: 'Business Analytics', color: '#4a7c59',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 105,
    coordinates: [-86.80, 36.14],
    placementRate: 90, pipelineScore: 7,
    topRoles: 'Data analyst, healthcare analytics, consulting, financial analyst',
    topEmployers: 'Deloitte, EY, Amazon, HCA Healthcare, Bridgestone, Dollar General, Asurion',
    pros: [
      'Vanderbilt is an Ivy-adjacent national brand — strong employer recognition across consulting, finance, and healthcare analytics',
      'Nashville is a fast-growing city with a vibrant food, music, and culture scene; great mid-size city quality of life',
      'Structured 12-month practicum with named company partnerships; strong consulting and healthcare analytics placement',
    ],
    cons: [
      'Nashville job market is smaller than major metros — most Owen graduates relocate after graduation',
      'At ~$78k all-in, mid-to-upper range without the salary outcomes of higher-ranked programs',
      'Less depth in quant finance or pure data science compared to UIUC, Rutgers, or GA Tech',
    ],
    applyUrl: 'https://business.vanderbilt.edu/graduate/master-of-science-in-business-analytics/',
    scores: { roi: 7, affordability: 5, jobMarket: 7, weatherFit: 7, lifestyle: 8, duration: 9, capstone: 8, prestige: 8, versatility: 8 },
  },
  {
    id: 'bu', name: 'BU Questrom MSBA', shortName: 'BU', location: 'Boston, MA', duration: '12 mo', durationMonths: 12,
    cost: '~$82k total', totalCost: 82, overBudget: false, track: 'Business Analytics', color: '#c95c7a',
    admitOdds: 'Target', admitOddsScore: 62, expectedSalary: 105,
    coordinates: [-71.11, 42.35],
    placementRate: 88, pipelineScore: 7,
    topRoles: 'Financial analyst, data scientist, consulting, healthcare analytics',
    topEmployers: 'State Street, Fidelity, Liberty Mutual, Bain & Company, PwC, HubSpot, Amazon',
    pros: [
      'Boston is a top-5 US financial hub: State Street, Fidelity, and Liberty Mutual recruit directly, alongside Bain & Company',
      'Proximity to Harvard, MIT, and BCG creates an ecosystem effect for networking and career exposure',
      'Strong quantitative analytics curriculum with solid finance orientation for a business school program',
    ],
    cons: [
      'Boston winters are cold, grey, and snowy — a significant mismatch for SoCal weather preferences',
      'At ~$82k all-in, sits at the top of the budget range without elite brand differentiation in a crowded Boston market',
      'BU Questrom competes against Harvard, MIT, and Boston College for top employer attention in Boston',
    ],
    applyUrl: 'https://questromworld.bu.edu/msba/',
    scores: { roi: 7, affordability: 5, jobMarket: 8, weatherFit: 3, lifestyle: 7, duration: 9, capstone: 7, prestige: 7, versatility: 8 },
  },
];

const criteria = [
  { key: 'roi',          label: 'ROI',           description: 'Expected salary outcome relative to program cost' },
  { key: 'affordability',label: 'Affordability',  description: 'Absolute program cost (cheaper = higher)' },
  { key: 'jobMarket',    label: 'Job Market',     description: 'Local employer depth for target roles' },
  { key: 'weatherFit',   label: 'Weather Fit',    description: 'Match to warm, sunny SoCal-style preference' },
  { key: 'lifestyle',    label: 'Lifestyle',      description: 'Food, culture, activities, city vibe' },
  { key: 'duration',     label: 'Duration',       description: 'Program length (shorter = higher)' },
  { key: 'capstone',     label: 'Capstone',       description: 'Quality of applied project / industry partnership' },
  { key: 'prestige',     label: 'Prestige',       description: 'Brand strength with employers' },
  { key: 'versatility',  label: 'Versatility',    description: 'Breadth of career paths program opens' },
];

const TIER_COLORS = { Reach: '#c96e5c', Target: '#e4a853', Safety: '#5e8a85' };

const SCATTER_LABEL_OFFSETS = {
  sjsu:       { dx: -12, dy: -16, anchor: 'end' },
  calpoly:    { dx:   0, dy:  18, anchor: 'middle' },
  tamu:       { dx:  12, dy: -16, anchor: 'start' },
  asu:        { dx:  12, dy: -16, anchor: 'start' },
  ncstate:    { dx: -12, dy: -16, anchor: 'end' },
  uw:         { dx: -14, dy:  16, anchor: 'end' },
  gatech:     { dx:  14, dy: -16, anchor: 'start' },
  vanderbilt: { dx:   0, dy:  18, anchor: 'middle' },
  utaustin:   { dx: -12, dy: -18, anchor: 'end' },
  bu:         { dx:  12, dy:  16, anchor: 'start' },
  usc:        { dx:  12, dy: -18, anchor: 'start' },
  gwu:        { dx: -12, dy:  14, anchor: 'end' },
  cmu:        { dx:  12, dy:  14, anchor: 'start' },
  uiuc:       { dx:  12, dy: -16, anchor: 'start' },
  rutgers:    { dx:   0, dy: -18, anchor: 'middle' },
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
  if (!active || !payload?.length) return null;
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
  const radius = r || 8;
  const { dx, dy, anchor } = SCATTER_LABEL_OFFSETS[payload.id] || { dx: 0, dy: -16, anchor: 'middle' };
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={payload.color} fillOpacity={0.75} stroke={payload.color} strokeWidth={1} />
      <text x={cx + dx} y={cy + dy} fill="#ebe3d0" fontSize={9} fontFamily="IBM Plex Mono" textAnchor={anchor}>
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
    <span className="pc-collapse-btn">{open ? '−' : '+'}</span>
  </div>
);

export default function ProgramComparison() {
  const [selected, setSelected]           = useState(['cmu', 'uw', 'utaustin']);
  const [weights, setWeights]             = useState({ roi: 9, affordability: 7, jobMarket: 10, weatherFit: 4, lifestyle: 6, duration: 5, capstone: 9, prestige: 9, versatility: 8 });
  const [trackFilter, setTrackFilter]     = useState('All');
  const [collapsed, setCollapsed]         = useState({});
  const [rankingTab, setRankingTab]       = useState('weighted');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [mapLayers, setMapLayers]         = useState({ jobMarket: true, pipeline: true });
  const [hoveredSchool, setHoveredSchool] = useState(null);
  const [personalRanking, setPersonalRanking] = useState(() => {
    try {
      const saved = localStorage.getItem('pc-personal-ranking');
      return saved ? JSON.parse(saved) : programs.map(p => p.id);
    } catch { return programs.map(p => p.id); }
  });
  const [dragState, setDragState] = useState({ dragging: null, over: null });

  const toggleCollapse = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  const isOpen         = (key) => !collapsed[key];

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleCard = (id, e) => {
    e.stopPropagation();
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleMapLayer = (layer) =>
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));

  const handleDragStart = (e, id) => { e.dataTransfer.effectAllowed = 'move'; setDragState({ dragging: id, over: null }); };
  const handleDragOver  = (e, id) => { e.preventDefault(); setDragState(s => ({ ...s, over: id })); };
  const handleDrop      = (e, targetId) => {
    e.preventDefault();
    const fromId = dragState.dragging;
    if (!fromId || fromId === targetId) { setDragState({ dragging: null, over: null }); return; }
    const next = [...personalRanking];
    next.splice(next.indexOf(fromId), 1);
    next.splice(next.indexOf(targetId), 0, fromId);
    setPersonalRanking(next);
    localStorage.setItem('pc-personal-ranking', JSON.stringify(next));
    setDragState({ dragging: null, over: null });
  };
  const handleDragEnd = () => setDragState({ dragging: null, over: null });
  const resetPersonalRanking = () => { setPersonalRanking(programs.map(p => p.id)); localStorage.removeItem('pc-personal-ranking'); };

  const radarData = useMemo(() => criteria.map(c => {
    const entry = { criterion: c.label };
    selected.forEach(id => { const p = programs.find(x => x.id === id); if (p) entry[p.shortName] = p.scores[c.key]; });
    return entry;
  }), [selected]);

  const rankedPrograms = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0) || 1;
    return [...programs]
      .map(p => ({ ...p, weightedScore: criteria.reduce((sum, c) => sum + p.scores[c.key] * weights[c.key], 0) / totalWeight }))
      .sort((a, b) => b.weightedScore - a.weightedScore);
  }, [weights]);

  const tracks = ['All', ...new Set(programs.map(p => p.track))];
  const filteredPrograms = trackFilter === 'All' ? programs : programs.filter(p => p.track === trackFilter);
  const maxWeightedScore = rankedPrograms[0]?.weightedScore || 10;

  const maxPlacementR = Math.max(...programs.map(p => p.placementRate));
  const maxPipelineR  = Math.max(...programs.map(p => p.pipelineScore));

  return (
    <div className="pc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .pc-root {
          --bg: #0f1216; --surface: #171b22; --surface-2: #1f242d; --border: #2a313c;
          --text: #ebe3d0; --text-dim: #8f8876; --text-faint: #595647;
          --accent: #e4a853; --reach: #c96e5c; --target: #e4a853; --safety: #5e8a85;
          --serif: 'Fraunces', Georgia, serif; --sans: 'IBM Plex Sans', -apple-system, sans-serif;
          --mono: 'IBM Plex Mono', Menlo, monospace;
          background: var(--bg); color: var(--text); font-family: var(--sans);
          min-height: 100vh; padding: 32px clamp(12px, 3vw, 48px) 64px;
          width: 100%; border-inline: 1px solid var(--border); font-size: 14px; line-height: 1.5;
        }
        .pc-root * { box-sizing: border-box; }

        .pc-header { border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px; }
        .pc-kicker { font-family: var(--mono); font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
        .pc-title { font-family: var(--serif); font-weight: 600; font-size: clamp(28px,5vw,42px); line-height: 1.05; letter-spacing: -.02em; margin: 0 0 12px; color: var(--text); }
        .pc-title em { font-style: italic; color: var(--accent); font-weight: 500; }
        .pc-subtitle { color: var(--text-dim); font-size: 15px; max-width: 680px; margin: 0; }
        .pc-stats-row { display: flex; gap: 32px; margin-top: 24px; flex-wrap: wrap; }
        .pc-stat { display: flex; flex-direction: column; gap: 2px; }
        .pc-stat-label { font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-faint); }
        .pc-stat-value { font-family: var(--serif); font-size: clamp(22px,4vw,28px); font-weight: 600; color: var(--text); }
        .pc-stat-value .accent { color: var(--accent); }

        .pc-section { margin-bottom: 40px; }
        .pc-section-header {
          display: flex; align-items: center; gap: 14px; padding: 14px 18px;
          background: var(--surface); border: 1px solid var(--border); border-left: 3px solid var(--border);
          cursor: pointer; user-select: none; transition: background .15s, border-left-color .15s; margin-bottom: 16px;
        }
        .pc-section-header:hover { background: var(--surface-2); border-left-color: var(--accent); }
        .pc-section-number { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: .1em; flex-shrink: 0; }
        .pc-section-title { font-family: var(--serif); font-weight: 600; font-size: clamp(18px,3vw,22px); letter-spacing: -.01em; margin: 0; flex: 1; color: var(--text); transition: color .15s; text-align: left; }
        .pc-section-header:hover .pc-section-title { color: var(--accent); }
        .pc-collapse-btn { width: 32px; height: 32px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text-dim); display: flex; align-items: center; justify-content: center; font-size: 20px; font-family: var(--mono); flex-shrink: 0; border-radius: 2px; transition: all .15s; pointer-events: none; }
        .pc-section-header:hover .pc-collapse-btn { background: var(--accent); color: var(--bg); border-color: var(--accent); }
        .pc-section-desc { font-size: 13px; color: var(--text-dim); margin: 0 0 16px; }

        .pc-filter-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .pc-filter-chip { font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; padding: 6px 12px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); cursor: pointer; transition: all .15s; }
        .pc-filter-chip:hover { color: var(--text); border-color: var(--text-dim); }
        .pc-filter-chip.active { color: var(--bg); background: var(--accent); border-color: var(--accent); }

        /* Cards */
        .pc-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 12px; }
        .pc-card { background: var(--surface); border: 1px solid var(--border); border-top: 3px solid var(--border); transition: all .15s; }
        .pc-card-body { padding: 20px; cursor: pointer; }
        .pc-card-body:hover { background: var(--surface-2); }
        .pc-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 12px; }
        .pc-card-title { font-family: var(--serif); font-size: 17px; font-weight: 600; color: var(--text); letter-spacing: -.01em; line-height: 1.2; margin: 0 0 4px; }
        .pc-card-loc { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); }
        .pc-card-tier { font-family: var(--mono); font-size: 9px; letter-spacing: .15em; text-transform: uppercase; padding: 3px 8px; border: 1px solid currentColor; white-space: nowrap; flex-shrink: 0; }
        .pc-card-tier.Reach { color: var(--reach); } .pc-card-tier.Target { color: var(--target); } .pc-card-tier.Safety { color: var(--safety); }
        .pc-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; padding: 12px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 12px; }
        .pc-card-stat { display: flex; flex-direction: column; gap: 2px; }
        .pc-card-stat-label { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); }
        .pc-card-stat-value { font-size: 13px; color: var(--text); font-weight: 500; }
        .pc-card-section { margin-top: 10px; }
        .pc-card-section-label { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 4px; }
        .pc-card-section-text { font-size: 12px; color: var(--text-dim); line-height: 1.4; }

        /* Card details toggle */
        .pc-card-details-toggle { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-top: 1px solid var(--border); cursor: pointer; background: transparent; width: 100%; text-align: left; font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); transition: background .15s, color .15s; }
        .pc-card-details-toggle:hover { background: var(--surface-2); color: var(--accent); }
        .pc-card-details-panel { padding: 16px 20px; border-top: 1px solid var(--border); background: var(--bg); }
        .pc-card-pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; margin-bottom: 14px; }
        .pc-card-pros-cons-col-label { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 8px; }
        .pc-card-bullet { display: flex; gap: 8px; font-size: 11px; color: var(--text-dim); line-height: 1.5; margin-bottom: 6px; }
        .pc-card-bullet-icon { flex-shrink: 0; font-size: 11px; margin-top: 1px; }
        .pc-card-bullet-icon.pro  { color: var(--safety); }
        .pc-card-bullet-icon.con  { color: var(--reach); }
        .pc-card-apply { display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); text-decoration: none; border: 1px solid var(--accent); padding: 6px 12px; transition: all .15s; }
        .pc-card-apply:hover { background: var(--accent); color: var(--bg); }

        /* Tier legend */
        .pc-tier-legend { display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
        .pc-tier-badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
        .pc-tier-dot { width: 10px; height: 10px; }

        /* Charts */
        .pc-chart-panel { background: var(--surface); border: 1px solid var(--border); padding: 24px; }
        .pc-chart-title { font-family: var(--mono); font-size: 11px; letter-spacing: .15em; text-transform: uppercase; color: var(--text-dim); margin: 0 0 20px; }
        .pc-chart-subtitle { font-size: 12px; color: var(--text-faint); margin: 16px 0 0; font-style: italic; }
        .pc-legend { display: flex; flex-wrap: wrap; gap: 16px; padding-top: 20px; margin-top: 20px; border-top: 1px solid var(--border); }
        .pc-legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-dim); font-family: var(--mono); }
        .pc-legend-swatch { width: 12px; height: 12px; border: 1px solid currentColor; }

        /* Chips */
        .pc-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .pc-chip { padding: 8px 14px; border: 1px solid var(--border); background: var(--surface); color: var(--text-dim); cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; }
        .pc-chip:hover { color: var(--text); border-color: var(--text-dim); }
        .pc-chip.selected { color: var(--text); background: var(--surface-2); border-color: currentColor; }
        .pc-chip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .pc-chip-meta { font-family: var(--mono); font-size: 10px; color: var(--text-faint); }
        .pc-selected-count { font-family: var(--mono); font-size: 11px; color: var(--text-faint); letter-spacing: .1em; }

        /* Sliders */
        .pc-sliders { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; }
        .pc-slider-item { display: flex; flex-direction: column; gap: 4px; }
        .pc-slider-label { display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; }
        .pc-slider-label .label-text { color: var(--text); font-weight: 500; }
        .pc-slider-label .label-value { font-family: var(--mono); font-size: 12px; color: var(--accent); }
        .pc-slider-desc { font-size: 11px; color: var(--text-faint); line-height: 1.3; margin-bottom: 4px; }
        .pc-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; background: var(--border); outline: none; cursor: pointer; }
        .pc-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--accent); cursor: pointer; border: 2px solid var(--bg); border-radius: 0; }
        .pc-slider::-moz-range-thumb { width: 14px; height: 14px; background: var(--accent); cursor: pointer; border: 2px solid var(--bg); border-radius: 0; }

        /* Tabs */
        .pc-tab-row { display: flex; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
        .pc-tab { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; padding: 10px 20px; border: none; background: transparent; color: var(--text-dim); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all .15s; }
        .pc-tab:hover { color: var(--text); }
        .pc-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

        /* Ranking rows */
        .pc-ranking { display: flex; flex-direction: column; gap: 2px; }
        .pc-rank-row { display: grid; grid-template-columns: 40px 1fr auto 60px; gap: 16px; align-items: center; padding: 14px 16px; background: var(--surface); border: 1px solid var(--border); border-left: 3px solid transparent; transition: all .15s; cursor: pointer; }
        .pc-rank-row:hover { background: var(--surface-2); }
        .pc-rank-row.top3 { border-left-color: var(--accent); }
        .pc-rank-num { font-family: var(--serif); font-size: 20px; font-weight: 600; color: var(--text-dim); }
        .pc-rank-row.top3 .pc-rank-num { color: var(--accent); }
        .pc-rank-name-group { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .pc-rank-name { font-family: var(--serif); font-size: 15px; font-weight: 600; color: var(--text); }
        .pc-rank-meta { font-family: var(--mono); font-size: 10px; color: var(--text-faint); letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pc-rank-bar-container { width: 120px; height: 4px; background: var(--border); overflow: hidden; }
        .pc-rank-bar { height: 100%; transition: width .3s; }
        .pc-rank-score { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--text); text-align: right; }

        /* Personal ranking */
        .pc-personal-ranking { display: flex; flex-direction: column; gap: 2px; }
        .pc-personal-row { display: grid; grid-template-columns: 28px 40px 1fr; gap: 12px; align-items: center; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-left: 3px solid transparent; cursor: grab; user-select: none; }
        .pc-personal-row:active { cursor: grabbing; }
        .pc-personal-row.dragging { opacity: .35; }
        .pc-personal-row.dragover { border-top: 2px solid var(--accent); }
        .pc-drag-handle { color: var(--text-faint); font-size: 15px; display: flex; align-items: center; justify-content: center; }
        .pc-personal-actions { display: flex; align-items: center; gap: 12px; margin-top: 16px; }

        /* Map */
        .pc-map-controls { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .pc-layer-btn { font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; padding: 8px 16px; border: 1px solid var(--border); background: var(--surface); color: var(--text-dim); cursor: pointer; transition: all .15s; display: flex; align-items: center; gap: 8px; }
        .pc-layer-btn:hover { color: var(--text); border-color: var(--text-dim); }
        .pc-layer-btn.active { color: var(--text); border-color: var(--accent); background: rgba(228,168,83,.08); }
        .pc-layer-indicator { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .pc-map-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); padding: 0; overflow: hidden; }
        .pc-map-hover-panel { padding: 14px 20px; border-top: 1px solid var(--border); min-height: 72px; display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .pc-map-hover-name { font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
        .pc-map-hover-loc { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); }
        .pc-map-hover-employers { font-size: 12px; color: var(--text-dim); margin-top: 6px; line-height: 1.5; }
        .pc-map-hover-hint { font-family: var(--mono); font-size: 11px; color: var(--text-faint); letter-spacing: .08em; text-transform: uppercase; align-self: center; }

        /* Misc */
        .pc-note { font-size: 12px; color: var(--text-faint); font-style: italic; margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px; line-height: 1.6; }

        @media (max-width: 768px) {
          .pc-root { padding: 20px 12px 48px; }
          .pc-sliders { grid-template-columns: 1fr; }
          .pc-cards { grid-template-columns: 1fr; }
          .pc-card-pros-cons { grid-template-columns: 1fr; }
          .pc-rank-row { grid-template-columns: 36px 1fr 52px; gap: 10px; padding: 12px; }
          .pc-rank-bar-container { display: none; }
          .pc-chip-meta { display: none; }
        }
      `}</style>

      {/* Header */}
      <header className="pc-header">
        <div className="pc-kicker">Personalized Decision Tool · {programs.length} Programs</div>
        <h1 className="pc-title">Graduate Program <em>Comparison</em></h1>
        <p className="pc-subtitle">
          Fifteen master's programs scored across nine dimensions. Radar overlays, cost-versus-outcome analysis,
          admit-odds estimates, weighted rankings, and an interactive program location map.
        </p>
        <div className="pc-stats-row">
          <div className="pc-stat"><div className="pc-stat-label">Programs</div><div className="pc-stat-value">{programs.length}</div></div>
          <div className="pc-stat"><div className="pc-stat-label">Cheapest Total</div><div className="pc-stat-value"><span className="accent">${Math.min(...programs.map(p => p.totalCost))}k</span></div></div>
          <div className="pc-stat"><div className="pc-stat-label">Highest Salary</div><div className="pc-stat-value"><span className="accent">${Math.max(...programs.map(p => p.expectedSalary))}k</span></div></div>
          <div className="pc-stat"><div className="pc-stat-label">Shortest</div><div className="pc-stat-value">{Math.min(...programs.map(p => p.durationMonths))} <span style={{ fontSize: 16, color: 'var(--text-dim)' }}>mo</span></div></div>
        </div>
      </header>

      {/* 01 — Program Overview */}
      <section className="pc-section">
        <SectionHeader num="01" title="Program Overview" onToggle={() => toggleCollapse('01')} open={isOpen('01')} />
        {isOpen('01') && (
          <>
            <p className="pc-section-desc">Each program at a glance. Click any card to toggle it on the radar chart. Use Details to see pros, cons, and application link.</p>
            <div className="pc-tier-legend">
              {['Reach','Target','Safety'].map(t => (
                <span key={t} className="pc-tier-badge" style={{ color: `var(--${t.toLowerCase()})` }}>
                  <span className="pc-tier-dot" style={{ background: `var(--${t.toLowerCase()})` }} /> {t}
                </span>
              ))}
            </div>
            <div className="pc-cards">
              {programs.map(p => {
                const isSelected = selected.includes(p.id);
                const isExpanded = expandedCards.has(p.id);
                return (
                  <div key={p.id} className="pc-card" style={{ borderTopColor: p.color, background: isSelected ? 'var(--surface-2)' : 'var(--surface)' }}>
                    <div className="pc-card-body" onClick={() => toggleSelect(p.id)}>
                      <div className="pc-card-header">
                        <div>
                          <h3 className="pc-card-title">{p.name}</h3>
                          <div className="pc-card-loc">{p.location} · {p.track}</div>
                        </div>
                        <span className={`pc-card-tier ${p.admitOdds}`}>{p.admitOdds}</span>
                      </div>
                      <div className="pc-card-grid">
                        <div className="pc-card-stat"><div className="pc-card-stat-label">Duration</div><div className="pc-card-stat-value">{p.duration}</div></div>
                        <div className="pc-card-stat"><div className="pc-card-stat-label">Total Cost</div><div className="pc-card-stat-value">${p.totalCost}k</div></div>
                        <div className="pc-card-stat"><div className="pc-card-stat-label">Est. Salary</div><div className="pc-card-stat-value">${p.expectedSalary}k</div></div>
                        <div className="pc-card-stat"><div className="pc-card-stat-label">Admit Odds</div><div className="pc-card-stat-value">~{p.admitOddsScore}%</div></div>
                      </div>
                      <div className="pc-card-section"><div className="pc-card-section-label">Top Roles</div><div className="pc-card-section-text">{p.topRoles}</div></div>
                      <div className="pc-card-section"><div className="pc-card-section-label">Key Employers</div><div className="pc-card-section-text">{p.topEmployers}</div></div>
                    </div>
                    <button className="pc-card-details-toggle" onClick={e => toggleCard(p.id, e)}>
                      <span>Details</span>
                      <span>{isExpanded ? '▴' : '▾'}</span>
                    </button>
                    {isExpanded && (
                      <div className="pc-card-details-panel">
                        <div className="pc-card-pros-cons">
                          <div>
                            <div className="pc-card-pros-cons-col-label">Pros</div>
                            {p.pros.map((pt, i) => (
                              <div key={i} className="pc-card-bullet">
                                <span className="pc-card-bullet-icon pro">✓</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="pc-card-pros-cons-col-label">Cons</div>
                            {p.cons.map((ct, i) => (
                              <div key={i} className="pc-card-bullet">
                                <span className="pc-card-bullet-icon con">✗</span>
                                <span>{ct}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <a href={p.applyUrl} target="_blank" rel="noopener noreferrer" className="pc-card-apply">Apply / Learn More →</a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* 02 — Cost vs. Expected Salary */}
      <section className="pc-section">
        <SectionHeader num="02" title="Cost vs. Expected Salary" onToggle={() => toggleCollapse('02')} open={isOpen('02')} />
        {isOpen('02') && (
          <>
            <p className="pc-section-desc">Upper-left is best ROI. Bubble size encodes admit odds — bigger means easier to get in. Hover for details.</p>
            <div className="pc-chart-panel">
              <div className="pc-chart-title">ROI Quadrant · All {programs.length} Programs</div>
              <ResponsiveContainer width="100%" height={500}>
                <ScatterChart margin={{ top: 30, right: 80, bottom: 56, left: 70 }}>
                  <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" />
                  <XAxis type="number" dataKey="x" name="Cost" unit="k" domain={[32, 122]} ticks={[40, 55, 70, 85, 100, 115]}
                    tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c"
                    label={{ value: 'Total Cost ($k)', position: 'insideBottom', offset: -14, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                  <YAxis type="number" dataKey="y" name="Salary" unit="k" domain={[88, 124]} ticks={[90, 100, 110, 120]}
                    tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c"
                    label={{ value: 'Expected Salary ($k)', angle: -90, position: 'insideLeft', offset: 10, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                  <ZAxis type="number" dataKey="z" range={[60, 360]} />
                  <Tooltip content={CustomScatterTooltip} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData} shape={ScatterDot} />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="pc-chart-subtitle">Salary figures from verified program employment reports (April 2026). Bubble size encodes admit likelihood.</p>
            </div>
          </>
        )}
      </section>

      {/* 03 — Admit Odds */}
      <section className="pc-section">
        <SectionHeader num="03" title="Admit Odds" onToggle={() => toggleCollapse('03')} open={isOpen('03')} />
        {isOpen('03') && (
          <>
            <p className="pc-section-desc">Rough estimates given your profile (3.5–3.6 GPA, CS + Management Minor, UCI, honors thesis, strong projects). Directional guidance only.</p>
            <div className="pc-chart-panel">
              <div className="pc-chart-title">Estimated Admit Probability by Program</div>
              <ResponsiveContainer width="100%" height={520}>
                <BarChart data={admitOddsData} layout="vertical" margin={{ top: 10, right: 70, bottom: 10, left: 90 }}>
                  <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" horizontal={false} />
                  <XAxis type="number" domain={[0,100]} tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c" unit="%" />
                  <YAxis type="category" dataKey="name" interval={0} tick={{ fill: '#ebe3d0', fontSize: 11, fontFamily: 'IBM Plex Sans' }} stroke="#2a313c" width={80} />
                  <Tooltip contentStyle={{ background: '#0f1216', border: '1px solid #e4a853', fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                    formatter={(v, _n, props) => [`${v}% · ${props.payload.tier}`, 'Admit Odds']}
                    cursor={{ fill: 'rgba(228,168,83,.05)' }} />
                  <Bar dataKey="odds">
                    {admitOddsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    <LabelList dataKey="odds" position="right" formatter={v => `${v}%`}
                      style={{ fill: '#ebe3d0', fontSize: 11, fontFamily: 'IBM Plex Mono', fontWeight: 500 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>

      {/* 04 — Radar Comparison */}
      <section className="pc-section">
        <SectionHeader num="04" title="Radar Comparison"
          extra={<span className="pc-selected-count">{selected.length} / {programs.length} SELECTED</span>}
          onToggle={() => toggleCollapse('04')} open={isOpen('04')} />
        {isOpen('04') && (
          <>
            <p className="pc-section-desc">Each axis scored 0–10. Select 2–5 programs for best readability.</p>
            <div className="pc-filter-row">
              {tracks.map(t => <button key={t} className={`pc-filter-chip ${trackFilter === t ? 'active' : ''}`} onClick={() => setTrackFilter(t)}>{t}</button>)}
              <button className="pc-filter-chip" onClick={() => setSelected(programs.map(p => p.id))}>All</button>
              <button className="pc-filter-chip" onClick={() => setSelected([])}>Clear</button>
            </div>
            <div className="pc-chips" style={{ marginBottom: 20 }}>
              {filteredPrograms.map(p => {
                const isSel = selected.includes(p.id);
                return (
                  <button key={p.id} className={`pc-chip ${isSel ? 'selected' : ''}`} onClick={() => toggleSelect(p.id)} style={isSel ? { color: p.color } : {}}>
                    <span className="pc-chip-dot" style={{ background: p.color }} />
                    <span>{p.shortName}</span>
                    <span className="pc-chip-meta">{p.duration} · {p.cost}</span>
                  </button>
                );
              })}
            </div>
            <div className="pc-chart-panel">
              <div className="pc-chart-title">Nine-Dimension Profile</div>
              <ResponsiveContainer width="100%" height={480}>
                <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                  <PolarGrid stroke="#2a313c" strokeDasharray="2 4" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fill: '#ebe3d0', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                  <PolarRadiusAxis angle={90} domain={[0,10]} tick={{ fill: '#595647', fontSize: 10, fontFamily: 'IBM Plex Mono' }} tickCount={6} stroke="#2a313c" />
                  {selected.map(id => { const p = programs.find(x => x.id === id); return (
                    <Radar key={id} name={p.shortName} dataKey={p.shortName} stroke={p.color} fill={p.color} fillOpacity={0.18} strokeWidth={2} />
                  ); })}
                  <Tooltip contentStyle={{ background: '#0f1216', border: '1px solid #e4a853', fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                    labelStyle={{ color: '#e4a853', marginBottom: 4 }} itemStyle={{ color: '#ebe3d0' }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="pc-legend">
                {selected.map(id => { const p = programs.find(x => x.id === id); return (
                  <div key={id} className="pc-legend-item" style={{ color: p.color }}>
                    <span className="pc-legend-swatch" style={{ background: p.color }} />
                    <span>{p.shortName}</span>
                  </div>
                ); })}
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
            <p className="pc-section-desc">Set importance weights from 0 to 10. The ranking below updates in real time.</p>
            <div className="pc-sliders">
              {criteria.map(c => (
                <div key={c.key} className="pc-slider-item">
                  <div className="pc-slider-label"><span className="label-text">{c.label}</span><span className="label-value">{weights[c.key]}</span></div>
                  <div className="pc-slider-desc">{c.description}</div>
                  <input type="range" min="0" max="10" value={weights[c.key]} onChange={e => setWeights({ ...weights, [c.key]: parseInt(e.target.value) })} className="pc-slider" />
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
              <button className={`pc-tab ${rankingTab === 'weighted' ? 'active' : ''}`} onClick={() => setRankingTab('weighted')}>Weighted Ranking</button>
              <button className={`pc-tab ${rankingTab === 'personal' ? 'active' : ''}`} onClick={() => setRankingTab('personal')}>Personal Ranking</button>
            </div>
            {rankingTab === 'weighted' && (
              <>
                <p className="pc-section-desc">Scores reflect your weights from section 05. Click any row to toggle it on the radar chart.</p>
                <div className="pc-ranking">
                  {rankedPrograms.map((p, i) => (
                    <div key={p.id} className={`pc-rank-row ${i < 3 ? 'top3' : ''}`} onClick={() => toggleSelect(p.id)}
                      style={selected.includes(p.id) ? { borderLeftColor: p.color, background: 'var(--surface-2)' } : {}}>
                      <div className="pc-rank-num">{String(i + 1).padStart(2, '0')}</div>
                      <div className="pc-rank-name-group">
                        <div className="pc-rank-name">{p.name}</div>
                        <div className="pc-rank-meta">{p.location} · {p.duration} · {p.cost} · {p.track}</div>
                      </div>
                      <div className="pc-rank-bar-container">
                        <div className="pc-rank-bar" style={{ width: `${(p.weightedScore / maxWeightedScore) * 100}%`, background: p.color }} />
                      </div>
                      <div className="pc-rank-score">{p.weightedScore.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {rankingTab === 'personal' && (
              <>
                <p className="pc-section-desc">Drag rows to rank programs in your own order. Saved automatically.</p>
                <div className="pc-personal-ranking">
                  {personalRanking.map((id, i) => {
                    const p = programs.find(x => x.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className={`pc-personal-row${dragState.dragging === id ? ' dragging' : ''}${dragState.over === id ? ' dragover' : ''}`}
                        style={{ borderLeftColor: p.color }} draggable
                        onDragStart={e => handleDragStart(e, id)} onDragOver={e => handleDragOver(e, id)}
                        onDrop={e => handleDrop(e, id)} onDragEnd={handleDragEnd}>
                        <div className="pc-drag-handle">⠿</div>
                        <div className="pc-rank-num" style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-dim)' }}>{String(i + 1).padStart(2, '0')}</div>
                        <div className="pc-rank-name-group">
                          <div className="pc-rank-name">{p.name}</div>
                          <div className="pc-rank-meta">{p.location} · {p.duration} · {p.cost}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pc-personal-actions">
                  <button className="pc-filter-chip" onClick={resetPersonalRanking}>Reset to Default</button>
                </div>
              </>
            )}
            <p className="pc-note">
              Total cost = approximate tuition (2025–26) plus estimated living expenses for program duration (graduating March 2027).
              Salary estimates are from verified program employment reports where available; otherwise estimated from market benchmarks.
              Admit odds are directional for this profile — not predictive. Verify all figures with each school.
            </p>
          </>
        )}
      </section>

      {/* 07 — Program Locations */}
      <section className="pc-section">
        <SectionHeader num="07" title="Program Locations" onToggle={() => toggleCollapse('07')} open={isOpen('07')} />
        {isOpen('07') && (
          <>
            <p className="pc-section-desc">
              Each dot is a program location. Hover to see the employer pipeline for that school.
            </p>
            <div className="pc-map-controls">
              <button className={`pc-layer-btn ${mapLayers.jobMarket ? 'active' : ''}`} onClick={() => toggleMapLayer('jobMarket')}>
                <span className="pc-layer-indicator" style={{ background: 'rgba(228,168,83,0.6)', border: '1px solid #e4a853' }} />
                Job Market Reach
              </button>
              <button className={`pc-layer-btn ${mapLayers.pipeline ? 'active' : ''}`} onClick={() => toggleMapLayer('pipeline')}>
                <span className="pc-layer-indicator" style={{ background: 'transparent', border: '2px dashed #ebe3d0' }} />
                Employer Pipeline
              </button>
            </div>
            <div className="pc-map-wrapper">
              <ComposableMap projection="geoAlbersUsa" width={960} height={520} style={{ width: '100%', height: 'auto', display: 'block' }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo}
                      fill="#1a1f28" stroke="#2a313c" strokeWidth={0.7}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }} />
                  ))}
                </Geographies>

                {/* Job market reach bubbles */}
                {mapLayers.jobMarket && programs.map(p => (
                  <Marker key={`jm-${p.id}`} coordinates={p.coordinates}>
                    <circle r={(p.placementRate / maxPlacementR) * 28 + 6} fill={p.color} fillOpacity={0.15} stroke={p.color} strokeWidth={1} strokeOpacity={0.4} />
                  </Marker>
                ))}

                {/* Employer pipeline bubbles */}
                {mapLayers.pipeline && programs.map(p => (
                  <Marker key={`pl-${p.id}`} coordinates={p.coordinates}>
                    <circle r={(p.pipelineScore / maxPipelineR) * 20 + 4} fill="none" stroke="#ebe3d0" strokeWidth={1.2} strokeDasharray="3 2" strokeOpacity={0.45} />
                  </Marker>
                ))}

                {/* School dots + labels */}
                {programs.map(p => (
                  <Marker key={p.id} coordinates={p.coordinates}
                    onMouseEnter={() => setHoveredSchool(p)}
                    onMouseLeave={() => setHoveredSchool(null)}>
                    <circle r={5} fill={p.color} stroke="#0f1216" strokeWidth={1.5}
                      style={{ cursor: 'pointer', filter: hoveredSchool?.id === p.id ? `drop-shadow(0 0 6px ${p.color})` : 'none', transition: 'filter .15s' }} />
                    <text textAnchor="middle" y={-10} fill="#ebe3d0" fontSize={9} fontFamily="IBM Plex Mono" style={{ pointerEvents: 'none' }}>
                      {p.shortName}
                    </text>
                  </Marker>
                ))}
              </ComposableMap>

              <div className="pc-map-hover-panel">
                {hoveredSchool ? (
                  <>
                    <div>
                      <div className="pc-map-hover-name" style={{ color: hoveredSchool.color }}>{hoveredSchool.name}</div>
                      <div className="pc-map-hover-loc">{hoveredSchool.location} · {hoveredSchool.track} · {hoveredSchool.duration}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div className="pc-card-pros-cons-col-label" style={{ marginBottom: 6 }}>Employer Pipeline</div>
                      <div className="pc-map-hover-employers">{hoveredSchool.topEmployers}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                      <span>Placement: <span style={{ color: 'var(--text-dim)' }}>{hoveredSchool.placementRate}%</span></span>
                      <span>Pipeline: <span style={{ color: 'var(--text-dim)' }}>{hoveredSchool.pipelineScore}/10</span></span>
                      <span>Est. Salary: <span style={{ color: 'var(--accent)' }}>${hoveredSchool.expectedSalary}k</span></span>
                    </div>
                  </>
                ) : (
                  <div className="pc-map-hover-hint">Hover a school to see its employer pipeline</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 24, padding: '12px 20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                  <svg width={24} height={14}><circle cx={12} cy={7} r={6} fill="rgba(228,168,83,0.2)" stroke="#e4a853" strokeWidth={1} /></svg>
                  Larger = higher grad placement rate
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                  <svg width={24} height={14}><circle cx={12} cy={7} r={5} fill="none" stroke="#ebe3d0" strokeWidth={1.2} strokeDasharray="3 2" /></svg>
                  Larger dashed ring = broader employer pipeline
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
