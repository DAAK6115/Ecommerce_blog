import { useState } from 'react';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    username: '',
    password: ''
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function upd(k, v) {
    setForm(s => ({ ...s, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    setLoading(true);
    
    try {
      await register({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        username: form.username,
        password: form.password
      });
      setMsg("🎉 Inscription réussie ! Vérifiez votre email pour activer votre compte.");
      setForm({ nom: '', prenom: '', email: '', username: '', password: '' });
    } catch (e) {
      setErr(e?.detail || '❌ Erreur lors de l\'inscription');
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
        maxWidth: '500px',
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
            <span style={{ fontSize: '2.5rem' }}>👤</span>
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            Créer un compte
          </h1>
          <p style={{
            color: '#5d6d7e',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Rejoignez notre communauté dès aujourd'hui
          </p>
        </div>

        {/* Messages */}
        {msg && (
          <div style={{
            padding: '18px',
            background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
            color: '#155724',
            borderRadius: '12px',
            border: '1px solid #c3e6cb',
            fontWeight: '500',
            textAlign: 'center',
            fontSize: '1rem',
            marginBottom: '25px'
          }}>
            {msg}
          </div>
        )}
        {err && (
          <div style={{
            padding: '18px',
            background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
            color: '#721c24',
            borderRadius: '12px',
            border: '1px solid #f5c6cb',
            fontWeight: '500',
            textAlign: 'center',
            fontSize: '1rem',
            marginBottom: '25px'
          }}>
            {err}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Ligne Nom/Prénom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{
                display: 'block',
                color: '#2c3e50',
                fontWeight: '600',
                marginBottom: '8px',
                fontSize: '0.95rem'
              }}>
                📝 Nom
              </label>
              <input
                placeholder="Votre nom"
                value={form.nom}
                onChange={e => upd('nom', e.target.value)}
                required
                style={{
                  width: '100%',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#2c3e50',
                fontWeight: '600',
                marginBottom: '8px',
                fontSize: '0.95rem'
              }}>
                👤 Prénom
              </label>
              <input
                placeholder="Votre prénom"
                value={form.prenom}
                onChange={e => upd('prenom', e.target.value)}
                required
                style={{
                  width: '100%',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Nom d'utilisateur */}
          <div>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              🆔 Nom d'utilisateur
            </label>
            <input
              placeholder="Choisissez un nom d'utilisateur"
              value={form.username}
              onChange={e => upd('username', e.target.value)}
              required
              style={{
                width: '100%',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              📧 Email
            </label>
            <input
              placeholder="votre@email.com"
              type="email"
              value={form.email}
              onChange={e => upd('email', e.target.value)}
              required
              style={{
                width: '100%',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label style={{
              display: 'block',
              color: '#2c3e50',
              fontWeight: '600',
              marginBottom: '8px',
              fontSize: '0.95rem'
            }}>
              🔒 Mot de passe
            </label>
            <input
              placeholder="Créez un mot de passe sécurisé"
              type="password"
              value={form.password}
              onChange={e => upd('password', e.target.value)}
              required
              style={{
                width: '100%',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 
                'linear-gradient(135deg, #95a5a6, #7f8c8d)' : 
                'linear-gradient(135deg, #2ecc71, #27ae60)',
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
              boxShadow: loading ? 'none' : '0 6px 20px rgba(46, 204, 113, 0.4)',
              marginTop: '10px'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 10px 25px rgba(46, 204, 113, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.4)';
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
                Création du compte...
              </>
            ) : (
              <>
                ✨ Créer mon compte
              </>
            )}
          </button>
        </form>

        {/* Lien de connexion */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '25px',
          borderTop: '1px solid #e9ecef'
        }}>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1rem',
            margin: '0 0 15px 0'
          }}>
            Déjà un compte ?
          </p>
          <a 
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              color: '#3498db',
              border: '2px solid #3498db',
              padding: '12px 24px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#3498db';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3498db';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🔑 Se connecter
          </a>
        </div>

        {/* Informations de sécurité */}
        <div style={{
          marginTop: '25px',
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
            🛡️ Vos données sont sécurisées et cryptées
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