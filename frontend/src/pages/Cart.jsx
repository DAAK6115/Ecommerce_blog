import { useEffect, useState } from 'react';
import { confirmOrder } from '../api';

export default function Cart(){
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('cartItems') || '[]')); }
    catch { setItems([]); }
    const id = Number(localStorage.getItem('orderId') || 0) || null;
    setOrderId(id);
  }, []);

  const total = items.reduce((s, it) => s + Number(it.prix || 0) * Number(it.qty || 0), 0);

  function save(itemsNext){
    setItems(itemsNext);
    localStorage.setItem('cartItems', JSON.stringify(itemsNext));
  }

  function inc(id){ save(items.map(it => it.id===id ? {...it, qty: (it.qty||1)+1} : it)); }
  function dec(id){ save(items.map(it => it.id===id ? {...it, qty: Math.max(1,(it.qty||1)-1)} : it)); }
  function remove(id){ save(items.filter(it => it.id!==id)); }

  async function confirm(){
    setMsg(''); setErr('');
    if (!orderId) { setErr('Aucune commande en cours'); return; }
    
    setConfirming(true);
    try{
      await confirmOrder({ orderId });

      setMsg('🎉 Commande confirmée avec succès ! Votre colis sera expédié rapidement.');
      // reset local après succès
      localStorage.removeItem('cartItems');
      localStorage.removeItem('orderId');
      setItems([]); 
      setOrderId(null);
    }catch(e){
      if (e?.code === 'STOCK_INSUFFISANT') {
        setErr(`❌ Stock insuffisant pour: ${e?.produit || 'un article'}`);
      } else {
        setErr(e?.detail || '❌ Échec de la confirmation de commande');
      }
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1000px',
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
            🛒 Mon Panier
          </h1>
          {orderId ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #3498db, #2980b9)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              📋 Commande #{orderId}
            </div>
          ) : (
            <p style={{
              color: '#7f8c8d',
              fontSize: '1.1rem'
            }}>
              Aucune commande en cours
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '80px 40px',
            borderRadius: '24px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🛒</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.8rem' }}>
              Votre panier est vide
            </h3>
            <p style={{ color: '#7f8c8d', fontSize: '1.1rem', marginBottom: '30px' }}>
              Explorez nos produits et ajoutez des articles à votre panier
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              style={{
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 10px 25px rgba(52, 152, 219, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🛍️ Découvrir les produits
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            alignItems: 'start'
          }}>
            
            {/* Liste des articles */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <h3 style={{
                  color: '#2c3e50',
                  marginBottom: '25px',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  📦 Articles dans votre panier ({items.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map(it => (
                    <div 
                      key={it.id} 
                      style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '16px',
                        border: '1px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#f8f9fa';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {/* Image */}
                      {it.image_url && (
                        <img 
                          src={it.image_url} 
                          alt={it.nom}
                          style={{
                            width: '100px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            flexShrink: 0
                          }}
                        />
                      )}
                      
                      {/* Informations produit */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          color: '#2c3e50',
                          margin: '0 0 8px 0',
                          fontSize: '1.2rem',
                          fontWeight: '600'
                        }}>
                          {it.nom}
                        </h4>
                        <div style={{
                          fontSize: '1.3rem',
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {Number(it.prix).toLocaleString()} FCFA
                        </div>
                      </div>

                      {/* Contrôles quantité */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: 'white',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: '2px solid #e9ecef'
                        }}>
                          <button 
                            onClick={() => dec(it.id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#c0392b';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#e74c3c';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: '#2c3e50',
                            minWidth: '30px',
                            textAlign: 'center'
                          }}>
                            {it.qty}
                          </span>
                          <button 
                            onClick={() => inc(it.id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              background: '#2ecc71',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#27ae60';
                              e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#2ecc71';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => remove(it.id)}
                          style={{
                            background: 'transparent',
                            color: '#e74c3c',
                            border: '1px solid #e74c3c',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#e74c3c';
                            e.target.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#e74c3c';
                          }}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{
                color: '#2c3e50',
                marginBottom: '25px',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                💰 Récapitulatif
              </h3>

              <div style={{ marginBottom: '25px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <span style={{ color: '#5d6d7e', fontSize: '1.1rem' }}>Sous-total:</span>
                  <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '1.1rem' }}>
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <span style={{ color: '#5d6d7e', fontSize: '1.1rem' }}>Livraison:</span>
                  <span style={{ fontWeight: '600', color: '#27ae60', fontSize: '1.1rem' }}>
                    Offerte
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                  borderRadius: '12px'
                }}>
                  <span style={{ color: '#2c3e50', fontSize: '1.2rem', fontWeight: '600' }}>Total:</span>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <button 
                onClick={confirm}
                disabled={confirming}
                style={{
                  width: '100%',
                  background: confirming ? 
                    'linear-gradient(135deg, #95a5a6, #7f8c8d)' : 
                    'linear-gradient(135deg, #2ecc71, #27ae60)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 24px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: confirming ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: confirming ? 'none' : '0 6px 20px rgba(46, 204, 113, 0.4)'
                }}
                onMouseOver={(e) => {
                  if (!confirming) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(46, 204, 113, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!confirming) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(46, 204, 113, 0.4)';
                  }
                }}
              >
                {confirming ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Confirmation en cours...
                  </>
                ) : (
                  <>
                    ✅ Confirmer la commande
                  </>
                )}
              </button>

              {/* Avantages */}
              <div style={{
                marginTop: '25px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1))',
                borderRadius: '12px',
                border: '1px solid rgba(52, 152, 219, 0.2)'
              }}>
                <h4 style={{ color: '#2c3e50', marginBottom: '12px', fontSize: '1rem' }}>
                  🛡️ Avantages
                </h4>
                <div style={{ color: '#5d6d7e', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  • Paiement 100% sécurisé<br/>
                  • Livraison gratuite<br/>
                  • Retour sous 30 jours
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {msg && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
            color: '#155724',
            borderRadius: '12px',
            border: '1px solid #c3e6cb',
            fontWeight: '500',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}>
            {msg}
          </div>
        )}
        {err && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
            color: '#721c24',
            borderRadius: '12px',
            border: '1px solid #f5c6cb',
            fontWeight: '500',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}>
            {err}
          </div>
        )}
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