import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import useIsMobile from '../../hooks/useIsMobile';

const ONLINE_WINDOW_MS = 2 * 60 * 1000; // "online" if seen within 2 minutes

function isOnline(user) {
  const seen = user.lastSeen?.toDate?.();
  return seen ? Date.now() - seen.getTime() < ONLINE_WINDOW_MS : false;
}

export default function RoomMembers({ roomName, onClose }) {
  const [users, setUsers] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const myUid = auth.currentUser?.uid;
  const sorted = [...users].sort((a, b) => {
    const ao = isOnline(a), bo = isOnline(b);
    if (ao !== bo) return ao ? -1 : 1;
    return (a.displayName || '').localeCompare(b.displayName || '');
  });
  const onlineCount = users.filter(isOnline).length;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', animation: 'fadeBg 0.2s ease' }} />
      <div style={{
        position: 'relative', height: '100%', width: isMobile ? '100%' : '320px',
        background: '#0d0d1a', borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        animation: 'membersIn 0.25s cubic-bezier(0.34,1.2,0.64,1)',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onClose} aria-label="Close" style={{
            width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#c7d2fe', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
          }}>✕</button>
          <div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '800' }}>Members</h3>
            <p style={{ color: '#475569', margin: '2px 0 0', fontSize: '12px', fontWeight: '500' }}>
              #{roomName} · {users.length} total · {onlineCount} online
            </p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {sorted.map(user => {
            const online = isOnline(user);
            return (
              <div key={user.uid} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 10px', borderRadius: '12px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'block', opacity: online ? 1 : 0.6 }} alt="" />
                  <span style={{
                    position: 'absolute', bottom: 0, right: 0, width: '11px', height: '11px',
                    background: online ? '#4ade80' : '#475569', borderRadius: '50%', border: '2px solid #0d0d1a',
                    boxShadow: online ? '0 0 6px #4ade80' : 'none',
                  }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: '#e2e8f0', margin: 0, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.displayName}{user.uid === myUid && <span style={{ color: '#818cf8', fontWeight: '600' }}> (you)</span>}
                  </p>
                  <p style={{ color: online ? '#4ade80' : '#475569', margin: 0, fontSize: '11px', fontWeight: '600' }}>
                    {online ? '● Online' : 'Offline'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes membersIn { from{transform:translateX(100%)} to{transform:translateX(0)} }`}</style>
    </div>,
    document.body
  );
}
