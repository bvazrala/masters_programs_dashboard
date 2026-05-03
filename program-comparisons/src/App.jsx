import React, { useState, useMemo, useEffect } from 'react';
import { fetchClimateData } from './api/openMeteo';
import { fetchScorecardData } from './api/collegeScorecard';
import { ComposableMap, Geographies, Geography, Line, Marker } from 'react-simple-maps';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
         ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, Cell,
         BarChart, Bar, LabelList } from 'recharts';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Top 50 US job markets — hidden by default; shown only when a school dot is clicked
const HUB_CITIES = {
  siliconValley: { coordinates: [-122.05, 37.40], label: 'Bay Area',     textDx:  12, textAnchor: 'start'  },
  nyc:           { coordinates: [-74.00,  40.71], label: 'NYC',          textDx: -12, textAnchor: 'end'    },
  chicago:       { coordinates: [-87.63,  41.88], label: 'Chicago',      textDx:   0, textAnchor: 'middle' },
  boston:        { coordinates: [-71.06,  42.36], label: 'Boston',       textDx: -12, textAnchor: 'end'    },
  la:            { coordinates: [-118.25, 34.05], label: 'LA',           textDx:  12, textAnchor: 'start'  },
  dc:            { coordinates: [-77.04,  38.91], label: 'DC',           textDx: -12, textAnchor: 'end'    },
  dallas:        { coordinates: [-96.80,  32.78], label: 'Dallas',       textDx:   0, textAnchor: 'middle' },
  houston:       { coordinates: [-95.37,  29.76], label: 'Houston',      textDx:   0, textAnchor: 'middle' },
  austin:        { coordinates: [-97.74,  30.27], label: 'Austin',       textDx:  12, textAnchor: 'start'  },
  seattle:       { coordinates: [-122.33, 47.61], label: 'Seattle',      textDx:  12, textAnchor: 'start'  },
  atlanta:       { coordinates: [-84.39,  33.75], label: 'Atlanta',      textDx:   0, textAnchor: 'middle' },
  miami:         { coordinates: [-80.19,  25.76], label: 'Miami',        textDx: -12, textAnchor: 'end'    },
  philadelphia:  { coordinates: [-75.16,  39.95], label: 'Philly',       textDx: -12, textAnchor: 'end'    },
  phoenix:       { coordinates: [-112.07, 33.45], label: 'Phoenix',      textDx:  12, textAnchor: 'start'  },
  denver:        { coordinates: [-104.99, 39.74], label: 'Denver',       textDx:  12, textAnchor: 'start'  },
  minneapolis:   { coordinates: [-93.27,  44.98], label: 'Minneapolis',  textDx:   0, textAnchor: 'middle' },
  sandiego:      { coordinates: [-117.16, 32.72], label: 'San Diego',    textDx:  12, textAnchor: 'start'  },
  portland:      { coordinates: [-122.68, 45.52], label: 'Portland',     textDx:  12, textAnchor: 'start'  },
  detroit:       { coordinates: [-83.05,  42.33], label: 'Detroit',      textDx: -12, textAnchor: 'end'    },
  charlotte:     { coordinates: [-80.84,  35.23], label: 'Charlotte',    textDx: -12, textAnchor: 'end'    },
  nashville:     { coordinates: [-86.78,  36.17], label: 'Nashville',    textDx:   0, textAnchor: 'middle' },
  tampa:         { coordinates: [-82.46,  27.95], label: 'Tampa',        textDx: -12, textAnchor: 'end'    },
  orlando:       { coordinates: [-81.38,  28.54], label: 'Orlando',      textDx: -12, textAnchor: 'end'    },
  stlouis:       { coordinates: [-90.20,  38.63], label: 'St. Louis',    textDx:   0, textAnchor: 'middle' },
  baltimore:     { coordinates: [-76.61,  39.29], label: 'Baltimore',    textDx: -12, textAnchor: 'end'    },
  pittsburgh:    { coordinates: [-79.96,  40.44], label: 'Pittsburgh',   textDx: -12, textAnchor: 'end'    },
  cleveland:     { coordinates: [-81.69,  41.50], label: 'Cleveland',    textDx: -12, textAnchor: 'end'    },
  cincinnati:    { coordinates: [-84.51,  39.10], label: 'Cincinnati',   textDx:   0, textAnchor: 'middle' },
  columbus:      { coordinates: [-82.99,  39.96], label: 'Columbus',     textDx: -12, textAnchor: 'end'    },
  indianapolis:  { coordinates: [-86.16,  39.77], label: 'Indy',         textDx:   0, textAnchor: 'middle' },
  kansascity:    { coordinates: [-94.58,  39.10], label: 'KC',           textDx:   0, textAnchor: 'middle' },
  saltlakecity:  { coordinates: [-111.89, 40.76], label: 'Salt Lake',    textDx:  12, textAnchor: 'start'  },
  sanantonio:    { coordinates: [-98.49,  29.42], label: 'San Antonio',  textDx:   0, textAnchor: 'middle' },
  sacramento:    { coordinates: [-121.47, 38.58], label: 'Sacramento',   textDx:  12, textAnchor: 'start'  },
  lasvegas:      { coordinates: [-115.14, 36.17], label: 'Las Vegas',    textDx:  12, textAnchor: 'start'  },
  raleigh:       { coordinates: [-78.64,  35.78], label: 'Raleigh',      textDx: -12, textAnchor: 'end'    },
  richmond:      { coordinates: [-77.46,  37.54], label: 'Richmond',     textDx: -12, textAnchor: 'end'    },
  louisville:    { coordinates: [-85.76,  38.25], label: 'Louisville',   textDx:   0, textAnchor: 'middle' },
  jacksonville:  { coordinates: [-81.66,  30.33], label: 'Jacksonville', textDx: -12, textAnchor: 'end'    },
  hartford:      { coordinates: [-72.68,  41.76], label: 'Hartford',     textDx: -12, textAnchor: 'end'    },
  providence:    { coordinates: [-71.41,  41.82], label: 'Providence',   textDx: -12, textAnchor: 'end'    },
  memphis:       { coordinates: [-90.05,  35.15], label: 'Memphis',      textDx:   0, textAnchor: 'middle' },
  neworleans:    { coordinates: [-90.07,  29.95], label: 'New Orleans',  textDx:   0, textAnchor: 'middle' },
  oklahomacity:  { coordinates: [-97.52,  35.47], label: 'OKC',          textDx:   0, textAnchor: 'middle' },
  birmingham:    { coordinates: [-86.80,  33.52], label: 'Birmingham',   textDx:   0, textAnchor: 'middle' },
  buffalo:       { coordinates: [-78.88,  42.89], label: 'Buffalo',      textDx: -12, textAnchor: 'end'    },
  omaha:         { coordinates: [-95.94,  41.26], label: 'Omaha',        textDx:   0, textAnchor: 'middle' },
  milwaukee:     { coordinates: [-87.91,  43.04], label: 'Milwaukee',    textDx:   0, textAnchor: 'middle' },
  tucson:        { coordinates: [-110.97, 32.25], label: 'Tucson',       textDx:  12, textAnchor: 'start'  },
};

