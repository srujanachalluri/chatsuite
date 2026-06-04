// Mobile-only back arrow shown in chat headers to return to the sidebar.
export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Back" style={{
      flexShrink: 0, width: '36px', height: '36px', marginRight: '2px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '11px', color: '#c7d2fe', cursor: 'pointer',
      fontSize: '20px', lineHeight: 1, transition: 'background 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
    >‹</button>
  );
}
