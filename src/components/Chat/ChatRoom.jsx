import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import BackButton from './BackButton';

export default function ChatRoom({ room, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false); setMessages([]);
    const q = query(collection(db, 'rooms', room.id, 'messages'), orderBy('createdAt'), limit(100));
    const unsub = onSnapshot(q, snap => { setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoaded(true); });
    return unsub;
  }, [room.id]);

  const emptyState = loaded && messages.length === 0 && (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>👋</div>
      <p style={{ color: '#64748b', fontWeight: '700', fontSize: '17px', marginBottom: '6px' }}>Welcome to #{room.name}</p>
      <p style={{ color: '#334155', fontSize: '14px' }}>Be the first to send a message!</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,11,20,0.9)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {onBack && <BackButton onClick={onBack} />}
        <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))', border: '1px solid rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#818cf8', flexShrink: 0 }}>#</div>
        <div>
          <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '17px', fontWeight: '700', letterSpacing: '-0.4px' }}>{room.name}</h2>
          <p style={{ color: '#475569', margin: 0, fontSize: '12px', fontWeight: '500', marginTop: '1px' }}>Group channel · {messages.length} messages</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80', animation: 'livePulse 2s infinite' }} />
          <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: '600' }}>Live</span>
        </div>
      </div>

      <MessageList messages={messages} loaded={loaded} emptyState={emptyState} collectionPath={`rooms/${room.id}/messages`} />

      <MessageInput collectionPath={`rooms/${room.id}/messages`} />
      <style>{`@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }`}</style>
    </div>
  );
}