import { Fragment, useEffect, useRef } from 'react';
import Message from './Message';
import DateSeparator from './DateSeparator';
import { dayKey, dayLabel } from '../../utils/date';

// Scrollable message list shared by ChatRoom and DMChat.
// Renders day separators and auto-scrolls to the latest message.
export default function MessageList({ messages, collectionPath, loaded, emptyState }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
