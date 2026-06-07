import { useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import useIsMobile from '../../hooks/useIsMobile';
import { useLang } from '../../i18n/LanguageContext';
import { requestNotificationPermission } from '../../utils/notify';

const MAX_LEN = 4000;
let notifPromptDone = false;

export default function MessageInput({ collectionPath, placeholder }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();
  const isMobile = useIsMobile();
  const { t } = useLang();
  const ph = placeholder ?? t('input.placeholder');

  const getCol = () => collection(db, ...collectionPath.split('/'));

  const send = async () => {
    if (!text.trim()) return;
    if (text.length > MAX_LEN) { toast.error(t('input.tooLong', { n: MAX_LEN })); return; }
    // Ask for notification permission once, off this user gesture.
    if (!notifPromptDone) {
      notifPromptDone = true;
      requestNotificationPermission().then((p) => {
        if (p === 'granted') toast.success(t('toast.notificationsOn'));
      });
    }
    const msg = text.trim();
    setText('');
    try {
      await addDoc(getCol(), {
        text: msg, uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        createdAt: serverTimestamp(), reactions: {},
      });
    } catch {
      setText(msg);
      toast.error(t('toast.sendFailed'));
    }
  };

  const canSend = text.trim().length > 0;

  return (
    <div className="msg-input-bar" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,11,20,0.95)', backdropFilter: 'blur(20px)', position: 'relative' }}>
      {showEmoji && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowEmoji(false)} />
          <div style={{ position: 'absolute', bottom: '76px', left: '12px', right: isMobile ? '12px' : 'auto', zIndex: 100 }}>
            <EmojiPicker theme="dark" height={360} width={isMobile ? '100%' : 340}
              onEmojiClick={(e) => { setText(t => t + e.emoji); setShowEmoji(false); inputRef.current?.focus(); }} />
          </div>
        </>
      )}

      <div style={{
        display: 'flex', gap: '10px', alignItems: 'center',
        background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        borderRadius: '18px', padding: '8px 8px 8px 16px',
        border: focused ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.25s ease',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
      }}>
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} style={{
          background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer',
          flexShrink: 0, lineHeight: 1, opacity: showEmoji ? 1 : 0.55, transition: 'all 0.2s',
        }}
          onMouseOver={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.15)'; }}
          onMouseOut={e => { e.currentTarget.style.opacity = showEmoji ? '1' : '0.55'; e.currentTarget.style.transform = 'none'; }}
        >😊</button>

        <input ref={inputRef} value={text} onChange={e => setText(e.target.value.slice(0, MAX_LEN))}
          maxLength={MAX_LEN}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={ph}
          style={{ flex: 1, background: 'none', color: '#f1f5f9', border: 'none', fontSize: '15px', fontWeight: '450', outline: 'none', letterSpacing: '0.1px', minWidth: 0 }}
        />

        <button onClick={send} disabled={!canSend} style={{
          background: canSend ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
          border: 'none', borderRadius: '13px', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: canSend ? 'white' : '#334155', cursor: canSend ? 'pointer' : 'default',
          fontSize: '16px', fontWeight: '700', transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          flexShrink: 0, transform: canSend ? 'scale(1)' : 'scale(0.9)',
          boxShadow: canSend ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
        }}
          onMouseOver={e => { if (canSend) { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.6)'; } }}
          onMouseOut={e => { if (canSend) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)'; } }}
        >➤</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#1e293b', fontWeight: '500', margin: 0 }}>
          {t('input.hint')}
        </p>
        {text.length > MAX_LEN * 0.85 && (
          <span style={{ fontSize: '11px', fontWeight: '700', color: text.length >= MAX_LEN ? '#f87171' : '#64748b' }}>
            {text.length}/{MAX_LEN}
          </span>
        )}
      </div>
    </div>
  );
}