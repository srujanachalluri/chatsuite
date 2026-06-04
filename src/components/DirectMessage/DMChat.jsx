import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import MessageList from '../Chat/MessageList';
import MessageInput from '../Chat/MessageInput';
import BackButton from '../Chat/BackButton';

export default function DMChat({ otherUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const dmId = [auth.currentUser.uid, otherUser.uid].sort().join('_');

  useEffect(() => {
    setLoaded(false); setMessages([]);
    const q = query(collection(db, 'dms', dmId, 'messages'), orderBy('createdAt'), limit(100));
    const unsub = onSnapshot(q, snap => { setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoaded(true); });
    return unsub;
  }, [dmId]);

  const emptyState = loaded && messages.length === 0 && (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <img src={otherUser.photoURL} style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid rgba(99,102,241,0.5)', margin: '0 auto 16px', display: 'block', boxShadow: '0 8px 32px rgba(99,102,241,0.3)' }} alt="" />
      <p style={{ color: '#94a3b8', fontWeight: '700', fontSize: '17px', marginBottom: '6px' }}>{otherUser.displayName}</p>
      <p style={{ color: '#334155', fontSize: '14px' }}>Start your private conversation</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="chat-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,11,20,0.9)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        {onBack && <BackButton onClick={onBack} />}
        <div style={{ position: 'relative' }}>
          <img src={otherUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.uid}`}
            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid rgba(99,102,241,0.5)', display: 'block', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }} alt="" />
          <span style={{ position: 'absolute', bottom: 1, right: 1, width: '11px', height: '11px', background: '#4ade80', borderRadius: '50%', border: '2px solid #0b0b14', boxShadow: '0 0 8px #4ade80', animation: 'livePulse 2s infinite' }} />
        </div>
        <div>
          <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '17px', fontWeight: '700', letterSpacing: '-0.4px' }}>{otherUser.displayName}</h2>
          <p style={{ color: '#4ade80', margin: 0, fontSize: '12px', fontWeight: '600', marginTop: '1px' }}>● Active now</p>
        </div>
      </div>

      <MessageList messages={messages} loaded={loaded} emptyState={emptyState} collectionPath={`dms/${dmId}/messages`} />

      <MessageInput collectionPath={`dms/${dmId}/messages`} placeholder={`Message ${otherUser.displayName}...`} />
      <style>{`@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }`}</style>
    </div>
  );
}