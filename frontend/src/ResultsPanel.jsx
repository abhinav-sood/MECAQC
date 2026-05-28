import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const SCENARIOS = [
  { key: 'bau', label: 'BAU', name: 'Business as Usual', color: '#6B7280' },
  { key: 'ac',  label: 'AC',  name: 'Add-on Scrubber',   color: '#B45309' },
  { key: 'gt',  label: 'GT',  name: 'Gas Transition',    color: '#1D6FA8' },
  { key: 'rt',  label: 'RT',  name: 'Renewable',         color: '#2E6B4F' },
];

const POLLUTANTS = [
  { key: 'SO2ChangePerYear',  label: 'SO2',   unit: 't/yr' },
  { key: 'NOxChangePerYear',  label: 'NOx',   unit: 't/yr' },
  { key: 'PM25ChangePerYear', label: 'PM2.5', unit: 't/yr' },
  { key: 'VOCChangePerYear',  label: 'VOC',   unit: 't/yr' },
  { key: 'CO2ChangePerYear',  label: 'CO2',   unit: 't/yr' },
];

const C = {
  surface:     '#FFFFFF',
  bg:          '#F4F6F4',
  border:      '#D6DDD6',
  borderLight: '#E8EDE8',
  accent:      '#2E6B4F',
  accentLight: '#EAF2ED',
  textPrimary:   '#1A2B1E',
  textSecondary: '#4A5C4E',
  textMuted:     '#7A907E',
  badgeBg:     '#EAF2ED',
  badgeBorder: '#9EC4B0',
  neg:         '#B91C1C',
  negBg:       '#FEF2F2',
};

const FONT = "'IBM Plex Sans', sans-serif";

function fmt$(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '+';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

function fmtT(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '+';
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toFixed(1)}`;
}

function BarRow({ label, value, maxAbs, color }) {
  const pct = maxAbs > 0 ? (Math.abs(value) / maxAbs) * 100 : 0;
  const isPos = value >= 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
      <span style={{ width: 40, fontSize: 11.5, color: C.textMuted, flexShrink: 0, fontFamily: 'monospace' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 5, background: C.borderLight, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct.toFixed(1)}%`,
          background: isPos ? color : C.neg,
          borderRadius: 3,
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <span style={{
        width: 72, fontSize: 12, textAlign: 'right', flexShrink: 0,
        color: isPos ? color : C.neg,
        fontFamily: 'monospace', fontWeight: 600,
      }}>
        {fmtT(value)}
      </span>
    </div>
  );
}