const programs = [
  {
    id: 'calpoly', scorecardId: 110422, name: 'Cal Poly SLO MSBA', shortName: 'Cal Poly', location: 'San Luis Obispo, CA', duration: '10 mo', durationMonths: 10,
    cost: '~$46k total', totalCost: 46, overBudget: false, track: 'Business Analytics', color: '#6db83a',
    admitOdds: 'Safety', admitOddsScore: 85, expectedSalary: 95,
    coordinates: [-120.66, 35.31],
    placementRate: 88, pipelineScore: 4,
    hubs: [{ hub: 'siliconValley', strength: 3 }, { hub: 'la', strength: 2 }, { hub: 'seattle', strength: 1 }, { hub: 'denver', strength: 1 }, { hub: 'portland', strength: 1 }],
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
    applyUrl: 'https://orfalea.calpoly.edu/graduate-programs/ms-business-analytics',
    scores: { roi: 9, affordability: 10, jobMarket: 5, marketAccess: 5, weatherFit: 5, lifestyle: 7, duration: 10, capstone: 6, prestige: 4, versatility: 6 },
  },
  {
    id: 'utaustin', scorecardId: 228778, name: 'UT Austin MSBA', shortName: 'UT Austin', location: 'Austin, TX', duration: '10 mo', durationMonths: 10,
    cost: '~$80k total', totalCost: 80, overBudget: false, track: 'Business Analytics', color: '#b8923b',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 106,
    coordinates: [-97.73, 30.28],
    placementRate: 98, pipelineScore: 8,
    hubs: [{ hub: 'siliconValley', strength: 3 }, { hub: 'nyc', strength: 2 }, { hub: 'dallas', strength: 2 }, { hub: 'houston', strength: 2 }, { hub: 'chicago', strength: 1 }],
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
    scores: { roi: 8, affordability: 5, jobMarket: 8, marketAccess: 7, weatherFit: 5, lifestyle: 7, duration: 10, capstone: 7, prestige: 7, versatility: 8 },
  },
  {
    id: 'gatech', scorecardId: 139755, name: 'Georgia Tech MSA', shortName: 'GA Tech', location: 'Atlanta, GA', duration: '12 mo', durationMonths: 12,
    cost: '~$70k total', totalCost: 70, overBudget: false, track: 'Business Analytics', color: '#a0614a',
    admitOdds: 'Target', admitOddsScore: 55, expectedSalary: 109,
    coordinates: [-84.40, 33.78],
    placementRate: 87, pipelineScore: 9,
    hubs: [{ hub: 'nyc', strength: 3 }, { hub: 'dc', strength: 2 }, { hub: 'chicago', strength: 2 }, { hub: 'siliconValley', strength: 1 }, { hub: 'charlotte', strength: 1 }],
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
    applyUrl: 'https://www.analytics.gatech.edu/',
    scores: { roi: 9, affordability: 6, jobMarket: 8, marketAccess: 7, weatherFit: 5, lifestyle: 6, duration: 9, capstone: 9, prestige: 8, versatility: 9 },
  },
  {
    id: 'umd', scorecardId: 163286, name: 'UMD Smith MSBA&AI', shortName: 'UMD Smith', location: 'College Park, MD', duration: '12 mo', durationMonths: 12,
    cost: '~$75k total', totalCost: 75, overBudget: false, track: 'Business Analytics', color: '#c02020',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 95,
    coordinates: [-76.94, 38.98],
    placementRate: 87, pipelineScore: 7,
    hubs: [{ hub: 'dc', strength: 3 }, { hub: 'nyc', strength: 2 }, { hub: 'philadelphia', strength: 2 }, { hub: 'boston', strength: 1 }, { hub: 'chicago', strength: 1 }],
    topRoles: 'Data Analyst, Business Analyst, Consultant',
    topEmployers: 'Deloitte, Capital One, Booz Allen',
    pros: [
      'DC-area access to federal + consulting pipeline (Booz Allen, MITRE, Deloitte, Capital One) | Top-50 public B-school brand',
      'STEM-designated with AI-integrated curriculum; 12-month format keeps costs manageable',
      'College Park location gives simultaneous access to DC, Baltimore, and NoVA tech corridors',
    ],
    cons: [
      'Heavy international cohort skews some recruiting cohort dynamics | DC-area living costs add pressure',
      'Limited West Coast tech recruiting; best fit for DC/mid-Atlantic career targets',
      'Brand less recognized than Georgetown or GW for DC-specific consulting and government analytics',
    ],
    applyUrl: 'https://www.rhsmith.umd.edu/programs/master-science-business-analytics',
    scores: { roi: 7, affordability: 6, jobMarket: 8, marketAccess: 8, weatherFit: 6, lifestyle: 8, duration: 9, capstone: 7, prestige: 6, versatility: 8 },
  },
  {
    id: 'uwfoster', scorecardId: 236948, name: 'UW Foster MSBA', shortName: 'UW Foster', location: 'Seattle, WA', duration: '12 mo', durationMonths: 12,
    cost: '~$90k total', totalCost: 90, overBudget: false, track: 'Business Analytics', color: '#4b2e83',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 110,
    coordinates: [-122.30, 47.66],
    placementRate: 90, pipelineScore: 7,
    hubs: [{ hub: 'seattle', strength: 3 }, { hub: 'siliconValley', strength: 3 }, { hub: 'portland', strength: 1 }, { hub: 'la', strength: 1 }, { hub: 'nyc', strength: 1 }],
    topRoles: 'Data Analyst, Business Analyst, Data Scientist',
    topEmployers: 'Amazon, Microsoft, Boeing',
    pros: [
      'Seattle tech hub: Amazon, Microsoft, and Boeing recruit directly on campus within one of the densest tech-employer ecosystems nationally',
      'STEM-designated with 36-month OPT extension; evening and weekend format allows concurrent employment during the program year',
      'Small cohort (~30) enables close faculty and industry mentor relationships uncommon at larger programs',
    ],
    cons: [
      'Evening and weekend format reduces cohort bonding and limits access to on-campus recruiting events held during business hours',
      'Average cohort has ~4 years of work experience — entering directly from undergrad may limit peer comparisons and networking',
      'Smaller alumni network than comparable Foster programs limits reach and name recognition outside the Pacific Northwest',
    ],
    applyUrl: 'https://foster.uw.edu/academics/degree-programs/master-science-business-analytics/',
    scores: { roi: 7, affordability: 4, jobMarket: 8, marketAccess: 7, weatherFit: 9, lifestyle: 7, duration: 9, capstone: 7, prestige: 6, versatility: 7 },
  },
  {
    id: 'ncstatemsa', scorecardId: 199193, name: 'NC State IAA MSA', shortName: 'NC State', location: 'Raleigh, NC', duration: '10 mo', durationMonths: 10,
    cost: '~$56k total', totalCost: 56, overBudget: false, track: 'Business Analytics', color: '#cc3333',
    admitOdds: 'Reach', admitOddsScore: 40, expectedSalary: 100,
    coordinates: [-78.69, 35.79],
    placementRate: 97, pipelineScore: 8,
    hubs: [{ hub: 'raleigh', strength: 3 }, { hub: 'charlotte', strength: 2 }, { hub: 'nyc', strength: 2 }, { hub: 'dc', strength: 1 }, { hub: 'chicago', strength: 1 }],
    topRoles: 'Data Scientist, Analytics Consultant, Business Analyst',
    topEmployers: 'Bank of America, Cisco, Deloitte',
    pros: [
      'Top-ranked analytics program nationally (consistently top-3 by industry surveys); 97% placement within 6 months',
      'No GRE or recommendation letters required — streamlined application with required interview instead',
      'Industry-sponsored practicum capstone with named company partners — one of the strongest applied project structures nationally',
    ],
    cons: [
      'Required interview adds a friction step that can be a bottleneck for international applicants',
      'Starts in late June — tight gap from a UCI winter graduation with minimal buffer for transition',
      'Smaller alumni network than business-school programs limits brand recognition outside the Southeast and analytics field',
    ],
    applyUrl: 'https://analytics.ncsu.edu/',
    scores: { roi: 9, affordability: 8, jobMarket: 6, marketAccess: 4, weatherFit: 6, lifestyle: 5, duration: 10, capstone: 9, prestige: 8, versatility: 7 },
  },
  {
    id: 'uiucmsba', scorecardId: 145637, name: 'UIUC Gies MSBA', shortName: 'UIUC Gies', location: 'Champaign, IL', duration: '9–15 mo', durationMonths: 12,
    cost: '~$60k total', totalCost: 60, overBudget: false, track: 'Business Analytics', color: '#3a7a9a',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 95,
    coordinates: [-88.23, 40.10],
    placementRate: 88, pipelineScore: 7,
    hubs: [{ hub: 'chicago', strength: 3 }, { hub: 'nyc', strength: 2 }, { hub: 'siliconValley', strength: 2 }, { hub: 'dc', strength: 1 }, { hub: 'boston', strength: 1 }],
    topRoles: 'Data Analyst, Business Analyst, Consultant',
    topEmployers: 'Deloitte, Amazon, EY',
    pros: [
      'Flexible 2 or 3-semester tracks (9 or 15 months) allow customization based on internship or pace preferences',
      'STEM-designated; UIUC has a top-5 global CS and engineering brand that carries strong recognition in tech and analytics',
      'Affordable at ~$60k all-in compared to peers with similar employer brand reach',
    ],
    cons: [
      'Champaign location limits in-person recruiting and lifestyle — a small college town with no independent metro job market',
      'No GMAT/GRE requirement may reduce selectivity signal; admissibility for competitive firms may be harder to demonstrate',
      'Less prestigious than McCombs or Ross for business analytics specifically; brand is stronger in CS/engineering circles',
    ],
    applyUrl: 'https://giesbusiness.illinois.edu/academics/graduate/business-analytics',
    scores: { roi: 8, affordability: 8, jobMarket: 6, marketAccess: 5, weatherFit: 4, lifestyle: 3, duration: 9, capstone: 7, prestige: 7, versatility: 8 },
  },
  {
    id: 'stevens', scorecardId: 196176, name: 'Stevens MS BA&AI', shortName: 'Stevens', location: 'Hoboken, NJ', duration: '18 mo', durationMonths: 18,
    cost: '~$80k total', totalCost: 80, overBudget: false, track: 'Business Analytics', color: '#c86428',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 90,
    coordinates: [-74.03, 40.74],
    placementRate: 82, pipelineScore: 7,
    hubs: [{ hub: 'nyc', strength: 3 }, { hub: 'philadelphia', strength: 2 }, { hub: 'boston', strength: 1 }, { hub: 'dc', strength: 1 }, { hub: 'chicago', strength: 1 }],
    topRoles: 'Data Analyst, ML Engineer, BI Analyst',
    topEmployers: 'JPMorgan, Amazon, BlackRock',
    pros: [
      'NYC-adjacent (short Hudson commute) | STEM, AI-focused curriculum with deep learning, NLP, and GenAI tracks',
      'Hanlon Financial Systems Center pipeline connects directly to Wall Street and fintech employers',
      'GRE/GMAT optional; strong international cohort with direct NYC employer access',
    ],
    cons: [
      'Lower national brand than NYU or Columbia; employer recognition drops sharply outside the NYC metro',
      'Hoboken/NJ living adds up; 18-month format means highest opportunity cost of any program on this list',
      'Newer program — less alumni track record and placement history than established BA programs',
    ],
    applyUrl: 'https://www.stevens.edu/program/masters-in-business-analytics-and-artificial-intelligence',
    scores: { roi: 6, affordability: 5, jobMarket: 7, marketAccess: 8, weatherFit: 5, lifestyle: 7, duration: 5, capstone: 6, prestige: 5, versatility: 7 },
  },
  {
    id: 'sjsu', scorecardId: 122468, name: 'SJSU MS Applied Data Intelligence', shortName: 'SJSU', location: 'San Jose, CA', duration: '16 mo', durationMonths: 16,
    cost: '~$55k total', totalCost: 55, overBudget: false, track: 'Business Analytics', color: '#0d5c8a',
    admitOdds: 'Safety', admitOddsScore: 80, expectedSalary: 95,
    coordinates: [-121.89, 37.34],
    placementRate: 85, pipelineScore: 6,
    hubs: [{ hub: 'siliconValley', strength: 3 }, { hub: 'la', strength: 2 }, { hub: 'seattle', strength: 1 }, { hub: 'sandiego', strength: 1 }, { hub: 'denver', strength: 1 }],
    topRoles: 'Data Analyst, Data Scientist, BI Analyst',
    topEmployers: 'Apple, Google, Cisco',
    pros: [
      'Silicon Valley location with direct tech employer access — Apple, Google, Cisco, and Adobe recruit on-campus',
      'STEM-designated CSU tuition is among the lowest on this list; best value in the Bay Area by a wide margin',
      'GRE/GMAT optional; newer curriculum with ML and AI integration',
    ],
    cons: [
      'Bay Area living costs eat most of the tuition savings; total all-in is still ~$55k',
      'Limited national brand outside Silicon Valley; placement history is newer and less documented',
      'CSU brand is significantly weaker than UC or private programs for non-tech employer recruiting',
    ],
    applyUrl: 'https://www.sjsu.edu/lucasgsb/prospective-students/msadi/',
    scores: { roi: 8, affordability: 8, jobMarket: 8, marketAccess: 8, weatherFit: 6, lifestyle: 6, duration: 6, capstone: 5, prestige: 4, versatility: 7 },
  },
  {
    id: 'uf', scorecardId: 134130, name: 'UF Warrington MSBA', shortName: 'UF Warrington', location: 'Gainesville, FL', duration: '10 mo', durationMonths: 10,
    cost: '~$48k total', totalCost: 48, overBudget: false, track: 'Business Analytics', color: '#f47a20',
    admitOdds: 'Target', admitOddsScore: 60, expectedSalary: 85,
    coordinates: [-82.34, 29.65],
    placementRate: 85, pipelineScore: 6,
    hubs: [{ hub: 'miami', strength: 3 }, { hub: 'tampa', strength: 2 }, { hub: 'atlanta', strength: 2 }, { hub: 'dc', strength: 1 }, { hub: 'nyc', strength: 1 }],
    topRoles: 'Business Analyst, Data Analyst, Consultant',
    topEmployers: 'Deloitte, EY, Citi',
    pros: [
      'Top public B-school brand at low cost (~$48k all-in) | 10-month format; fastest possible workforce entry',
      'Gainesville extremely affordable; no FL state income tax for post-grad work in Florida markets',
      'GRE/GMAT waiver possible for STEM GPA ≥ 3.5; strong SE regional employer recruiting',
    ],
    cons: [
      'GRE/GMAT typically required (waiver not guaranteed) | Gainesville college-town isolation limits in-program networking',
      'Southeast regional focus; limited national brand for West Coast or NYC finance recruiting',
      'Hot, humid FL climate; less lifestyle appeal than coastal or urban programs',
    ],
    applyUrl: 'https://warrington.ufl.edu/master-of-science-in-business-analytics/',
    scores: { roi: 8, affordability: 9, jobMarket: 4, marketAccess: 4, weatherFit: 4, lifestyle: 5, duration: 10, capstone: 6, prestige: 6, versatility: 5 },
  },
  {
    id: 'pittkatz', scorecardId: 215293, name: 'Pitt Katz MSFBA', shortName: 'Pitt Katz', location: 'Pittsburgh, PA', duration: '12–17 mo', durationMonths: 14,
    cost: '~$70k total', totalCost: 70, overBudget: false, track: 'Business Analytics', color: '#1a4a8a',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 85,
    coordinates: [-79.96, 40.44],
    placementRate: 83, pipelineScore: 5,
    hubs: [{ hub: 'pittsburgh', strength: 3 }, { hub: 'nyc', strength: 2 }, { hub: 'chicago', strength: 2 }, { hub: 'dc', strength: 1 }, { hub: 'philadelphia', strength: 1 }],
    topRoles: 'Financial Analyst, Data Analyst, Risk Analyst',
    topEmployers: 'PNC, BNY Mellon, Highmark',
    pros: [
      'STEM, CFA Partner School with 70% CFA exam curriculum coverage — rare finance + analytics combination',
      'Pittsburgh low cost of living keeps the 70k all-in cost manageable; GRE/GMAT optional',
      'PNC, BNY Mellon, and Highmark recruit directly on campus with strong regional finance pipeline',
    ],
    cons: [
      'Regional brand strength; significantly weaker national recognition outside the Northeast and Midwest',
      'Pittsburgh is the cloudiest major US city (~42% sunshine) — significant lifestyle/weather drawback',
      'Heavier finance focus than pure analytics; limited West Coast tech and consulting recruiting',
    ],
    applyUrl: 'https://business.pitt.edu/katz-admissions/start-your-applications/',
    scores: { roi: 6, affordability: 6, jobMarket: 5, marketAccess: 5, weatherFit: 4, lifestyle: 5, duration: 8, capstone: 6, prestige: 5, versatility: 7 },
  },
  {
    id: 'baruch', scorecardId: 190512, name: 'Baruch Zicklin MSBA', shortName: 'Baruch MSBA', location: 'New York, NY', duration: '18 mo', durationMonths: 18,
    cost: '~$45k total', totalCost: 45, overBudget: false, track: 'Business Analytics', color: '#2a6040',
    admitOdds: 'Target', admitOddsScore: 65, expectedSalary: 85,
    coordinates: [-73.98, 40.74],
    placementRate: 85, pipelineScore: 7,
    hubs: [{ hub: 'nyc', strength: 3 }, { hub: 'boston', strength: 2 }, { hub: 'philadelphia', strength: 2 }, { hub: 'chicago', strength: 1 }, { hub: 'dc', strength: 1 }],
    topRoles: 'Business Analyst, Data Analyst, Financial Analyst',
    topEmployers: 'JPMorgan, Citi, Deloitte',
    pros: [
      'Best NYC value on this list: ~$30–40k tuition for Manhattan access to JPMorgan, Citi, Deloitte, and Wall Street employers',
      'Manhattan location provides direct recruiting access to finance and tech firms without paying Stevens, NYU, or Fordham premiums',
      'STEM-designated with 36-month OPT extension; Zicklin School has strong ties to the NYC financial industry',
    ],
    cons: [
      'Less prestigious brand nationally than NYU or Fordham — employer recognition is strong in NYC but limited outside the region',
      'Smaller alumni network outside NYC limits career flexibility if postgrad location preferences change',
      '18-month program is the longest format on this list — highest opportunity cost and latest possible workforce entry',
    ],
    applyUrl: 'https://zicklin.baruch.cuny.edu/academic-programs/graduate/ms-programs/business-analytics/',
    scores: { roi: 9, affordability: 10, jobMarket: 10, marketAccess: 10, weatherFit: 5, lifestyle: 10, duration: 5, capstone: 6, prestige: 5, versatility: 7 },
  },
];

