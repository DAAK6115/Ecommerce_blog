import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '../api';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try { 
        const data = await listProducts(); 
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
        }}>Chargement des produits...</h3>
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
            Nos Produits
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#5d6d7e',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez notre sélection exclusive de produits de qualité
          </p>
        </div>

        {/* Grille de produits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {items.map(p => (
            <div 
              key={p.id}
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
              {/* Image du produit */}
              {p.image_url && (
                <div style={{
                  width: '100%',
                  height: '220px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={p.image_url} 
                    alt={p.nom || p.name} 
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

              {/* Contenu du produit */}
              <div style={{
                padding: '25px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* En-tête avec nom et statut */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    margin: 0,
                    flex: 1,
                    lineHeight: '1.3'
                  }}>
                    {p.nom || p.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      background: p.actif ? 
                        'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                        'linear-gradient(135deg, #e74c3c, #c0392b)',
                      color: 'white',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {p.actif ? '🟢 Actif' : '🔴 Inactif'}
                  </span>
                </div>

                {/* Prix */}
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#3498db',
                  margin: '10px 0',
                  background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {(p.prix ?? p.price)?.toLocaleString()} FCFA
                </p>

                {/* Stock */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    fontSize: '0.9rem',
                    color: '#7f8c8d'
                  }}>📦 Stock:</span>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: p.stock > 10 ? '#27ae60' : p.stock > 0 ? '#f39c12' : '#e74c3c'
                  }}>
                    {p.stock} unité{p.stock > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Bouton Voir */}
                <div style={{ marginTop: 'auto' }}>
                  <Link 
                    to={`/products/${p.id}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '1rem',
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
                    👀 Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun produit */}
        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Aucun produit disponible</h3>
            <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
              Aucun produit n'est disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}