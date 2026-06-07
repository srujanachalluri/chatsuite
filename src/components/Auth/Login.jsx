import { signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, provider, facebookProvider } from '../../firebase';
import { useLang } from '../../i18n/LanguageContext';
import LanguageToggle from '../LanguageToggle';

export default function Login() {
  const { t } = useLang();

  const signInWith = async (authProvider) => {
    try {
      await signInWithPopup(auth, authProvider);
    } catch (err) {
      if (err?.code === 'auth/account-exists-with-different-credential') {
        toast.error(t('login.accountExists'));
      } else if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // user dismissed — no toast
      } else {
        toast.error(t('login.signInFailed'));
      }
    }
  };

  const signIn = () => signInWith(provider);
  const signInFacebook = () => signInWith(facebookProvider);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100dvh', background: '#0b0b14', overflow: 'hidden', position: 'relative', padding: '16px',
    }}>
      <div style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 2 }}>
        <LanguageToggle />
      </div>
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.12) 0%, transparent 65%)', animation: 'pulse 4s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,75,162,0.1) 0%, transparent 65%)', animation: 'pulse 5s ease-in-out infinite 1s', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', right: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,209,197,0.06) 0%, transparent 65%)', animation: 'pulse 6s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      <div className="fade-up" style={{
        textAlign: 'center', padding: 'clamp(32px, 6vw, 56px) clamp(24px, 5vw, 48px)',
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
          fontSize: 'clamp(2rem, 7vw, 2.6rem)', marginBottom: '10px', fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.8px', lineHeight: 1.1,
        }}>ChatSuite</h1>

        <p style={{ color: '#94a3b8', marginBottom: '8px', fontSize: '16px', fontWeight: '500', lineHeight: 1.5 }}>
          {t('login.tagline')}
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[t('login.feature.realtime'), t('login.feature.ai'), t('login.feature.reactions')].map(f => (
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
          {t('login.continueGoogle')}
        </button>

        <button
          onClick={signInFacebook}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
            background: '#1877F2', color: 'white',
            border: 'none', padding: '14px 32px', marginTop: '14px',
            borderRadius: '16px', fontSize: '15px', fontWeight: '700',
            cursor: 'pointer', margin: '14px auto 0',
            boxShadow: '0 4px 24px rgba(24,119,242,0.35)',
            transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.12 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
          </svg>
          {t('login.continueFacebook')}
        </button>

        <p style={{ color: '#334155', fontSize: '12px', marginTop: '24px' }}>
          {t('login.secure')}
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