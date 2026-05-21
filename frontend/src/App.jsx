import { useState } from 'react';
import InputForm from './InputForm';
import ResultsPanel from './ResultsPanel';
import Map from './Map';
import SavedScenarios from './SavedScenarios';

const C = {
  bg:          '#E8E4DC',
  surface:     '#FFFFFF',
  border:      '#D6DDD6',
  borderLight: '#E8EDE8',
  accent:      '#2E6B4F',
  accentLight: '#EAF2ED',
  textPrimary:   '#1A2B1E',
  textSecondary: '#4A5C4E',
  textMuted:     '#7A907E',
  badgeBg:     '#EAF2ED',
  badgeBorder: '#9EC4B0',
  badgeText:   '#2E6B4F',
};

const FONT = "'IBM Plex Sans', sans-serif";

const STEPS = [
  { num: '1', label: 'Select a facility',          desc: 'Choose a coal-fired plant from the map or search by name. Pre-loaded data from EPA CAMPD.' },
  { num: '2', label: 'Review facility inputs',      desc: 'Inspect baseline emissions (SO2, NOx, PM2.5, VOC, CO2) and operational parameters. Edit if needed.' },
  { num: '3', label: 'Compare transition scenarios', desc: 'Receive monetized health and climate benefit estimates for BAU, Gas Transition, Renewables, and Add-on Controls.' },
];

const POLLUTANTS = ['SO2', 'NOx', 'PM2.5', 'VOC', 'CO2'];

const VIEW = { LANDING: 'landing', FORM: 'form', RESULTS: 'results' };

function TopBar({ view, onBack, onAbout }) {
  const showBack  = view === VIEW.FORM || view === VIEW.RESULTS;
  const showAbout = view !== VIEW.LANDING;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid ' + C.border,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.02em', fontFamily: FONT }}>
          MECAQC
        </span>
        <span style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT }}>
          Multi-pollutant Emissions Calculator · Holloway Group, UW-Madison
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999,
          background: C.badgeBg, border: '1px solid ' + C.badgeBorder,
          color: C.badgeText, fontFamily: FONT, letterSpacing: '0.01em',
        }}>
          Wu et al. 2024 · ERL
        </span>
        {showAbout && (
          <button onClick={onAbout} style={{
            fontSize: 12, color: C.textMuted, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: FONT, textDecoration: 'underline', padding: 0,
          }}>
            About
          </button>
        )}
        {showBack && (
          <button onClick={onBack} style={{
            fontSize: 12, color: C.accent, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: FONT, textDecoration: 'underline', padding: 0,
          }}>
            Back to calculator
          </button>
        )}
      </div>
    </div>
  );
}

function LandingPanel({ onTryIt }) {
  return (
    <div style={{
      background: C.surface, border: '1px solid ' + C.border, borderRadius: 8,
      padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <div>
        <h2 style={{
          margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: C.textPrimary,
          letterSpacing: '-0.02em', fontFamily: FONT, lineHeight: 1.3,
        }}>
          Evaluate health and climate benefits of coal plant transition scenarios
        </h2>
        <p style={{ margin: 0, fontSize: 13.5, color: C.textSecondary, lineHeight: 1.6, fontFamily: FONT }}>
          MECAQC translates facility-level emissions data into monetized public health
          and climate outcomes across four regulatory pathways, giving permit writers,
          plant managers, and environmental counsel a consistent analytical basis for
          compliance decisions.
        </p>
      </div>

      <div>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT }}>
          Pollutants modeled
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {POLLUTANTS.map(p => (
            <span key={p} style={{
              fontSize: 12, padding: '3px 10px', borderRadius: 4,
              background: C.accentLight, color: C.accent, fontWeight: 500,
              fontFamily: FONT, border: '1px solid ' + C.badgeBorder,
            }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid ' + C.borderLight }} />

      <div>
        <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: FONT }}>
          How it works
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEPS.map(step => (
            <div key={step.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                background: C.accentLight, border: '1.5px solid ' + C.badgeBorder,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: FONT, marginTop: 1,
              }}>
                {step.num}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: FONT, marginBottom: 2 }}>{step.label}</div>
                <div style={{ fontSize: 12.5, color: C.textSecondary, lineHeight: 1.5, fontFamily: FONT }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid ' + C.borderLight }} />

      <button
        onClick={onTryIt}
        style={{
          alignSelf: 'flex-start', fontSize: 13, fontWeight: 600,
          color: '#fff', background: C.accent, border: 'none', borderRadius: 6,
          padding: '9px 22px', cursor: 'pointer', fontFamily: FONT, letterSpacing: '0.01em',
        }}
      >
        Try it out
      </button>

      <p style={{ margin: 0, fontSize: 11.5, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT }}>
        Methodology from{' '}
        <a href="https://pubs.acs.org/doi/10.1021/acsestair.4c00114" target="_blank" rel="noreferrer"
          style={{ color: C.accent, textDecoration: 'none', borderBottom: '1px solid ' + C.badgeBorder }}>
          Wu et al. (2024), Environmental Research Letters
        </a>
        . Cost factors from EPA CAMPD and EIA; all figures in 2020 USD.
        Intended for screening-level analysis only.
      </p>
    </div>
  );
}

export default function App() {
  const [view, setView]           = useState(VIEW.LANDING);
  const [results, setResults]     = useState(null);
  const [plantMeta, setPlantMeta] = useState(null);
  const [plantInput, setPlantInput] = useState(null);

  function handleResults(data, meta) {
    if (meta) {
      setPlantMeta(meta);
      setPlantInput(meta);
    }
    if (data) {
      setResults(data);
      setView(VIEW.RESULTS);
    } else {
      setView(VIEW.FORM);
    }
  }

  // Called when user clicks a saved scenario row.
  // Passes partial plant data as meta (no results) → goes to FORM view pre-populated.
  function handleSavedSelect(partialMeta) {
    handleResults(null, partialMeta);
  }

  function handleBack() {
    setResults(null);
    setView(VIEW.FORM);
  }

  function handleAbout() {
    setResults(null);
    setPlantMeta(null);
    setView(VIEW.LANDING);
  }

  const rightPanel =
    view === VIEW.RESULTS ? <ResultsPanel results={results} plantMeta={plantMeta} plantInput={plantInput} /> :
    view === VIEW.FORM    ? <InputForm setResults={handleResults} plantMeta={plantMeta} onReset={handleBack} /> :
                            <LandingPanel onTryIt={() => setView(VIEW.FORM)} />;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      <div style={{ padding: '32px 10%' }}>
        <TopBar view={view} onBack={handleBack} onAbout={handleAbout} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left column: map + saved scenarios stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Map onResults={handleResults} />
          <SavedScenarios onSelect={handleSavedSelect} />
        </div>
        {/* Right column: form or results */}
        {rightPanel}
      </div>
      </div>
    </div>
  );
}