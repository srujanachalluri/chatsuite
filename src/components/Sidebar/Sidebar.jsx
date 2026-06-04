import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Sidebar({ onSelectRoom, onSelectDM, onSelectAI, activeId, isMobile }) {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [tab, setTab] = useState('rooms');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'rooms'), snap => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.uid !== auth.currentUser?.uid));
    });
  }, []);

  const createRoom = async () => {
    if (!newRoom.trim()) return;
    const name = newRoom.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!name) return;
    try {
      await addDoc(collection(db, 'rooms'), { name, createdBy: auth.currentUser.uid, createdAt: serverTimestamp() });
      toast.success(`#${name} created`);
      setNewRoom('');
      setShowRoomInput(false);
    } catch (err) {
      toast.error('Could not create channel');
    }
  };

  const NavItem = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', padding: '10px 14px',
      background: active ? 'rgba(99,102,241,0.18)' : 'none',
      border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
      borderRadius: '11px', color: active ? '#c7d2fe' : '#64748b',
      cursor: 'pointer', fontSize: '14px', fontWeight: active ? '600' : '500',
      display: 'flex', alignItems: 'center', gap: '10px',
      transition: 'all 0.18s ease', marginBottom: '3px',
      boxShadow: active ? '0 2px 12px rgba(99,102,241,0.2)' : 'none',
    }}
      onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; } }}
      onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; } }}
    >{children}</button>
  );

  return (
    <div style={{
      width: isMobile ? '100%' : '265px', flexShrink: 0, height: '100%',
      background: 'linear-gradient(180deg, #0d0d1a 0%, #0b0b16 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      {/* Header */}
      <div style={{ padding: '22px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '13px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          }}>💬</div>
          <div>
            <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '17px', fontWeight: '800', letterSpacing: '-0.4px' }}>ChatSuite</h2>
            <p style={{ color: '#334155', margin: 0, fontSize: '11px', fontWeight: '500' }}>Real-time · AI · Rooms</p>
          </div>
        </div>
      </div>

      {/* AI Button */}
      <div style={{ padding: '16px 14px 12px' }}>
        <button onClick={onSelectAI} style={{
          width: '100%', padding: '13px 16px',
          background: activeId === 'ai' ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))' : 'rgba(99,102,241,0.08)',
          border: `1px solid ${activeId === 'ai' ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.15)'}`,
          borderRadius: '13px', color: activeId === 'ai' ? '#c7d2fe' : '#818cf8',
          cursor: 'pointer', fontSize: '14px', fontWeight: '700',
          display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease',
          boxShadow: activeId === 'ai' ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
        }}
          onMouseOver={e => { if (activeId !== 'ai') { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; } }}
          onMouseOut={e => { if (activeId !== 'ai') { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; } }}
        >
          <span style={{ fontSize: '18px' }}>🤖</span>
          <span>AI Assistant</span>
          <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: '800', background: 'rgba(99,102,241,0.3)', padding: '3px 8px', borderRadius: '20px', color: '#818cf8', letterSpacing: '0.8px' }}>GEMINI</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', padding: '0 14px 14px' }}>
        {[['rooms', '# Channels'], ['dms', '✉ Direct']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px', fontSize: '12px', fontWeight: '700',
            background: tab === t ? 'rgba(255,255,255,0.08)' : 'none',
            color: tab === t ? '#e2e8f0' : '#475569',
            border: `1px solid ${tab === t ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
            borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        {tab === 'rooms' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 8px 8px' }}>
              <span style={{ color: '#334155', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Channels</span>
              <button onClick={() => setShowRoomInput(!showRoomInput)} style={{
                background: showRoomInput ? 'rgba(99,102,241,0.2)' : 'none', border: 'none',
                color: '#6366f1', cursor: 'pointer', fontSize: '20px',
                width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: '7px', transition: 'all 0.2s', lineHeight: 1,
              }}>+</button>
            </div>

            {showRoomInput && (
              <div style={{ padding: '0 2px 10px', display: 'flex', gap: '6px' }}>
                <input value={newRoom} onChange={e => setNewRoom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createRoom()}
                  placeholder="channel-name" autoFocus
                  style={{ flex: 1, background: '#13132a', color: '#e2e8f0', border: '1px solid #6366f1', borderRadius: '10px', padding: '9px 12px', fontSize: '13px', outline: 'none', fontWeight: '500' }} />
                <button onClick={createRoom} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', padding: '0 14px', fontWeight: '700', fontSize: '15px' }}>✓</button>
              </div>
            )}

            {rooms.length === 0 && !showRoomInput && (
              <p style={{ color: '#1e293b', fontSize: '13px', textAlign: 'center', marginTop: '20px', fontWeight: '500' }}>No channels yet — create one!</p>
            )}

            {rooms.map(room => (
              <NavItem key={room.id} active={activeId === room.id} onClick={() => onSelectRoom(room)}>
                <span style={{ color: activeId === room.id ? '#6366f1' : '#334155', fontWeight: '800', fontSize: '15px' }}>#</span>
                <span>{room.name}</span>
              </NavItem>
            ))}
          </>
        )}

        {tab === 'dms' && (
          <>
            <div style={{ padding: '2px 8px 8px' }}>
              <span style={{ color: '#334155', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Direct Messages</span>
            </div>
            {users.length === 0 && <p style={{ color: '#1e293b', fontSize: '13px', textAlign: 'center', marginTop: '20px', fontWeight: '500' }}>No other users yet</p>}
            {users.map(user => (
              <button key={user.uid} onClick={() => onSelectDM(user)} style={{
                width: '100%', textAlign: 'left', padding: '9px 14px',
                background: activeId === user.uid ? 'rgba(99,102,241,0.18)' : 'none',
                border: activeId === user.uid ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                borderRadius: '11px', color: activeId === user.uid ? '#c7d2fe' : '#64748b',
                cursor: 'pointer', fontSize: '14px', fontWeight: activeId === user.uid ? '600' : '500',
                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.18s ease', marginBottom: '3px',
              }}
                onMouseOver={e => { if (activeId !== user.uid) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; } }}
                onMouseOut={e => { if (activeId !== user.uid) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748b'; } }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'block' }} alt="" />
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', background: '#4ade80', borderRadius: '50%', border: '2px solid #0d0d1a' }} />
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName}</span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Profile + Sign Out */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        {showUserMenu && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowUserMenu(false)} />
            <div style={{
              position: 'absolute', bottom: '80px', left: '14px', right: '14px',
              background: '#13132a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', overflow: 'hidden', zIndex: 100,
              boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              animation: 'slideUp 0.2s cubic-bezier(0.34,1.3,0.64,1)',
            }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={auth.currentUser?.photoURL} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid rgba(99,102,241,0.4)' }} alt="" />
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: '#f1f5f9', margin: 0, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auth.currentUser?.displayName}</p>
                  <p style={{ color: '#475569', margin: '2px 0 0', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{auth.currentUser?.email}</p>
                </div>
              </div>
              <button onClick={() => { signOut(auth); toast.success('Signed out'); }} style={{
                width: '100%', padding: '14px 18px', background: 'none', border: 'none',
                color: '#f87171', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: '18px' }}>🚪</span>
                Sign out of ChatSuite
              </button>
            </div>
          </>
        )}

        <button onClick={() => setShowUserMenu(v => !v)} style={{
          width: '100%',
          background: showUserMenu ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${showUserMenu ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '14px', padding: '11px 14px',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
          onMouseOver={e => { if (!showUserMenu) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; } }}
          onMouseOut={e => { if (!showUserMenu) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={auth.currentUser?.photoURL} style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'block', border: '2px solid rgba(99,102,241,0.5)' }} alt="" />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%', border: '2px solid #0d0d1a', boxShadow: '0 0 6px #4ade80' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ color: '#e2e8f0', margin: 0, fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.2px' }}>
              {auth.currentUser?.displayName}
            </p>
            <p style={{ color: '#4ade80', margin: 0, fontSize: '11px', fontWeight: '600' }}>● Online</p>
          </div>
          <span style={{ color: '#475569', fontSize: '16px', flexShrink: 0, letterSpacing: '2px' }}>···</span>
        </button>
      </div>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}