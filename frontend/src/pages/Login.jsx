import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const u = await login(email, password);
      if (u?.is_staff) {
        nav('/admin');
      } else {
        nav('/');
      }
    } catch(err){
      setError(err?.detail || '❌ Identifiants invalides');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        padding: '50px 40px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* En-tête */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3498db, #9b59b6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 25px rgba(52, 152, 219, 0.3)'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🔑</span>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            Connexion
          </h1>
          <p style={{
            color: '#5d6d7e',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Accédez à votre espace personnel
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            padding: '18px',
            background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
            color: '#721c24',
            borderRadius: '12px',
            border: '1px solid #f5c6cb',
            fontWeight: '500',
            textAlign: 'center',
            fontSize: '1rem',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Champ Email */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '10px',
              fontSize: '1rem'
            }}>
              📧 Email
            </label>
            <input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="votre@email.com" 
              type="email" 
              required 
              disabled={loading}
              style={{
                width: '100%',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '16px 18px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box',
                background: loading ? '#f8f9fa' : 'white'
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '10px',
              fontSize: '1rem'
            }}>
              🔒 Mot de passe
            </label>
            <input 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Votre mot de passe" 
              type="password" 
              required 
              disabled={loading}
              style={{
                width: '100%',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '16px 18px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box',
                background: loading ? '#f8f9fa' : 'white'
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Bouton de connexion */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 
                'linear-gradient(135deg, #95a5a6, #7f8c8d)' : 
                'linear-gradient(135deg, #3498db, #2980b9)',
              color: 'white',
              border: 'none',
              padding: '18px 24px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(52, 152, 219, 0.4)',
              marginTop: '10px'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 10px 25px rgba(52, 152, 219, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Connexion...
              </>
            ) : (
              <>
                🚀 Se connecter
              </>
            )}
          </button>
        </form>

        {/* Séparateur */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '30px 0',
          color: '#bdc3c7'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
          <span style={{ padding: '0 15px', fontSize: '0.9rem' }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
        </div>

        {/* Lien d'inscription */}
        <div style={{
          textAlign: 'center'
        }}>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1rem',
            margin: '0 0 20px 0'
          }}>
            Pas encore de compte ?
          </p>
          <a 
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              color: '#2ecc71',
              border: '2px solid #2ecc71',
              padding: '14px 28px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#2ecc71';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#2ecc71';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            ✨ Créer un compte
          </a>
        </div>

        {/* Informations de sécurité */}
        <div style={{
          marginTop: '30px',
          padding: '18px',
          background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1))',
          borderRadius: '12px',
          border: '1px solid rgba(52, 152, 219, 0.2)',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#5d6d7e',
            fontSize: '0.9rem',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            🛡️ Connexion sécurisée
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}