const criteria = [
  { key: 'roi',           label: 'ROI',            description: 'Expected salary outcome relative to program cost' },
  { key: 'affordability', label: 'Affordability',  description: 'Absolute program cost (cheaper = higher)' },
  { key: 'jobMarket',     label: 'Job Market',     description: 'Local employer depth for target roles' },
  { key: 'marketAccess',  label: 'Market Access',  description: 'Geographic proximity to major hiring hubs (SF, NYC, LA, DC, Boston, Chicago)' },
  { key: 'weatherFit',    label: 'Weather Fit',    description: 'Match to preferred climate: overcast midday, visible sun at dawn/dusk, cool temps — not relentlessly sunny, not freezing' },
  { key: 'lifestyle',     label: 'Lifestyle',      description: 'Sightseeing, hiking/outdoors, food, architecture, public transit, novelty — penalizes traffic, unsafe areas, nightlife-only cities' },
  { key: 'duration',      label: 'Duration',       description: 'Program length (shorter = higher)' },
  { key: 'capstone',      label: 'Capstone',       description: 'Quality of applied project / industry partnership' },
  { key: 'prestige',      label: 'Prestige',       description: 'Brand strength with employers' },
  { key: 'versatility',   label: 'Versatility',    description: 'Breadth of career paths program opens' },
];

