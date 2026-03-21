import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_key') || '');
  const [keySet, setKeySet] = useState(() => !!localStorage.getItem('gemini_key'));
  const [keyError, setKeyError] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveKey = async () => {
    if (!apiKey.trim()) return;
    setKeyError('');
    // Quick test
    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      await model.generateContent('hi');
      localStorage.setItem('gemini_key', apiKey.trim());
      setKeySet(true);
    } catch (err) {
      setKeyError('Invalid key or quota exceeded. Try a new key from aistudio.google.com');
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages([...newMessages, { role: 'ai', text: '' }]);

    try {
      const genAI = new GoogleGenerativeAI(localStorage.getItem('gemini_key'));
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userMsg);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'ai',
            text: updated[updated.length - 1].text + text,
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'ai', text: '❌ ' + err.message };
        return updated;
      });
    }
    setLoading(false);
  };

  const clearChat = () => setMessages([]);

  if (!keySet) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100%', gap: '16px', color: 'white',
        padding: '24px',
      }}>
        <div style={{ fontSize: '56px' }}>🤖</div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>AI Assistant</h2>
        <p style={{ color: '#666', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
          Enter your free Gemini API key to start chatting with AI.{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#667eea', textDecoration: 'none' }}
          >
            Get one free here →
          </a>
        </p>

        <input
          value={apiKey}
          onChange={e => { setApiKey(e.target.value); setKeyError(''); }}
          onKeyDown={e => e.key === 'Enter' && saveKey()}
          type="password"
          placeholder="AIzaSy..."
          style={{
            background: '#1e1e32', color: 'white', border: '1px solid #2a2a3e',
            borderRadius: '12px', padding: '12px 16px', width: '320px',
            fontSize: '14px', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#667eea'}
          onBlur={e => e.target.style.borderColor = '#2a2a3e'}
        />

        {keyError && (
          <p style={{ color: '#ff6b6b', fontSize: '13px', textAlign: 'center', maxWidth: '320px' }}>
            {keyError}
          </p>
        )}

        <button
          onClick={saveKey}
          disabled={!apiKey.trim()}
          style={{
            background: apiKey.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#1e1e32',
            border: 'none', borderRadius: '12px', padding: '13px 28px',
            color: 'white', cursor: apiKey.trim() ? 'pointer' : 'default',
            fontWeight: '600', fontSize: '15px', transition: 'all 0.2s',
          }}
        >
          Start Chatting with AI →
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #1e1e32',
        background: '#0d0d1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div>
            <h2 style={{ color: 'white', margin: 0, fontSize: '16px', fontWeight: '700' }}>AI Assistant</h2>
            <p style={{ color: '#4CAF50', margin: 0, fontSize: '11px' }}>● Powered by Gemini</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearChat}
            style={{ background: 'none', border: '1px solid #2a2a3e', color: '#666', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
          >
            Clear
          </button>
          <button
            onClick={() => { setKeySet(false); localStorage.removeItem('gemini_key'); }}
            style={{ background: 'none', border: '1px solid #2a2a3e', color: '#666', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
          >
            Change Key
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#333', marginTop: '60px' }}>
            <p style={{ fontSize: '48px' }}>🤖</p>
            <p style={{ color: '#555', marginTop: '8px', fontSize: '16px' }}>Ask me anything!</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
              {['Explain quantum computing', 'Write a poem', 'Help me debug code', 'Plan my day'].map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  style={{
                    background: '#1e1e32', border: '1px solid #2a2a3e', color: '#888',
                    borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#2a2a3e'; e.currentTarget.style.color = '#888'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="message-enter"
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{
              maxWidth: '72%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                : '#1e1e32',
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.65',
              whiteSpace: 'pre-wrap',
              border: msg.role === 'user' ? 'none' : '1px solid #2a2a3e',
              wordBreak: 'break-word',
            }}>
              {msg.text || <span style={{ opacity: 0.6 }}>▋</span>}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {loading && messages[messages.length - 1]?.text === '' && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#1e1e32', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', display: 'flex', gap: '5px', border: '1px solid #2a2a3e' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%', background: '#667eea',
                  animation: `bounce 1s infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e1e32', background: '#0d0d1a' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask AI anything..."
            disabled={loading}
            style={{
              flex: 1, background: '#1e1e32', color: 'white', border: '1px solid #2a2a3e',
              borderRadius: '12px', padding: '11px 16px', fontSize: '14px', outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#2a2a3e'}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              background: !loading && input.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#1e1e32',
              border: 'none', borderRadius: '12px', padding: '11px 18px',
              color: 'white', cursor: !loading && input.trim() ? 'pointer' : 'default',
              fontSize: '16px', transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
