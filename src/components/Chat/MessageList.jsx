import { Fragment, useEffect, useRef } from 'react';
import { auth } from '../../firebase';
import Message from './Message';
import DateSeparator from './DateSeparator';
import { dayKey, dayLabel } from '../../utils/date';
import { showNotification } from '../../utils/notify';

// Scrollable message list shared by ChatRoom and DMChat.
// Renders day separators and auto-scrolls to the latest message.
export default function MessageList({ messages, collectionPath, loaded, emptyState }) {
  const bottomRef = useRef();
  const lastNotifiedId = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Notify on new incoming messages when the tab is in the background.
  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (!initialized.current) {
      initialized.current = true;
      lastNotifiedId.current = last.id;
      return;
    }
    if (last.id !== lastNotifiedId.current) {
      lastNotifiedId.current = last.id;
      if (last.uid !== auth.currentUser?.uid) {
        showNotification(last.displayName || 'New message', last.text);
      }
    }
  }, [messages]);

  // Reset notification tracking when switching conversations.
  useEffect(() => {
    initialized.current = false;
    lastNotifiedId.current = null;
  }, [collectionPath]);

  let lastKey = null;

  return (
    <div className="msg-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      {loaded && messages.length === 0 ? emptyState : messages.map((msg) => {
        const key = dayKey(msg.createdAt);
        const showSeparator = key && key !== lastKey;
        if (key) lastKey = key;
        return (
          <Fragment key={msg.id}>
            {showSeparator && <DateSeparator label={dayLabel(msg.createdAt)} />}
            <Message msg={msg} collectionPath={collectionPath} />
          </Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
