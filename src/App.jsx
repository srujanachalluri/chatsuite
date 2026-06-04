import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import useIsMobile from './hooks/useIsMobile';
import Login from './components/Auth/Login';
import Sidebar from './components/Sidebar/Sidebar';
import ChatRoom from './components/Chat/ChatRoom';
import DMChat from './components/DirectMessage/DMChat';
import AIChat from './components/AI/AIChat';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeDM, setActiveDM] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await setDoc(doc(db, 'users', u.uid), {
          uid: u.uid,
          displayName: u.displayName,
          photoURL: u.photoURL,
          email: u.email,
          lastSeen: serverTimestamp(),
        }, { merge: true });
      }
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100dvh', background: '#0b0b14', flexDirection: 'column', gap: '18px',
    }}>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#334155', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
        Loading ChatSuite...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user) return <Login />;

  const activeId = showAI ? 'ai' : activeDM ? activeDM.uid : activeRoom?.id;
  const hasActive = showAI || activeRoom || activeDM;
  const openChat = () => setMobileChatOpen(true);
  const onBack = isMobile ? () => setMobileChatOpen(false) : null;

  // On mobile we show one pane at a time: the sidebar OR the active chat.
  const showSidebar = !isMobile || !mobileChatOpen;
  const showMain = !isMobile || mobileChatOpen;

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#0b0b14', overflow: 'hidden' }}>
      {showSidebar && (
        <Sidebar
          isMobile={isMobile}
          activeId={activeId}
          onSelectRoom={(room) => { setActiveRoom(room); setActiveDM(null); setShowAI(false); openChat(); }}
          onSelectDM={(u) => { setActiveDM(u); setActiveRoom(null); setShowAI(false); openChat(); }}
          onSelectAI={() => { setShowAI(true); setActiveRoom(null); setActiveDM(null); openChat(); }}
        />
      )}

      {showMain && (
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0f0f1e' }}>
        {showAI && <AIChat onBack={onBack} />}
        {activeRoom && !showAI && <ChatRoom room={activeRoom} onBack={onBack} />}
        {activeDM && !showAI && <DMChat otherUser={activeDM} onBack={onBack} />}

        {!hasActive && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', flexDirection: 'column', gap: '16px',
            fontFamily: 'Inter, sans-serif', position: 'relative',
            animation: 'fadeInUp 0.4s ease',
          }}>
            <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ fontSize: '64px', marginBottom: '4px' }}>💬</div>
            <h2 style={{ fontSize: '26px', color: '#e2e8f0', fontWeight: '800', letterSpacing: '-0.6px', textAlign: 'center' }}>
              Welcome to ChatSuite
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', textAlign: 'center', maxWidth: '340px', lineHeight: 1.6 }}>
              Pick a channel, send a direct message, or chat with AI
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '🏠', title: 'Channels', desc: 'Group conversations' },
                { icon: '✉️', title: 'Direct Messages', desc: 'Private chats' },
                { icon: '🤖', title: 'AI Chat', desc: 'Powered by Gemini' },
              ].map(f => (
                <div key={f.title} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px', padding: '18px 20px', textAlign: 'center', minWidth: '130px',
                  transition: 'all 0.2s ease',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                  <p style={{ color: '#c7d2fe', fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>{f.title}</p>
                  <p style={{ color: '#475569', fontSize: '12px' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}
      <style>{`@keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}