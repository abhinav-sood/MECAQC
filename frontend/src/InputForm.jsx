import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const FIELDS = [
  { name: 'state',            label: 'State',              hint: 'Two-letter code',       placeholder: 'e.g. AL',      half: true,  type: 'string' },
  { name: 'capacity',         label: 'Nameplate capacity', hint: 'MW',                    placeholder: 'e.g. 403',     half: true,  type: 'number' },
  { name: 'heatInput',        label: 'Annual heat input',  hint: 'MMBtu/yr — from CAMPD', placeholder: 'e.g. 1598916', half: true,  type: 'number' },
  { name: 'annualGeneration', label: 'Annual generation',  hint: 'MWh/yr — from CAMPD',   placeholder: 'e.g. 166714',  half: true,  type: 'number' },
  { name: 'SO2Rate',          label: 'SO₂ rate',           hint: 'lbs/MMBtu',             placeholder: 'e.g. 1.10',    half: true,  type: 'number' },
  { name: 'operatingHours',   label: 'Operating hours',    hint: 'hours/yr',              placeholder: 'e.g. 910',     half: true,  type: 'number' },
  // ── baseline emissions (rendered after a divider) ──
  { name: 'baselineSO2',      label: 'Baseline SO₂',       hint: 'short tons/yr',         placeholder: 'e.g. 953',     half: true,  type: 'number' },
  { name: 'baselineNOx',      label: 'Baseline NOₓ',       hint: 'short tons/yr',         placeholder: 'e.g. 227',     half: true,  type: 'number' },
  { name: 'baselinePM25',     label: 'Baseline PM₂.₅',     hint: 'short tons/yr',         placeholder: 'e.g. 71.6',    half: true,  type: 'number' },
  { name: 'baselineVOC',      label: 'Baseline VOC',       hint: 'short tons/yr',         placeholder: 'e.g. 4.1',     half: true,  type: 'number' },
  { name: 'baselineCO2',      label: 'Baseline CO₂',       hint: 'short tons/yr',         placeholder: 'e.g. 164046',  half: false, type: 'number' },
];

// ─── Design tokens (mirrors App.jsx) ─────────────────────────────────────────
const C = {
  surface:     '#FFFFFF',
  bg:          '#F7F6F2',   // slightly warm for input fills
  border:      '#D6DDD6',
  borderFocus: '#2E6B4F',
  borderLight: '#E8EDE8',

  accent:      '#2E6B4F',
  accentLight: '#EAF2ED',

  textPrimary:   '#1A2B1E',
  textSecondary: '#4A5C4E',
  textMuted:     '#7A907E',
  textHint:      '#9AB09E',

  error:       '#C0392B',
  errorBg:     '#FDF2F1',
  errorBorder: '#E8B4B0',

  btnBg:       '#2E6B4F',
  btnHover:    '#24573F',
};

const FONT = "'IBM Plex Sans', sans-serif";

const S = {
  card: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '24px 24px 20px',
    fontFamily: FONT,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: C.textMuted,
    margin: '0 0 4px',
    fontFamily: FONT,
  },
  heading: {
    fontSize: 15,
    fontWeight: 600,
    color: C.textPrimary,
    margin: '0 0 18px',
    fontFamily: FONT,
    letterSpacing: '-0.01em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  label: {
    fontSize: 11.5,
    fontWeight: 500,
    color: C.textSecondary,
    fontFamily: FONT,
  },
  hint: {
    fontSize: 10.5,
    color: C.textHint,
    fontFamily: FONT,
  },
  divider: {
    gridColumn: '1 / -1',
    borderTop: `1px solid ${C.borderLight}`,
    margin: '6px 0 2px',
  },
  footer: {
    marginTop: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  submitBtn: {
    padding: '8px 20px',
    fontSize: 12.5,
    fontWeight: 600,
    background: C.btnBg,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: FONT,
    letterSpacing: '0.01em',
    transition: 'background 0.15s, opacity 0.15s',
  },
  resetBtn: {
    fontSize: 12,
    color: C.textMuted,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: FONT,
  },
};