const TIER_COLORS = { Reach: '#c96e5c', Target: '#e4a853', Safety: '#5e8a85' };

const SCATTER_LABEL_OFFSETS = {
  baruch:     { dx: -20, dy: -22, anchor: 'end'    },
  calpoly:    { dx:   0, dy: -26, anchor: 'middle' },
  ncstatemsa: { dx: -20, dy: -22, anchor: 'end'    },
  uiucmsba:   { dx:  20, dy:  22, anchor: 'start'  },
  gatech:     { dx:  20, dy: -22, anchor: 'start'  },
  utaustin:   { dx: -20, dy: -22, anchor: 'end'    },
  uwfoster:   { dx:  28, dy:   0, anchor: 'start'  },
  umd:        { dx: -28, dy:   0, anchor: 'end'    },
  stevens:    { dx:  20, dy:  22, anchor: 'start'  },
  sjsu:       { dx:   0, dy:  26, anchor: 'middle' },
  uf:         { dx:  20, dy: -22, anchor: 'start'  },
  pittkatz:   { dx: -20, dy:  26, anchor: 'end'    },
};

const MAP_DOT_OFFSETS = {
  baruch:   [-0.5,  -0.20],
  stevens:  [ 0.45,  0.15],
};

const MAP_SHORT_LABELS = {
  baruch:     'Baruch',
  uiucmsba:   'UIUC',
  uwfoster:   'UW Foster',
  ncstatemsa: 'NC State',
  stevens:    'Stevens',
  sjsu:       'SJSU',
  uf:         'UF',
  pittkatz:   'Pitt Katz',
  umd:        'UMD Smith',
};

