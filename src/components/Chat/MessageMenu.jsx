import { createPortal } from 'react-dom';
import { useLang } from '../../i18n/LanguageContext';

const EMOJIS = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

function ActionRow({ icon, label, danger, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      padding: '13px 18px', fontSize: '15px', fontWeight: '600',
      color: danger ? '#f87171' : '#e2e8f0', transition: 'background 0.15s',
    }}
      onMouseOver={e => e.currentTarget.style.background = danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)'}
      onMouseOut={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>{icon}</span>
      {label}
    </button>
  );
}

function EmojiRow({ myReactions, onReact, big }) {
  return (
    <div style={{ display: 'flex', justifyContent: big ? 'space-around' : 'flex-start', gap: '4px', padding: big ? '14px 10px' : '0' }}>
      {EMOJIS.map(e => {
        const mine = myReactions?.includes(e);
        return (
          <button key={e} onClick={() => onReact(e)} style={{
            background: mine ? 'rgba(99,102,241,0.25)' : 'none',
            border: 'none', cursor: 'pointer', fontSize: big ? '28px' : '20px',
            padding: big ? '6px' : '4px 6px', borderRadius: '50%', lineHeight: 1, transition: 'transform 0.15s',
          }}
            onMouseOver={el => el.currentTarget.style.transform = 'scale(1.25)'}
            onMouseOut={el => el.currentTarget.style.transform = 'scale(1)'}
          >{e}</button>
        );
      })}
    </div>
  );
}

export default function MessageMenu({ isOwn, isMobile, myReactions, onReact, onCopy, onEdit, onDelete, onClose }) {
  const { t } = useLang();
  const actions = (
    <>
      <ActionRow icon="📋" label={t('menu.copy')} onClick={onCopy} />
      {isOwn && <ActionRow icon="✏️" label={t('menu.edit')} onClick={onEdit} />}
      {isOwn && <ActionRow icon="🗑️" label={t('menu.delete')} danger onClick={onDelete} />}
    </>
  );

  // Mobile: full-width bottom sheet rendered into <body> so it overlays everything.
  if (isMobile) {
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', animation: 'fadeBg 0.2s ease' }} />
        <div style={{
          position: 'relative', background: '#16162b', borderTopLeftRadius: '22px', borderTopRightRadius: '22px',
          borderTop: '1px solid rgba(255,255,255,0.1)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          animation: 'sheetUp 0.25s cubic-bezier(0.34,1.2,0.64,1)',
        }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '3px', background: 'rgba(255,255,255,0.18)', margin: '10px auto 4px' }} />
          <EmojiRow myReactions={myReactions} onReact={onReact} big />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
          {actions}
        </div>
      </div>,
      document.body
    );
  }

  // Desktop: popover anchored above the bubble (parent wrapper is position:relative).
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
      <div style={{
        position: 'absolute', [isOwn ? 'right' : 'left']: 0, bottom: 'calc(100% + 8px)',
        zIndex: 31, background: '#1e1e32', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
        minWidth: '180px', animation: 'popIn 0.15s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <EmojiRow myReactions={myReactions} onReact={onReact} />
        </div>
        {actions}
      </div>
    </>
  );
}
