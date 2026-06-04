export default function DateSeparator({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 22px' }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      <span style={{
        color: '#475569', fontSize: '11px', fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap',
      }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}
