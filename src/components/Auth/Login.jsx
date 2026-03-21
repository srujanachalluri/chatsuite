import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';

export default function Login() {
  const signIn = () => signInWithPopup(auth, provider);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0b0b14', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 65%)', animation: 'pulse 4s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 65%)', animation: 'pulse 5s ease-in-out infinite 1s', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', right: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.06) 0%, transparent 65%)', animation: 'pulse 6s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      <div className="fade-up" style={{
        textAlign: 'center', padding: '56px 48px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(40px)',
        maxWidth: '440px', width: '90%',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '22px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 28px',
          boxShadow: '0 12px 40px rgba(102,126,234,0.5)',
          animation: 'glow 3s ease-in-out infinite',
        }}>💬</div>

        <h1 style={{
          fontSize: '2.6rem', marginBottom: '10px', fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.8px', lineHeight: 1.1,
        }}>ChatifyPro</h1>

        <p style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '16px', fontWeight: '500', lineHeight: 1.5 }}>
          Chat with friends · Create rooms · Talk to AI
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['⚡ Real-time', '🤖 AI Chat', '😊 Reactions'].map(f => (
            <span key={f} style={{
              background: 'rgba(102,126,234,0.12)', border: '1px solid rgba(102,126,234,0.2)',
              borderRadius: '20px', padding: '4px 12px', fontSize: '12px',
              color: '#a5b4fc', fontWeight: '600',
            }}>{f}</span>
          ))}
        </div>

        <button
          onClick={signIn}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'white', color: '#0f0f1a',
            border: 'none', padding: '16px 32px',
            borderRadius: '16px', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer', margin: '0 auto',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            letterSpacing: '-0.2px',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)'; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ color: '#334155', fontSize: '12px', marginTop: '24px' }}>
          Secure sign-in · No password needed
        </p>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes glow  { 0%,100%{box-shadow:0 12px 40px rgba(102,126,234,0.5)} 50%{box-shadow:0 12px 60px rgba(102,126,234,0.8)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeInUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
      `}</style>
    </div>
  );
}