const MAP_LABEL_OFFSETS = {
  baruch:     { dx: -9, dy: -11, anchor: 'end'    },
  stevens:    { dx:  9, dy: -11, anchor: 'start'  },
  umd:        { dx:  0, dy:  16, anchor: 'middle' },
  gatech:     { dx:  0, dy:  16, anchor: 'middle' },
};

const getMapCoords = p => {
  const off = MAP_DOT_OFFSETS[p.id];
  return off ? [p.coordinates[0] + off[0], p.coordinates[1] + off[1]] : p.coordinates;
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
  const { dx, dy, anchor } = SCATTER_LABEL_OFFSETS[payload.id] || { dx: 0, dy: -26, anchor: 'middle' };
  const lx = cx + dx;
  const ly = cy + dy;
  const charW = 5.8;
  const txtW = payload.name.length * charW + 8;
  const rectX = anchor === 'middle' ? lx - txtW / 2 : anchor === 'start' ? lx - 4 : lx - txtW + 4;
  return (
    <g>
      <line x1={cx} y1={cy} x2={lx} y2={ly} stroke={payload.color} strokeWidth={0.8} strokeOpacity={0.45} />
      <rect x={rectX} y={ly - 10} width={txtW} height={13} fill="#0d1117" fillOpacity={0.9} rx={2} />
      <circle cx={cx} cy={cy} r={radius} fill={payload.color} fillOpacity={0.75} stroke={payload.color} strokeWidth={1} />
      <text x={lx} y={ly} fill="#ebe3d0" fontSize={10} fontFamily="IBM Plex Mono" textAnchor={anchor}>
        {payload.name}
      </text>
    </g>
  );
}

function BubbleDot({ cx, cy, r, payload }) {
  if (!cx || !cy || !payload) return null;
  const radius = Math.max(r || 10, 8);
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill={payload.color} fillOpacity={0.65} stroke={payload.color} strokeWidth={1.5} />
      <text x={cx} y={cy + radius + 13} fill="#ebe3d0" fontSize={9} fontFamily="IBM Plex Mono" textAnchor="middle">
        {payload.shortName}
      </text>
    </g>
  );
}

function CustomBubbleTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#0f1216', border: `1px solid ${d.color}`, padding: '10px 14px', fontFamily: 'IBM Plex Mono', fontSize: 12 }}>
      <div style={{ color: d.color, fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: '#ebe3d0' }}>Composite: <strong>{d.composite.toFixed(2)}</strong></div>
      <div style={{ color: '#8f8876', marginTop: 4 }}>Criteria: {d.weightedScore.toFixed(2)} · Personal rank #{d.personalPos + 1}</div>
      <div style={{ color: '#8f8876' }}>Market access: {d.marketAccess}/10</div>
    </div>
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
  const [selected, setSelected]           = useState(['umd', 'uwfoster', 'utaustin']);
  const [weights, setWeights]             = useState({ roi: 9, affordability: 7, jobMarket: 10, marketAccess: 9, weatherFit: 4, lifestyle: 6, duration: 5, capstone: 9, prestige: 9, versatility: 8 });
  const [collapsed, setCollapsed]         = useState({ '01': true, '02': true, '03': true, '04': true, '05': true, '06': true, '07': true });
  const [rankingTab, setRankingTab]       = useState('weighted');
  const [detailsModal, setDetailsModal]       = useState(null);
  const [mapLayers, setMapLayers]             = useState({ jobMarket: true });
  const [selectedMapSchool, setSelectedMapSchool] = useState(null);
  const [personalRanking, setPersonalRanking] = useState(programs.map(p => p.id));
  const [dragState, setDragState] = useState({ dragging: null, over: null });
  const [liveData, setLiveData]   = useState({});
  const [liveLoading, setLiveLoading] = useState(true);

  // Modal: ESC to close + prevent body scroll
  useEffect(() => {
    if (!detailsModal) return;
    const handleKey = (e) => { if (e.key === 'Escape') setDetailsModal(null); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [detailsModal]);

  // Fetch live climate (Open-Meteo) + earnings (College Scorecard) data on mount
  useEffect(() => {
    const weatherFetches = programs.map(async p => {
      try {
        const data = await fetchClimateData(p.coordinates[1], p.coordinates[0]);
        return [p.id, { weather: data }];
      } catch {
        return [p.id, {}];
      }
    });

    const apiKey = import.meta.env.VITE_COLLEGE_SCORECARD_KEY;
    const hasKey = apiKey && apiKey !== 'YOUR_KEY_HERE';
    const idMap = Object.fromEntries(
      programs.filter(p => p.scorecardId).map(p => [p.id, p.scorecardId])
    );
    const scorecardFetch = hasKey
      ? fetchScorecardData(idMap, apiKey).catch(() => ({}))
      : Promise.resolve({});

    Promise.all([Promise.all(weatherFetches), scorecardFetch]).then(([weatherEntries, scorecard]) => {
      setLiveData(prev => {
        const next = { ...prev };
        for (const [id, data] of weatherEntries) next[id] = { ...next[id], ...data };
        for (const [id, data] of Object.entries(scorecard)) next[id] = { ...next[id], scorecard: data };
        return next;
      });
      setLiveLoading(false);
    });
  }, []);

  const toggleCollapse = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  const isOpen         = (key) => !collapsed[key];

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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
    setDragState({ dragging: null, over: null });
  };
  const handleDragEnd = () => setDragState({ dragging: null, over: null });
  const resetPersonalRanking = () => { setPersonalRanking(programs.map(p => p.id)); };

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

  const combinedRanked = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((s, w) => s + w, 0) || 1;
    const n = programs.length;
    return [...programs]
      .map(p => {
        const weightedScore = criteria.reduce((sum, c) => sum + p.scores[c.key] * weights[c.key], 0) / totalWeight;
        const personalPos = personalRanking.indexOf(p.id);
        const personalRankScore = personalPos >= 0 ? (n - 1 - personalPos) / (n - 1) * 10 : 5;
        const composite = weightedScore * 0.6 + personalRankScore * 0.4;
        return { ...p, weightedScore, personalRankScore, composite, personalPos };
      })
      .sort((a, b) => b.composite - a.composite);
  }, [weights, personalRanking]);

  const filteredPrograms = programs;
  const maxWeightedScore = rankedPrograms[0]?.weightedScore || 10;
  const maxPlacementR = Math.max(...programs.map(p => p.placementRate));

  const selectedProgram = selectedMapSchool ? programs.find(p => p.id === selectedMapSchool) : null;

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
          width: 100%; box-sizing: border-box; font-size: 14px; line-height: 1.5;
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
        .pc-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .pc-card { background: var(--surface); border: 1px solid var(--border); border-top: 3px solid var(--border); transition: border-top-color .15s; display: flex; flex-direction: column; min-height: 350px; }
        .pc-card-body { padding: 20px; cursor: pointer; flex: 1; }
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

        /* Details button */
        .pc-card-details-btn { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; border-top: 1px solid var(--border); cursor: pointer; background: transparent; width: 100%; text-align: left; font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); transition: background .15s, color .15s; border-bottom: none; border-left: none; border-right: none; }
        .pc-card-details-btn:hover { background: var(--surface-2); color: var(--accent); }

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
        .pc-map-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); overflow: hidden; }
        .pc-map-hover-panel { padding: 14px 20px; border-top: 1px solid var(--border); min-height: 72px; display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .pc-map-hover-name { font-family: var(--serif); font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
        .pc-map-hover-loc { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); }
        .pc-map-hover-employers { font-size: 12px; color: var(--text-dim); margin-top: 6px; line-height: 1.5; }
        .pc-map-hover-hint { font-family: var(--mono); font-size: 11px; color: var(--text-faint); letter-spacing: .08em; text-transform: uppercase; align-self: center; }

        /* Modal */
        .pc-modal-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.75); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .pc-modal { background: var(--surface); border: 1px solid var(--border); max-width: 720px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
        .pc-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 28px 28px 20px; border-bottom: 1px solid var(--border); gap: 16px; }
        .pc-modal-title { font-family: var(--serif); font-size: 22px; font-weight: 600; letter-spacing: -.02em; margin: 0 0 6px; }
        .pc-modal-meta { font-family: var(--mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-faint); line-height: 1.6; }
        .pc-modal-close { width: 36px; height: 36px; border: 1px solid var(--border); background: transparent; color: var(--text-dim); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .15s; }
        .pc-modal-close:hover { background: var(--reach); color: var(--text); border-color: var(--reach); }
        .pc-modal-body { padding: 24px 28px 28px; }
        .pc-pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .pc-pros-cons-col-label { font-family: var(--mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; }
        .pc-bullet { display: flex; gap: 10px; font-size: 13px; color: var(--text-dim); line-height: 1.55; margin-bottom: 10px; }
        .pc-bullet-icon { flex-shrink: 0; font-size: 12px; margin-top: 2px; }
        .pc-bullet-icon.pro { color: var(--safety); }
        .pc-bullet-icon.con { color: var(--reach); }
        .pc-apply-link { display: inline-flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); text-decoration: none; border: 1px solid var(--accent); padding: 8px 16px; transition: all .15s; }
        .pc-apply-link:hover { background: var(--accent); color: var(--bg); }

        /* Misc */
        .pc-note { font-size: 12px; color: var(--text-faint); font-style: italic; margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px; line-height: 1.6; }

        @media (max-width: 1300px) {
          .pc-cards { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 800px) {
          .pc-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .pc-root { padding: 20px 12px 48px; }
          .pc-sliders { grid-template-columns: 1fr; }
          .pc-cards { grid-template-columns: 1fr; }
          .pc-pros-cons { grid-template-columns: 1fr; }
          .pc-rank-row { grid-template-columns: 36px 1fr 52px; gap: 10px; padding: 12px; }
          .pc-rank-bar-container { display: none; }
          .pc-chip-meta { display: none; }
          .pc-modal { max-height: 95vh; }
          .pc-modal-header, .pc-modal-body { padding-left: 18px; padding-right: 18px; }
        }
      `}</style>

      {/* Header */}
      <header className="pc-header">
        <div className="pc-kicker">Personalized Decision Tool · {programs.length} Programs</div>
        <h1 className="pc-title">Graduate Program <em>Comparison</em></h1>
        <p className="pc-subtitle">
          Twelve master's programs scored across ten dimensions. Radar overlays, cost-versus-outcome
          analysis, admit-odds estimates, weighted rankings, and an interactive program location map.
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
            <p className="pc-section-desc">Each program at a glance. Click any card to toggle it on the radar chart. Use Details to view pros, cons, and the application link.</p>
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
                return (
                  <div key={p.id} className="pc-card" style={{ borderTopColor: p.color, background: isSelected ? 'var(--surface-2)' : 'var(--surface)' }}>
                    <div className="pc-card-body" onClick={() => toggleSelect(p.id)}>
                      <div className="pc-card-header">
                        <div>
                          <h3 className="pc-card-title">{p.name}</h3>
                          <div className="pc-card-loc">{p.location}</div>
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
                    <button className="pc-card-details-btn" onClick={e => { e.stopPropagation(); setDetailsModal(p); }}>
                      <span>Details</span>
                      <span style={{ fontSize: 14 }}>↗</span>
                    </button>
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
                  <XAxis type="number" dataKey="x" name="Cost" unit="k" domain={[36, 100]} ticks={[40, 50, 60, 70, 80, 90]}
                    tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c"
                    label={{ value: 'Total Cost ($k)', position: 'insideBottom', offset: -14, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                  <YAxis type="number" dataKey="y" name="Salary" unit="k" domain={[78, 120]} ticks={[80, 85, 90, 95, 100, 105, 110]}
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
              <button className={`pc-tab ${rankingTab === 'combined' ? 'active' : ''}`} onClick={() => setRankingTab('combined')}>Combined</button>
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
                        <div className="pc-rank-meta">{p.location} · {p.duration} · {p.cost}</div>
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
            {rankingTab === 'combined' && (() => {
              const bubbleData = combinedRanked.map(p => ({
                x: p.weightedScore, y: p.personalRankScore, z: p.scores.marketAccess,
                id: p.id, shortName: p.shortName, name: p.name, color: p.color,
                composite: p.composite, personalPos: p.personalPos,
                weightedScore: p.weightedScore, marketAccess: p.scores.marketAccess,
              }));
              const maxComposite = combinedRanked[0]?.composite || 10;
              return (
                <>
                  <p className="pc-section-desc">
                    Composite = 60% criteria-weighted score + 40% personal ranking. Bubble size = market access score.
                    Top-right = strong on both dimensions.
                  </p>
                  <div className="pc-chart-panel" style={{ marginBottom: 20 }}>
                    <div className="pc-chart-title">Composite Score · Criteria vs. Personal Preference</div>
                    <ResponsiveContainer width="100%" height={420}>
                      <ScatterChart margin={{ top: 30, right: 60, bottom: 60, left: 70 }}>
                        <CartesianGrid stroke="#2a313c" strokeDasharray="2 4" />
                        <XAxis type="number" dataKey="x" name="Criteria Score" domain={[4, 9]} ticks={[4, 5, 6, 7, 8, 9]}
                          tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c"
                          label={{ value: 'Criteria-Weighted Score', position: 'insideBottom', offset: -14, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                        <YAxis type="number" dataKey="y" name="Personal Rank Score" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]}
                          tick={{ fill: '#8f8876', fontSize: 11, fontFamily: 'IBM Plex Mono' }} stroke="#2a313c"
                          label={{ value: 'Personal Rank Score', angle: -90, position: 'insideLeft', offset: 10, fill: '#8f8876', fontSize: 12, fontFamily: 'IBM Plex Sans' }} />
                        <ZAxis type="number" dataKey="z" range={[80, 500]} />
                        <Tooltip content={CustomBubbleTooltip} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={bubbleData} shape={BubbleDot} />
                      </ScatterChart>
                    </ResponsiveContainer>
                    <p className="pc-chart-subtitle">Bubble size encodes market access score. Programs top-right have both high criteria scores and high personal ranking.</p>
                  </div>
                  <div className="pc-ranking">
                    {combinedRanked.map((p, i) => (
                      <div key={p.id} className={`pc-rank-row ${i < 3 ? 'top3' : ''}`}
                        style={{ alignItems: 'start', ...(selected.includes(p.id) ? { borderLeftColor: p.color, background: 'var(--surface-2)' } : {}) }}
                        onClick={() => toggleSelect(p.id)}>
                        <div className="pc-rank-num" style={{ paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</div>
                        <div className="pc-rank-name-group">
                          <div className="pc-rank-name">{p.name}</div>
                          <div className="pc-rank-meta">{p.location} · {p.duration} · {p.cost}</div>
                          <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                            {p.hubs.map(h => {
                              const hub = HUB_CITIES[h.hub];
                              return (
                                <span key={h.hub} style={{
                                  fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase',
                                  color: p.color, border: `1px solid ${p.color}`, padding: '2px 7px',
                                  opacity: h.strength === 3 ? 1 : h.strength === 2 ? 0.65 : 0.4,
                                }}>
                                  {hub?.label || h.hub}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="pc-rank-bar-container" style={{ marginTop: 6 }}>
                          <div className="pc-rank-bar" style={{ width: `${(p.composite / maxComposite) * 100}%`, background: p.color }} />
                        </div>
                        <div className="pc-rank-score" style={{ paddingTop: 2 }}>{p.composite.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
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
              School dots on the map. Job Market Reach shows placement-rate bubbles. Click a school dot to reveal arcs to its top 5 hiring hubs — tracked across the 50 largest US job markets.
            </p>
            <div className="pc-map-controls">
              <button className={`pc-layer-btn ${mapLayers.jobMarket ? 'active' : ''}`} onClick={() => toggleMapLayer('jobMarket')}>
                <span className="pc-layer-indicator" style={{ background: 'rgba(228,168,83,0.6)', border: '1px solid #e4a853' }} />
                Placement Reach
              </button>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '.08em', textTransform: 'uppercase', alignSelf: 'center' }}>
                Click a school dot to see hiring hub arcs
              </span>
            </div>
            <div className="pc-map-wrapper" onClick={() => setSelectedMapSchool(null)}>
              <ComposableMap projection="geoAlbersUsa" width={960} height={520}
                style={{ width: '100%', height: 'auto', display: 'block' }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo}
                      fill="#1a1f28" stroke="#2a313c" strokeWidth={0.7}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }} />
                  ))}
                </Geographies>

                {/* Job market reach bubbles */}
                {mapLayers.jobMarket && programs.map(p => (
                  <Marker key={`jm-${p.id}`} coordinates={getMapCoords(p)}>
                    <circle r={(p.placementRate / maxPlacementR) * 28 + 6} fill={p.color} fillOpacity={0.13} stroke={p.color} strokeWidth={1} strokeOpacity={0.35} style={{ pointerEvents: 'none' }} />
                  </Marker>
                ))}

                {/* Arcs: only for the selected school */}
                {selectedProgram && selectedProgram.hubs.map(h => {
                  const hub = HUB_CITIES[h.hub];
                  if (!hub) return null;
                  const sw = h.strength === 3 ? 2.4 : h.strength === 2 ? 1.6 : 1.0;
                  const so = h.strength === 3 ? 0.85 : h.strength === 2 ? 0.6 : 0.38;
                  return (
                    <Line key={`arc-${h.hub}`}
                      from={getMapCoords(selectedProgram)} to={hub.coordinates}
                      stroke={selectedProgram.color} strokeWidth={sw} strokeOpacity={so}
                      strokeLinecap="round" fill="transparent" style={{ pointerEvents: 'none' }} />
                  );
                })}

                {/* Hub city labels — only for selected school's connected hubs */}
                {selectedProgram && selectedProgram.hubs.map(h => {
                  const hub = HUB_CITIES[h.hub];
                  if (!hub) return null;
                  const lw = hub.label.length * 7.2 + 16;
                  const rectX = hub.textAnchor === 'start' ? hub.textDx - 5
                              : hub.textAnchor === 'end'   ? hub.textDx - lw + 5
                              : hub.textDx - lw / 2;
                  return (
                    <Marker key={`hub-label-${h.hub}`} coordinates={hub.coordinates}>
                      <circle r={6} fill="#0f1216" stroke={selectedProgram.color} strokeWidth={2} style={{ pointerEvents: 'none' }} />
                      <rect x={rectX} y={-28} width={lw} height={17} fill="#171b22" fillOpacity={0.96} stroke={selectedProgram.color} strokeWidth={0.5} rx={2} style={{ pointerEvents: 'none' }} />
                      <text x={hub.textDx} textAnchor={hub.textAnchor} y={-14}
                        fill={selectedProgram.color} fontSize={11} fontFamily="IBM Plex Mono" fontWeight="500"
                        style={{ pointerEvents: 'none' }}>
                        {hub.label}
                      </text>
                    </Marker>
                  );
                })}

                {/* School dots + labels */}
                {programs.map(p => {
                  const isSelected = selectedMapSchool === p.id;
                  const { dx = 0, dy = -11, anchor = 'middle' } = MAP_LABEL_OFFSETS[p.id] || {};
                  const label = MAP_SHORT_LABELS[p.id] || p.shortName;
                  const lblW = label.length * 5.6 + 6;
                  const rectX = anchor === 'middle' ? dx - lblW / 2 : anchor === 'start' ? dx - 2 : dx - lblW + 2;
                  return (
                    <Marker key={p.id} coordinates={getMapCoords(p)}
                      onClick={e => { e.stopPropagation(); setSelectedMapSchool(prev => prev === p.id ? null : p.id); }}>
                      {isSelected && <circle r={10} fill="none" stroke={p.color} strokeWidth={1.5} strokeOpacity={0.5} style={{ pointerEvents: 'none' }} />}
                      <rect x={rectX} y={dy - 9} width={lblW} height={11} fill="#0d1117" fillOpacity={0.8} rx={2} style={{ pointerEvents: 'none' }} />
                      <circle r={5} fill={p.color} stroke="#0f1216" strokeWidth={1.5}
                        style={{ cursor: 'pointer', filter: isSelected ? `drop-shadow(0 0 5px ${p.color})` : 'none' }} />
                      <text x={dx} textAnchor={anchor} y={dy} fill={isSelected ? p.color : '#ebe3d0'} fontSize={isSelected ? 10 : 9}
                        fontFamily="IBM Plex Mono" fontWeight={isSelected ? '500' : '400'}
                        style={{ pointerEvents: 'none' }}>
                        {label}
                      </text>
                    </Marker>
                  );
                })}
              </ComposableMap>

              <div className="pc-map-hover-panel">
                {selectedProgram ? (
                  <>
                    <div>
                      <div className="pc-map-hover-name" style={{ color: selectedProgram.color }}>{selectedProgram.name}</div>
                      <div className="pc-map-hover-loc">{selectedProgram.location} · {selectedProgram.duration} · ${selectedProgram.totalCost}k</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 8 }}>Top Hiring Hubs</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                        {selectedProgram.hubs.map(h => {
                          const hub = HUB_CITIES[h.hub];
                          const label = hub?.label || h.hub;
                          return (
                            <span key={h.hub} style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: selectedProgram.color, border: `1px solid ${selectedProgram.color}`, padding: '3px 9px', opacity: h.strength === 3 ? 1 : h.strength === 2 ? 0.7 : 0.45, whiteSpace: 'nowrap' }}>
                              {label}
                            </span>
                          );
                        })}
                      </div>
                      <div className="pc-map-hover-employers">{selectedProgram.topEmployers}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                      <span>Placement: <span style={{ color: 'var(--text-dim)' }}>{selectedProgram.placementRate}%</span></span>
                      <span>Salary: <span style={{ color: 'var(--accent)' }}>${selectedProgram.expectedSalary}k</span></span>
                      <button style={{ marginTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-faint)', padding: '4px 8px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setSelectedMapSchool(null); }}>✕ Clear</button>
                    </div>
                  </>
                ) : (
                  <div className="pc-map-hover-hint">Click a school dot to see where its graduates work</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 24, padding: '12px 20px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                  <svg width={24} height={14}><circle cx={12} cy={7} r={6} fill="rgba(228,168,83,0.15)" stroke="#e4a853" strokeWidth={1} /></svg>
                  Bubble size = grad placement rate
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-faint)' }}>
                  <svg width={32} height={14}><line x1={2} y1={7} x2={30} y2={7} stroke="#ebe3d0" strokeWidth={2} /></svg>
                  Arc thickness = pipeline strength
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Details modal */}
      {detailsModal && (
        <div className="pc-modal-backdrop" onClick={() => setDetailsModal(null)}>
          <div className="pc-modal" style={{ borderTop: `3px solid ${detailsModal.color}` }} onClick={e => e.stopPropagation()}>
            <div className="pc-modal-header">
              <div>
                <div className="pc-modal-title" style={{ color: detailsModal.color }}>{detailsModal.name}</div>
                <div className="pc-modal-meta">
                  {detailsModal.location} · {detailsModal.duration} · ${detailsModal.totalCost}k total · Est. ${detailsModal.expectedSalary}k salary
                </div>
              </div>
              <button className="pc-modal-close" onClick={() => setDetailsModal(null)}>✕</button>
            </div>
            <div className="pc-modal-body">
              <div className="pc-pros-cons">
                <div>
                  <div className="pc-pros-cons-col-label">Pros</div>
                  {detailsModal.pros.map((pt, i) => (
                    <div key={i} className="pc-bullet">
                      <span className="pc-bullet-icon pro">✓</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="pc-pros-cons-col-label">Cons</div>
                  {detailsModal.cons.map((ct, i) => (
                    <div key={i} className="pc-bullet">
                      <span className="pc-bullet-icon con">✗</span>
                      <span>{ct}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href={detailsModal.applyUrl} target="_blank" rel="noopener noreferrer" className="pc-apply-link">
                Apply / Learn More →
              </a>

              {/* Live API data panel */}
              {liveLoading && !liveData[detailsModal.id]?.weather && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '.08em' }}>
                  Fetching live data…
                </div>
              )}
              {!liveLoading && (liveData[detailsModal.id]?.weather || liveData[detailsModal.id]?.scorecard) && (() => {
                const ld = liveData[detailsModal.id];
                return (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>Live API Data</div>
                    <div style={{ display: 'grid', gridTemplateColumns: ld.scorecard ? '1fr 1fr' : '1fr', gap: 20 }}>

                      {ld.weather && (
                        <div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>Open-Meteo · 2024</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span style={{ color: 'var(--text-dim)' }}>Annual sunshine</span>
                              <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{ld.weather.annualSunHrs.toLocaleString()} hrs</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span style={{ color: 'var(--text-dim)' }}>Avg temperature</span>
                              <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>
                                {ld.weather.avgTempC}°C · {Math.round(ld.weather.avgTempC * 9 / 5 + 32)}°F
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span style={{ color: 'var(--text-dim)' }}>Climate score</span>
                              <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600 }}>{ld.weather.weatherFit} / 10</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {ld.scorecard && (
                        <div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>College Scorecard</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {ld.scorecard.earnings6yr && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ color: 'var(--text-dim)' }}>6yr median earnings</span>
                                <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>${ld.scorecard.earnings6yr.toLocaleString()}</span>
                              </div>
                            )}
                            {ld.scorecard.tuitionOOS && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                <span style={{ color: 'var(--text-dim)' }}>OOS tuition / yr</span>
                                <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>${ld.scorecard.tuitionOOS.toLocaleString()}</span>
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontStyle: 'italic', marginTop: 2 }}>
                              Institution-wide · not program-specific
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
