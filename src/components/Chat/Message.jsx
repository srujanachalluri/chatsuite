import { useState, useRef } from 'react';
import { doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import toast from 'react-hot-toast';
import useIsMobile from '../../hooks/useIsMobile';
import { useLang } from '../../i18n/LanguageContext';
import { formatText } from '../../utils/formatText';
import MessageMenu from './MessageMenu';

const MAX_LEN = 4000;

export default function Message({ msg, collectionPath }) {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);
  const isMobile = useIsMobile();
  const longPressTimer = useRef(null);
  const isOwn = msg.uid === auth.currentUser?.uid;
  const reactions = msg.reactions || {};
  const uid = auth.currentUser?.uid;
  const myReactions = Object.entries(reactions).filter(([, u]) => u.includes(uid)).map(([e]) => e);

  const msgRef = () => doc(db, ...collectionPath.split('/'), msg.id);

  const react = async (emoji) => {
    setMenuOpen(false);
    const ref = msgRef();
    const current = reactions[emoji] || [];
    if (current.includes(uid)) {
      await updateDoc(ref, { [`reactions.${emoji}`]: arrayRemove(uid) });
    } else {
      await updateDoc(ref, { [`reactions.${emoji}`]: arrayUnion(uid) });
    }
  };

  const copy = async () => {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(msg.text);
      toast.success(t('toast.copied'));
    } catch {
      toast.error(t('toast.copyFailed'));
    }
  };

  const startEdit = () => { setEditText(msg.text); setEditing(true); setMenuOpen(false); };

  const saveEdit = async () => {
    const next = editText.trim();
    if (!next) return;
    if (next === msg.text) { setEditing(false); return; }
    try {
      await updateDoc(msgRef(), { text: next.slice(0, MAX_LEN), editedAt: serverTimestamp() });
      toast.success(t('toast.msgUpdated'));
    } catch {
      toast.error(t('toast.msgUpdateFailed'));
    }
    setEditing(false);
  };

  const remove = async () => {
    setMenuOpen(false);
    try {
      await deleteDoc(msgRef());
      toast.success(t('toast.msgDeleted'));
    } catch {
      toast.error(t('toast.msgDeleteFailed'));
    }
  };

  // Long-press to open the menu on touch devices.
  const onTouchStart = () => {
    longPressTimer.current = setTimeout(() => setMenuOpen(true), 400);
  };
  const cancelLongPress = () => clearTimeout(longPressTimer.current);

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

        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={isMobile ? onTouchStart : undefined}
          onTouchEnd={isMobile ? cancelLongPress : undefined}
          onTouchMove={isMobile ? cancelLongPress : undefined}
        >
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={editText}
                autoFocus
                maxLength={MAX_LEN}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                  if (e.key === 'Escape') { setEditText(msg.text); setEditing(false); }
                }}
                rows={2}
                style={{
                  background: '#13132a', color: '#f1f5f9', border: '1px solid rgba(99,102,241,0.5)',
                  borderRadius: '14px', padding: '10px 14px', fontSize: '15px', outline: 'none',
                  resize: 'vertical', minWidth: '200px', lineHeight: 1.5, fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                <button onClick={() => { setEditText(msg.text); setEditing(false); }} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', borderRadius: '10px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>{t('edit.cancel')}</button>
                <button onClick={saveEdit} style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
                  color: 'white', borderRadius: '10px', padding: '6px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                }}>{t('edit.save')}</button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isMobile && setMenuOpen(o => !o)}
              style={{
                background: isOwn ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.07)',
                color: '#f1f5f9', padding: '12px 16px',
                borderRadius: isOwn ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                fontSize: '15px', fontWeight: '450', lineHeight: '1.6',
                wordBreak: 'break-word', whiteSpace: 'pre-wrap', cursor: 'pointer',
                border: isOwn ? 'none' : '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: isOwn ? '0 4px 20px rgba(99,102,241,0.35)' : '0 2px 12px rgba(0,0,0,0.25)',
                userSelect: 'text',
              }}>
              {formatText(msg.text)}
            </div>
          )}

          {/* Desktop hover trigger */}
          {hovered && !menuOpen && !editing && !isMobile && (
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(true); }}
              aria-label="Message actions"
              style={{
                position: 'absolute', top: '-10px', [isOwn ? 'left' : 'right']: '-10px',
                width: '28px', height: '28px', borderRadius: '50%', zIndex: 25,
                background: '#1e1e32', border: '1px solid rgba(255,255,255,0.12)',
                color: '#c7d2fe', cursor: 'pointer', fontSize: '15px', lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              }}
            >⋯</button>
          )}

          {menuOpen && !editing && (
            <MessageMenu
              isOwn={isOwn}
              isMobile={isMobile}
              myReactions={myReactions}
              onReact={react}
              onCopy={copy}
              onEdit={startEdit}
              onDelete={remove}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>

        {Object.entries(reactions).filter(([, u]) => u.length > 0).length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginTop: '7px', flexWrap: 'wrap' }}>
            {Object.entries(reactions).filter(([, u]) => u.length > 0).map(([emoji, uids]) => {
              const mine = uids.includes(uid);
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
          {time}{msg.editedAt && <span style={{ fontStyle: 'italic', opacity: 0.8 }}> · {t('msg.edited')}</span>}
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
