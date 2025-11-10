import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api";

export default function Profile() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", actif: true });
  const [dateInscription, setDateInscription] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  function upd(k, v) { setForm(s => ({ ...s, [k]: v })); }

  useEffect(() => {
    (async () => {
      setErr(""); setMsg("");
      try {
        const p = await getProfile();
        setForm({ nom: p.nom || "", prenom: p.prenom || "", email: p.email || "", actif: !!p.actif });
        setDateInscription(p.date_inscription || "");
      } catch (e) {
        setErr(e?.detail || "Erreur chargement profil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    setSaving(true);
    try {
      const saved = await updateProfile(form);
      setForm({ nom: saved.nom || "", prenom: saved.prenom || "", email: saved.email || "", actif: !!saved.actif });
      setDateInscription(saved.date_inscription || dateInscription);
      setMsg("✅ Profil mis à jour avec succès !");
    } catch (e) {
      const d = e?.email?.[0] || e?.detail;
      setErr(d || "❌ Échec de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h3 style={{ color: '#2c3e50', margin: 0 }}>Chargement du profil...</h3>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        
        {/* En-tête */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            👤 Mon Profil
          </h1>
          <p style={{
            color: '#5d6d7e',
            fontSize: '1.1rem'
          }}>
            Gérez vos informations personnelles
          </p>
        </div>

        {/* Carte du formulaire */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <form onSubmit={onSubmit}>
            {/* Avatar et statut */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '2px solid #f8f9fa'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem',
                boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)'
              }}>
                {(form.prenom.charAt(0) + form.nom.charAt(0)).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: '#2c3e50',
                  margin: '0 0 8px 0',
                  fontSize: '1.5rem'
                }}>
                  {form.prenom} {form.nom}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: form.actif ? '#2ecc71' : '#e74c3c',
                    borderRadius: '50%',
                    animation: form.actif ? 'pulse 2s infinite' : 'none'
                  }}></div>
                  <span style={{
                    color: form.actif ? '#27ae60' : '#e74c3c',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {form.actif ? '🟢 Compte actif' : '🔴 Compte inactif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Champs du formulaire */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Prénom */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  👤 Prénom
                </label>
                <input
                  placeholder="Votre prénom"
                  value={form.prenom}
                  onChange={e => upd("prenom", e.target.value)}
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 18px',
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

              {/* Nom */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '1rem'
                }}>
                  📝 Nom
                </label>
                <input
                  placeholder="Votre nom"
                  value={form.nom}
                  onChange={e => upd("nom", e.target.value)}
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 18px',
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
                  fontSize: '1rem'
                }}>
                  📧 Email
                </label>
                <input
                  placeholder="votre@email.com"
                  type="email"
                  value={form.email}
                  onChange={e => upd("email", e.target.value)}
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '15px 18px',
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

              {/* Statut actif */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '1rem',
                  flex: 1
                }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="checkbox"
                      checked={!!form.actif}
                      onChange={e => upd("actif", e.target.checked)}
                      style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <span>🎯 Statut du compte</span>
                </label>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: form.actif ? 
                    'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                    'linear-gradient(135deg, #e74c3c, #c0392b)',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {form.actif ? 'ACTIF' : 'INACTIF'}
                </div>
              </div>

              {/* Date d'inscription */}
              {dateInscription && (
                <div style={{
                  padding: '18px',
                  background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1))',
                  borderRadius: '12px',
                  border: '1px solid rgba(52, 152, 219, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    color: '#2c3e50',
                    fontWeight: '600',
                    marginBottom: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    📅 Date d'inscription
                  </div>
                  <div style={{
                    color: '#5d6d7e',
                    fontSize: '1rem'
                  }}>
                    {new Date(dateInscription).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}

              {/* Bouton de sauvegarde */}
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: '100%',
                  background: saving ? 
                    'linear-gradient(135deg, #95a5a6, #7f8c8d)' : 
                    'linear-gradient(135deg, #3498db, #2980b9)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 24px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: saving ? 'none' : '0 6px 20px rgba(52, 152, 219, 0.4)',
                  marginTop: '10px'
                }}
                onMouseOver={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(52, 152, 219, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                  }
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sauvegarde en cours...
                  </>
                ) : (
                  <>
                    💾 Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Messages */}
          {msg && (
            <div style={{
              marginTop: '25px',
              padding: '18px',
              background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
              color: '#155724',
              borderRadius: '12px',
              border: '1px solid #c3e6cb',
              fontWeight: '500',
              textAlign: 'center',
              fontSize: '1rem'
            }}>
              {msg}
            </div>
          )}
          {err && (
            <div style={{
              marginTop: '25px',
              padding: '18px',
              background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
              color: '#721c24',
              borderRadius: '12px',
              border: '1px solid #f5c6cb',
              fontWeight: '500',
              textAlign: 'center',
              fontSize: '1rem'
            }}>
              {err}
            </div>
          )}
        </div>

        {/* Informations de sécurité */}
        <div style={{
          marginTop: '30px',
          background: 'white',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.3)',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            🛡️ Sécurité
          </h4>
          <p style={{ color: '#7f8c8d', fontSize: '0.95rem', margin: 0 }}>
            Vos informations personnelles sont sécurisées et cryptées.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}