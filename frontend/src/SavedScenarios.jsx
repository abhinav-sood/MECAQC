import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

const C = {
  bg:            '#E8E4DC',
  surface:       '#FFFFFF',
  border:        '#D6DDD6',
  borderLight:   '#E8EDE8',
  accent:        '#2E6B4F',
  accentLight:   '#EAF2ED',
  textPrimary:   '#1A2B1E',
  textSecondary: '#4A5C4E',
  textMuted:     '#7A907E',
  badgeBg:       '#EAF2ED',
  badgeBorder:   '#9EC4B0',
  badgeText:     '#2E6B4F',
  positive:      '#2E6B4F',
  negative:      '#B54A2E',
};

const FONT = "'IBM Plex Sans', sans-serif";

function fmt$(val) {
  if (val == null) return '—';
  const abs = Math.abs(val);
  const sign = val >= 0 ? '+' : '−';
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
  return sign + '$' + abs.toFixed(0);
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const SCENARIOS = [
  { key: 'bau_netBenefit', label: 'BAU' },
  { key: 'gt_netBenefit',  label: 'GT'  },
  { key: 'rt_netBenefit',  label: 'RT'  },
  { key: 'ac_netBenefit',  label: 'AC'  },
];

export default function SavedScenarios({ onSelect }) {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const res = await fetch(`${API}/scenarios`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRows(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchScenarios();
  }, []);

  if (loading) return (
    <div style={{ marginTop: 16, padding: '14px 0', fontSize: 12, color: C.textMuted, fontFamily: FONT }}>
      Loading saved scenarios…
    </div>
  );

  if (error) return (
    <div style={{ marginTop: 16, padding: '14px 0', fontSize: 12, color: C.negative, fontFamily: FONT }}>
      Could not load saved scenarios: {error}
    </div>
  );

  if (rows.length === 0) return (
    <div style={{ marginTop: 16, padding: '14px 0', fontSize: 12, color: C.textMuted, fontFamily: FONT }}>
      No saved scenarios yet. Run a calculation and save it.
    </div>
  );

  return (
    <div style={{ marginTop: 24 }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 600, color: C.textMuted,
          textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT,
        }}>
          Saved scenarios
        </span>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>
          {rows.length} run{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: C.surface, border: '1px solid ' + C.border,
        borderRadius: 8, overflow: 'hidden',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '90px 70px 1fr 72px 72px 72px 72px',
          gap: 0,
          padding: '8px 16px',
          background: C.accentLight,
          borderBottom: '1px solid ' + C.border,
        }}>
          {['State', 'MW', 'Saved', 'BAU', 'GT', 'RT', 'AC'].map(h => (
            <span key={h} style={{
              fontSize: 10, fontWeight: 600, color: C.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: FONT,
              textAlign: h === 'State' || h === 'MW' || h === 'Saved' ? 'left' : 'right',
            }}>
              {h}
            </span>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, i) => (
          <ScenarioRow
            key={row.id ?? i}
            row={row}
            isLast={i === rows.length - 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function ScenarioRow({ row, isLast, onSelect }) {
  const [hovered, setHovered] = useState(false);

  function handleClick() {
    onSelect({
        state:            row.state,
        capacity:         row.capacity,
        heatInput:        row.heatInput,
        annualGeneration: row.annualGeneration,
        operatingHours:   row.operatingHours,
        so2Rate:          row.SO2Rate,      
        so2Mass:          row.baselineSO2,
        noxMass:          row.baselineNOx,
        pm25:             row.baselinePM25,
        voc:              row.baselineVOC,
        co2Mass:          row.baselineCO2,
    });
    }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '90px 70px 1fr 72px 72px 72px 72px',
        gap: 0,
        padding: '10px 16px',
        borderBottom: isLast ? 'none' : '1px solid ' + C.borderLight,
        background: hovered ? C.accentLight : 'transparent',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 500, color: C.textPrimary, fontFamily: FONT }}>
        {row.state ?? '—'}
      </span>
      <span style={{ fontSize: 12, color: C.textSecondary, fontFamily: FONT }}>
        {row.capacity != null ? row.capacity + ' MW' : '—'}
      </span>
      <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>
        {fmtDate(row.created_at)}
      </span>
      {SCENARIOS.map(({ key, label }) => {
        const val = row[key];
        const positive = val == null || val >= 0;
        return (
          <span key={label} style={{
            fontSize: 12, fontFamily: FONT, textAlign: 'right',
            color: val == null ? C.textMuted : positive ? C.positive : C.negative,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {fmt$(val)}
          </span>
        );
      })}
    </div>
  );
}