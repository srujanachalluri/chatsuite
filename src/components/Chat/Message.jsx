import { useState } from 'react';
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import toast from 'react-hot-toast';

const EMOJIS = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

export default function Message({ msg, collectionPath }) {
  const [showReactions, setShowReactions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);
  const isOwn = msg.uid === auth.currentUser?.uid;
  const reactions = msg.reactions || {};

  const msgRef = () => doc(db, ...collectionPath.split('/'), msg.id);

  const react = async (emoji) => {
    const ref = msgRef();
    const uid = auth.currentUser.uid;
    const current = reactions[emoji] || [];
    if (current.includes(uid)) {
      await updateDoc(ref, { [`reactions.${emoji}`]: arrayRemove(uid) });
    } else {
      await updateDoc(ref, { [`reactions.${emoji}`]: arrayUnion(uid) });
    }
    setShowReactions(false);
  };

  const saveEdit = async () => {
    const next = editText.trim();
    if (!next) return;
    if (next === msg.text) { setEditing(false); return; }
    try {
      await updateDoc(msgRef(), { text: next, editedAt: serverTimestamp() });
      toast.success('Message updated');
    } catch {
      toast.error('Could not update message');
    }
    setEditing(false);
  };

  const remove = async () => {
    try {
      await deleteDoc(msgRef());
      toast.success('Message deleted');
    } catch {
      toast.error('Could not delete message');
    }
  };

  const time = msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={isOwn ? 'msg-own' : 'msg-other'} style={{
      display: 'flex', flexDirection: isOwn ? 'row-reverse' : 'row',
      alignItems: 'flex-end', gap: '10px', marginBottom: '20px',
    }}>
      <img
        src={msg.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.uid}`}
        style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        alt=""
      />

      <div className="msg-bubble-wrap" style={{ maxWidth: '66%' }}>
        {!isOwn && (
          <p style={{ fontSize: '12px', color: '#818cf8', marginBottom: '6px', marginLeft: '4px', fontWeight: '700' }}>
            {msg.displayName}
          </p>
        )}

        <div onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)} style={{ position: 'relative' }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={editText}
                autoFocus
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                  if (e.key === 'Escape') { setEditText(msg.text); setEditing(false); }
                }}
                rows={2}
                style={{
                  background: '#13132a', color: '#f1f5f9', border: '1px solid rgba(99,102,241,0.5)',
                  borderRadius: '14px', padding: '10px 14px', fontSize: '15px', outline: 'none',
                  resize: 'vertical', minWidth: '180px', lineHeight: 1.5,
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                <button onClick={() => { setEditText(msg.text); setEditing(false); }} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', borderRadius: '10px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={saveEdit} style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
                  color: 'white', borderRadius: '10px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                }}>Save</button>
              </div>
            </div>
          ) : (
            <div style={{
              background: isOwn ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.07)',
              color: '#f1f5f9', padding: '12px 16px',
              borderRadius: isOwn ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
              fontSize: '15px', fontWeight: '450', lineHeight: '1.6',
              wordBreak: 'break-word', whiteSpace: 'pre-wrap',
              border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: isOwn ? '0 4px 20px rgba(99,102,241,0.35)' : '0 2px 12px rgba(0,0,0,0.25)',
            }}>
              {msg.text}
            </div>
          )}

          {showReactions && !editing && (
            <div style={{
              position: 'absolute', [isOwn ? 'right' : 'left']: 0, bottom: 'calc(100% + 10px)',
              background: '#1e1e32', borderRadius: '24px', padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: '4px', zIndex: 20,
              boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'popIn 0.15s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => react(e)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '20px', padding: '4px 6px', borderRadius: '10px', transition: 'transform 0.15s', lineHeight: 1,
                }}
                  onMouseOver={el => el.currentTarget.style.transform = 'scale(1.4) translateY(-2px)'}
                  onMouseOut={el => el.currentTarget.style.transform = 'scale(1)'}
                >{e}</button>
              ))}

              {isOwn && (
                <>
                  <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
                  <button onClick={() => { setEditText(msg.text); setEditing(true); setShowReactions(false); }} title="Edit" style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                    padding: '4px 6px', borderRadius: '10px', lineHeight: 1, transition: 'transform 0.15s',
                  }}
                    onMouseOver={el => el.currentTarget.style.transform = 'scale(1.25)'}
                    onMouseOut={el => el.currentTarget.style.transform = 'scale(1)'}
                  >✏️</button>
                  <button onClick={remove} title="Delete" style={{
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
                    padding: '4px 6px', borderRadius: '10px', lineHeight: 1, transition: 'transform 0.15s',
                  }}
                    onMouseOver={el => el.currentTarget.style.transform = 'scale(1.25)'}
                    onMouseOut={el => el.currentTarget.style.transform = 'scale(1)'}
                  >🗑️</button>
                </>
              )}
            </div>
          )}
        </div>

        {Object.entries(reactions).filter(([, u]) => u.length > 0).length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginTop: '7px', flexWrap: 'wrap' }}>
            {Object.entries(reactions).filter(([, u]) => u.length > 0).map(([emoji, uids]) => {
              const mine = uids.includes(auth.currentUser?.uid);
              return (
                <span key={emoji} className="reaction-pill" onClick={() => react(emoji)} style={{
                  background: mine ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${mine ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '14px', padding: '3px 10px', fontSize: '13px',
                  color: '#e2e8f0', fontWeight: '600', userSelect: 'none',
                }}>{emoji} {uids.length}</span>
              );
            })}
          </div>
        )}

        <p style={{ fontSize: '11px', color: '#475569', marginTop: '5px', textAlign: isOwn ? 'right' : 'left', paddingLeft: '4px', paddingRight: '4px', fontWeight: '500' }}>
          {time}{msg.editedAt && <span style={{ fontStyle: 'italic', opacity: 0.8 }}> · edited</span>}
        </p>
      </div>

      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(0.7) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        .msg-own   { animation: slideInRight 0.22s cubic-bezier(0.34,1.3,0.64,1); }
        .msg-other { animation: slideInLeft  0.22s cubic-bezier(0.34,1.3,0.64,1); }
      `}</style>
    </div>
  );
}
