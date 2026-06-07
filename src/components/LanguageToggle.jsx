import { useLang } from '../i18n/LanguageContext';

// Compact EN / తె switch.
export default function LanguageToggle({ size = 'md' }) {
  const { lang, setLang } = useLang();
  const pad = size === 'sm' ? '4px 9px' : '5px 11px';
  const font = size === 'sm' ? '11px' : '12px';

  const Btn = ({ code, label }) => {
    const active = lang === code;
    return (
      <button onClick={() => setLang(code)} style={{
        padding: pad, fontSize: font, fontWeight: '700', cursor: 'pointer',
        border: 'none', borderRadius: '8px',
        background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
        color: active ? '#fff' : '#64748b', transition: 'all 0.2s',
      }}>{label}</button>
    );
  };

  return (
    <div style={{
      display: 'inline-flex', gap: '2px', padding: '2px',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
    }}>
      <Btn code="en" label="EN" />
      <Btn code="te" label="తె" />
    </div>
  );
}