export default function InputForm({ setResults, plantMeta, onReset }) {
  const [formData, setFormData] = useState({
    state: 'AL', capacity: '403', annualGeneration: '166714', heatInput: '1598916',
    SO2Rate: '1.10', operatingHours: '910',
    baselineSO2: '953', baselineNOx: '227', baselinePM25: '71.6',
    baselineVOC: '4.1', baselineCO2: '164046',
  });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [focusedField, setFocused]  = useState(null);

  useEffect(() => {
    if (!plantMeta) return;
    setFormData({
      state:            plantMeta.state,
      capacity:         plantMeta.capacity,
      heatInput:        plantMeta.heatInput,
      annualGeneration: plantMeta.annualGeneration,
      SO2Rate:          plantMeta.so2Rate,
      operatingHours:   plantMeta.operatingHours,
      baselineSO2:      plantMeta.so2Mass,
      baselineNOx:      plantMeta.noxMass,
      baselinePM25:     plantMeta.pm25,
      baselineVOC:      plantMeta.voc,
      baselineCO2:      plantMeta.co2Mass,
    });
  }, [plantMeta]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleResetClick() {
    setFormData({
      state: '', capacity: '', annualGeneration: '', heatInput: '',
      SO2Rate: '', operatingHours: '',
      baselineSO2: '', baselineNOx: '', baselinePM25: '', baselineVOC: '', baselineCO2: '',
    });
    setError('');
    onReset();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    for (const field of FIELDS) {
      const value = formData[field.name];
      if (
        value === '' ||
        (field.type === 'number' && !Number.isFinite(Number(value))) ||
        (field.type === 'number' && Number(value) <= 0)
      ) {
        setError('Please fill in all fields with valid positive numbers.');
        return;
      }
    }
    setLoading(true);
    const plantInput = {
          ...formData,
          capacity:         parseInt(formData.capacity),
          heatInput:        Number(formData.heatInput),
          annualGeneration: Number(formData.annualGeneration),
          SO2Rate:          Number(formData.SO2Rate),
          operatingHours:   Number(formData.operatingHours),
          baselineSO2:      Number(formData.baselineSO2),
          baselineNOx:      Number(formData.baselineNOx),
          baselinePM25:     Number(formData.baselinePM25),
          baselineVOC:      Number(formData.baselineVOC),
          baselineCO2:      Number(formData.baselineCO2),
        };
    try {
      const response = await fetch(API_URL + '/scenario/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plantInput),
      });
      if (!response.ok) {
        const err = await response.json();
        setError(`Error ${response.status}: ${JSON.stringify(err.detail ?? err)}`);
        return;
      }
      const data = await response.json();
      setResults(data, plantInput);
    } catch (err) {
      setError('Could not reach the backend. Is uvicorn running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={S.card}>
      <p style={S.sectionLabel}>Step 2 — Facility inputs</p>
      <h2 style={S.heading}>
        {plantMeta?.name ?? 'Plant details'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={S.grid}>
          {FIELDS.map(field => (
            <div key={field.name} style={{ display: 'contents' }}>
              {/* Divider + sub-label before emissions block */}
              {field.name === 'baselineSO2' && (
                <>
                  <div style={S.divider} />
                  <p style={{ ...S.sectionLabel, gridColumn: '1 / -1', margin: '2px 0 4px' }}>
                    Baseline emissions
                  </p>
                </>
              )}

              <div style={{
                ...S.fieldGroup,
                gridColumn: field.half ? 'span 1' : '1 / -1',
              }}>
                <label style={S.label}>{field.label}</label>
                <input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused(null)}
                  style={{
                    background: C.bg,
                    border: `1px solid ${focusedField === field.name ? C.borderFocus : C.border}`,
                    borderRadius: 5,
                    padding: '6px 10px',
                    fontSize: 12.5,
                    color: C.textPrimary,
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                    fontFamily: FONT,
                    transition: 'border-color 0.15s',
                  }}
                />
                <span style={S.hint}>{field.hint}</span>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            marginTop: 12,
            padding: '8px 12px',
            background: C.errorBg,
            border: `1px solid ${C.errorBorder}`,
            borderRadius: 5,
            fontSize: 12,
            color: C.error,
            fontFamily: FONT,
          }}>
            {error}
          </div>
        )}

        <div style={S.footer}>
          <button
            type="submit"
            disabled={loading}
            style={{ ...S.submitBtn, opacity: loading ? 0.65 : 1 }}
          >
            {loading ? 'Calculating…' : 'Run scenarios →'}
          </button>
          <button type="button" onClick={handleResetClick} style={S.resetBtn}>
            Clear &amp; reset
          </button>
        </div>
      </form>
    </div>
  );
}