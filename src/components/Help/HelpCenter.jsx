import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../../i18n/LanguageContext';
import { helpTopics } from '../../content/help';
import { formatText } from '../../utils/formatText';

// Bilingual help & onboarding drawer: a list of guides; tap one to read steps.
export default function HelpCenter({ onClose }) {
  const { t, lang } = useLang();
  const [topic, setTopic] = useState(null);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', animation: 'fadeBg 0.2s ease' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: '520px', height: '100%',
        background: '#0d0d1a', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', animation: 'helpIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: '18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={topic ? () => setTopic(null) : onClose} aria-label="Back" style={{
            width: '36px', height: '36px', borderRadius: '11px', flexShrink: 0,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#c7d2fe', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
          }}>{topic ? '‹' : '✕'}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '17px', fontWeight: '800' }}>
              {topic ? topic.title[lang] : t('help.title')}
            </h3>
            <p style={{ color: '#475569', margin: '2px 0 0', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topic ? t('help.back') : t('help.subtitle')}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
          {!topic && helpTopics.map(tp => (
            <button key={tp.id} onClick={() => setTopic(tp)} style={{
              display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '16px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{tp.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', color: '#e2e8f0', fontSize: '15px', fontWeight: '700' }}>{tp.title[lang]}</span>
                <span style={{ display: 'block', color: '#64748b', fontSize: '12px', marginTop: '3px', lineHeight: 1.4 }}>{tp.intro[lang]}</span>
              </span>
              <span style={{ color: '#475569', fontSize: '20px' }}>›</span>
            </button>
          ))}

          {topic && (
            <div style={{ animation: 'fadeBg 0.2s ease' }}>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '4px 4px 18px' }}>{topic.intro[lang]}</p>
              <p style={{ color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 4px 12px' }}>{t('help.steps')}</p>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topic.steps.map((step, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px', padding: '13px 14px',
                  }}>
                    <span style={{
                      flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800',
                    }}>{i + 1}</span>
                    <span style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.55 }}>{formatText(step[lang])}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes helpIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>,
    document.body
  );
}
