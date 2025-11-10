import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listArticles } from '../api';

function getUsernameFromAuthor(auteurLike) {
  if (!auteurLike) return 'Auteur inconnu';
  if (typeof auteurLike === 'string') return auteurLike;        // si l’API renvoie déjà un string
  return auteurLike.username || auteurLike.email || 'Auteur inconnu';
}

export default function Articles(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { 
    (async () => {
      try { 
        const data = await listArticles(); 
        setItems(data.results || data); 
      }
      catch(e){ 
        setError(e?.detail || 'Erreur chargement'); 
      }
      finally{ 
        setLoading(false); 
      }
    })(); 
  }, []);

  if (loading) return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.3)'
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
        <h3 style={{
          color: '#2c3e50',
          fontSize: '1.5rem',
          margin: 0
        }}>Chargement des articles...</h3>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #ff6b6b',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
        <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>Erreur</h3>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 5px 15px rgba(231, 76, 60, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* En-tête */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '15px'
          }}>
            📰 Notre Blog
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#5d6d7e',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez nos derniers articles et actualités
          </p>
        </div>

        {/* Grille d'articles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {items.map(a => (
            <div 
              key={a.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              }}
            >
              {/* Image de l'article (si disponible) */}
              {a.image_url && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={a.image_url} 
                    alt={a.titre || a.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}

              {/* Contenu de l'article */}
              <div style={{
                padding: '30px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Titre */}
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  margin: '0 0 12px 0',
                  lineHeight: '1.3',
                  minHeight: '68px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  {a.titre || a.title}
                </h3>

                {/* Métadonnées */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {/* Statut */}
                  {a.statut && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      background: a.statut === 'publié' ? 
                        'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                        a.statut === 'brouillon' ? 
                        'linear-gradient(135deg, #f39c12, #e67e22)' :
                        'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      width: 'fit-content'
                    }}>
                      {a.statut === 'publié' ? '🟢' : a.statut === 'brouillon' ? '🟡' : '⚫'}
                      {a.statut.charAt(0).toUpperCase() + a.statut.slice(1)}
                    </div>
                  )}

                  {/* Date de publication (si disponible) */}
                  {a.date_publication && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#7f8c8d',
                      fontSize: '0.85rem'
                    }}>
                      📅 {new Date(a.date_publication).toLocaleDateString('fr-FR')}
                    </div>
                  )}

                  {/* Auteur (si disponible) */}
                  {a.auteur && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#7f8c8d',
                      fontSize: '0.85rem'
                    }}>
                      ✍️ Par {getUsernameFromAuthor(a.auteur ?? a.author)}
                    </div>
                  )}
                </div>

                {/* Extrait (si disponible) */}
                {a.extrait && (
                  <p style={{
                    color: '#5d6d7e',
                    lineHeight: '1.5',
                    fontSize: '0.95rem',
                    marginBottom: '20px',
                    flex: 1
                  }}>
                    {a.extrait.length > 120 ? `${a.extrait.substring(0, 120)}...` : a.extrait}
                  </p>
                )}

                {/* Bouton Lire */}
                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/articles/${a.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    📖 Lire l'article
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun article */}
        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Aucun article disponible</h3>
            <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
              Aucun article n'est disponible pour le moment.
            </p>
          </div>
        )}

        {/* Section newsletter (optionnelle) */}
        <div style={{
          background: 'linear-gradient(135deg, #3498db, #9b59b6)',
          borderRadius: '20px',
          padding: '40px',
          marginTop: '60px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>💌 Restez informé</h3>
          <p style={{ marginBottom: '25px', opacity: 0.9 }}>
            Recevez nos derniers articles directement dans votre boîte mail
          </p>
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <input
              type="email"
              placeholder="Votre email"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button style={{
              background: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#34495e';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#2c3e50';
              e.target.style.transform = 'translateY(0)';
            }}>
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}