export default function ResultsPanel({ results, plantMeta, plantInput }) {
  const [selected, setSelected] = useState('rt');
  const [saveStatus, setSaveStatus] = useState(null);
  const scenario = results[selected];
  const scenarioDef = SCENARIOS.find(s => s.key === selected);
  const accentColor = scenarioDef?.color ?? C.accent;

  const maxRedAbs = Math.max(...POLLUTANTS.map(p => Math.abs(scenario.reductions?.[p.key] ?? 0)));

  async function handleSave() {
    try {
      const response = await fetch(API_URL + '/scenario/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_input: plantInput,
          all_scenario_result: results,
        }),
      });
      if (!response.ok) {
        setSaveStatus("error");
        return;
      }
      setSaveStatus("saved");  
      
    } catch (err) {
      setSaveStatus("error");
    }
  } 



  return (
    <div style={{
      fontFamily: FONT,
      color: C.textPrimary,
      background: C.surface,
      borderRadius: 8,
      padding: '24px',
      border: '1px solid ' + C.border,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, margin: '0 0 3px' }}>
            Scenario Analysis
          </p>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: C.textPrimary, letterSpacing: '-0.01em' }}>
            {plantMeta?.name ?? 'Results'}
          </h2>
        </div>
        {plantMeta && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[plantMeta.state, `${plantMeta.capacity} MW`].map(tag => (
              <span key={tag} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 999,
                background: C.badgeBg, border: '1px solid ' + C.badgeBorder,
                color: C.textSecondary, fontFamily: FONT,
              }}>{tag}</span>
            ))}
            <button
                  onClick={handleSave}
                  style={{
                    fontSize: 11,
                    padding: '3px 12px',
                    borderRadius: 999,
                    border: '1px solid ' + C.badgeBorder,
                    background: saveStatus === 'saved' ? C.accentLight : C.surface,
                    color: saveStatus === 'error' ? C.neg : C.accent,
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  {saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Error — retry' : 'Save'}
                </button>
          </div>
        )}
      </div>

      {/* Scenario selector cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {SCENARIOS.map(s => {
          const nb = results[s.key]?.netBenefits?.netBenefit ?? 0;
          const isSelected = selected === s.key;
          const isPos = nb >= 0;
          return (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              style={{
                background: isSelected ? C.accentLight : C.bg,
                border: isSelected ? '1.5px solid ' + s.color : '1px solid ' + C.border,
                borderRadius: 7,
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                fontFamily: FONT,
              }}
            >
              <div style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.06em', padding: '1px 6px',
                borderRadius: 3, marginBottom: 6,
                background: s.color + '18', color: s.color,
              }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 8, lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Net benefit/yr</div>
              <div style={{
                fontSize: 16, fontWeight: 700, fontFamily: 'monospace',
                color: isPos ? s.color : C.neg,
              }}>
                {fmt$(nb)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

        {/* Left: Emission reductions */}
        <div style={{ background: C.bg, borderRadius: 7, padding: '16px', border: '1px solid ' + C.borderLight }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Emission changes — {selected.toUpperCase()}
          </p>
          {selected === 'bau' ? (
            <div>
              <p style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.7, margin: '0 0 14px' }}>
                No reductions in BAU. This scenario represents continued coal operation and serves as the cost baseline.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {[
                  { label: 'Fixed O&M',     value: results.bau.netBenefits.totalAnnualCost * 0.55 },
                  { label: 'Variable O&M',  value: results.bau.netBenefits.totalAnnualCost * 0.14 },
                  { label: 'Fuel cost',     value: results.bau.netBenefits.totalAnnualCost * 0.31 },
                  { label: 'Total (TAC)',   value: scenario.netBenefits.totalAnnualCost },
                ].map(row => (
                  <div key={row.label} style={{ background: C.surface, borderRadius: 6, padding: '9px 11px', border: '1px solid ' + C.border }}>
                    <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.neg, fontFamily: 'monospace' }}>
                      {fmt$(row.value).replace('+', '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            POLLUTANTS.map(p => (
              <BarRow
                key={p.key}
                label={p.label}
                value={scenario.reductions?.[p.key] ?? 0}
                maxAbs={maxRedAbs}
                color={accentColor}
              />
            ))
          )}
        </div>

        {/* Right: Financials */}
        <div style={{ background: C.bg, borderRadius: 7, padding: '16px', border: '1px solid ' + C.borderLight }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            Financials — {selected.toUpperCase()}
          </p>

          {/* Big number */}
          <div style={{
            marginBottom: 14, padding: '12px 14px',
            background: C.surface, borderRadius: 7,
            border: '1px solid ' + accentColor + '44',
            }}>
            <div style={{ fontSize: 10.5, color: C.textMuted, marginBottom: 3 }}>Health & climate benefit / year</div>
            <div style={{
              fontSize: 26, fontWeight: 700, fontFamily: 'monospace',
              color: accentColor,
            }}>
              {fmt$(scenario.netBenefits.totalBenefit)}
            </div>
          </div>

          {/* Row breakdown */}
          {[
            { label: 'Total annual cost (TAC)',   value: scenario.netBenefits.totalAnnualCost, pos: scenario.netBenefits.totalAnnualCost <= 0 },
            { label: 'Net benefit',               value: scenario.netBenefits.netBenefit,      pos: scenario.netBenefits.netBenefit >= 0 },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0',
              borderBottom: i < 1 ? '1px solid ' + C.borderLight : 'none',
            }}>
              <span style={{ fontSize: 12, color: C.textSecondary }}>{row.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: 'monospace', color: row.pos ? accentColor : C.neg }}>
                {fmt$(row.value)}
              </span>
            </div>
          ))}

          <p style={{ marginTop: 12, fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
            All costs in 2020 USD. Wu et al. 2024, ERL.
          </p>
        </div>
      </div>
    </div>
  );
}