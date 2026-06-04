import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useLang } from '../../i18n/LanguageContext';

// Modal for inviting friends: copy link + share to WhatsApp / Facebook / Telegram / X,
// native share on mobile, and an Instagram copy hint (IG has no web share URL).
export default function InviteShare({ onClose }) {
  const { t } = useLang();
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  const message = `${t('invite.message')} ${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('invite.copied'));
    } catch {
      toast.error('Could not copy');
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'ChatSuite', text: t('invite.message'), url }); } catch { /* dismissed */ }
    } else {
      copy();
    }
  };

  const enc = encodeURIComponent;
  const targets = [
    { key: 'wa', label: 'WhatsApp', bg: '#25D366', icon: '🟢', href: `https://wa.me/?text=${enc(message)}` },
    { key: 'fb', label: 'Facebook', bg: '#1877F2', icon: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { key: 'tg', label: 'Telegram', bg: '#229ED9', icon: '✈️', href: `https://t.me/share/url?url=${enc(url)}&text=${enc(t('invite.message'))}` },
    { key: 'x', label: 'X', bg: '#000000', icon: '𝕏', href: `https://twitter.com/intent/tweet?text=${enc(message)}` },
  ];

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', animation: 'fadeBg 0.2s ease' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: '440px',
        background: '#13132a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px',
        padding: '24px', boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
        animation: 'popIn 0.2s cubic-bezier(0.34,1.3,0.64,1)', fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
          <div style={{ fontSize: '32px' }}>🎉</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px', fontWeight: '800' }}>{t('invite.title')}</h3>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '13px', lineHeight: 1.5 }}>{t('invite.subtitle')}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', cursor: 'pointer', fontSize: '16px',
          }}>✕</button>
        </div>

        <label style={{ color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('invite.yourLink')}</label>
        <div style={{ display: 'flex', gap: '8px', margin: '8px 0 18px' }}>
          <input readOnly value={url} onFocus={e => e.target.select()} style={{
            flex: 1, minWidth: 0, background: '#0b0b14', color: '#c7d2fe', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontWeight: '600',
          }} />
          <button onClick={copy} style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white',
            borderRadius: '12px', padding: '0 18px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{t('invite.copy')}</button>
        </div>

        <label style={{ color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('invite.shareVia')}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '12px 0 4px' }}>
          {targets.map(s => (
            <a key={s.key} href={s.href} target="_blank" rel="noreferrer" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
              textDecoration: 'none', color: '#cbd5e1', fontSize: '12px', fontWeight: '600',
            }}>
              <span style={{
                width: '52px', height: '52px', borderRadius: '16px', background: s.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', color: 'white', fontWeight: '800', boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
              }}>{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={nativeShare} style={{
            width: '100%', marginTop: '14px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: '12px',
            padding: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
          }}>📤 {t('invite.nativeShare')}</button>
        )}

        <p style={{ color: '#475569', fontSize: '12px', marginTop: '16px', lineHeight: 1.5, display: 'flex', gap: '6px' }}>
          <span>📸</span><span>{t('invite.instaHint')}</span>
        </p>
      </div>
    </div>,
    document.body
  );
}
