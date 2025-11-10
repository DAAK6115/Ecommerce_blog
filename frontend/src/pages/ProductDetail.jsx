import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, createOrder, addOrderLine } from '../api';

export default function ProductDetail(){
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    (async () => {
      setLoading(true);
      try { 
        const prod = await getProduct(id); 
        setP(prod); 
        setQty(1); 
      }
      catch(e){ 
        setErr(e?.detail || 'Produit introuvable'); 
      }
      finally {
        setLoading(false);
      }
    })(); 
  }, [id]);

  function getOrderId(){ return Number(localStorage.getItem('orderId') || 0) || null; }
  function setOrderId(val){ localStorage.setItem('orderId', String(val)); }
  function getCart(){ try { return JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch{ return []; } }
  function setCart(items){ localStorage.setItem('cartItems', JSON.stringify(items)); }

  async function addToCart(){
    setMsg(''); setErr('');
    try{
      let orderId = getOrderId();
      if (!orderId) {
        const order = await createOrder();
        orderId = order.id;
        setOrderId(orderId);
      }
      await addOrderLine({ orderId, productId: Number(id), quantity: Number(qty) });

      const items = getCart();
      const idx = items.findIndex(it => it.id === Number(id));
      if (idx >= 0) items[idx].qty += Number(qty);
      else items.push({
        id: Number(id),
        nom: p.nom || p.name,
        prix: p.prix ?? p.price ?? 0,
        qty: Number(qty),
        image_url: p.image_url || null
      });
      setCart(items);

      setMsg('✅ Produit ajouté au panier avec succès !');
    }catch(e){
      setErr(e?.detail || '❌ Échec de l\'ajout au panier (authentification requise)');
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
        <h3 style={{ color: '#2c3e50', margin: 0 }}>Chargement du produit...</h3>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!p) return (
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
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        border: '1px solid #ff6b6b'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
        <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>Produit non trouvé</h3>
        <p style={{ color: '#7f8c8d' }}>{err}</p>
      </div>
    </div>
  );

  const price = (p.prix ?? p.price) || 0;
  const stock = Number(p.stock ?? 0);
  const out = stock <= 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'start'
      }}>
        
        {/* Section Image */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          textAlign: 'center'
        }}>
          {p.image_url ? (
            <img 
              src={p.image_url} 
              alt={p.nom || p.name}
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '300px',
              background: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem'
            }}>
              📷
            </div>
          )}
        </div>

        {/* Section Informations */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          {/* En-tête */}
          <div style={{ marginBottom: '25px' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#2c3e50',
              margin: '0 0 10px 0',
              lineHeight: '1.2'
            }}>
              {p.nom || p.name}
            </h1>
            
            {/* Prix */}
            <div style={{
              fontSize: '2.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3498db, #9b59b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '15px'
            }}>
              {price.toLocaleString()} FCFA
            </div>

            {/* Statut Stock */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: out ? 
                'linear-gradient(135deg, #e74c3c, #c0392b)' : 
                'linear-gradient(135deg, #2ecc71, #27ae60)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {out ? '🔴 Rupture de stock' : `🟢 Stock: ${stock} unité${stock > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Description */}
          {p.description && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: '#2c3e50',
                marginBottom: '12px',
                fontSize: '1.2rem'
              }}>📝 Description</h3>
              <p style={{
                color: '#5d6d7e',
                lineHeight: '1.6',
                fontSize: '1.1rem',
                margin: 0
              }}>
                {p.description}
              </p>
            </div>
          )}

          {/* Section Achat */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '20px',
              fontSize: '1.3rem'
            }}>🛒 Ajouter au panier</h3>

            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <label style={{
                  color: '#5d6d7e',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>Quantité:</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, stock)}
                  value={qty}
                  onChange={e => setQty(Math.min(Math.max(1, Number(e.target.value || 1)), Math.max(1, stock)))}
                  style={{
                    width: '100px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={out}
                />
              </div>

              <button
                onClick={addToCart}
                disabled={out}
                style={{
                  background: out ? 
                    'linear-gradient(135deg, #95a5a6, #7f8c8d)' : 
                    'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '15px 30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: out ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: out ? 'none' : '0 6px 20px rgba(52, 152, 219, 0.4)'
                }}
                onMouseOver={(e) => {
                  if (!out) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(52, 152, 219, 0.6)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!out) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                  }
                }}
              >
                {out ? '❌ Indisponible' : '🛒 Ajouter au panier'}
              </button>
            </div>

            {/* Messages */}
            {msg && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
                color: '#155724',
                borderRadius: '10px',
                border: '1px solid #c3e6cb',
                fontWeight: '500'
              }}>
                {msg}
              </div>
            )}
            {err && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
                color: '#721c24',
                borderRadius: '10px',
                border: '1px solid #f5c6cb',
                fontWeight: '500'
              }}>
                {err}
              </div>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div style={{
            marginTop: '25px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1))',
            borderRadius: '12px',
            border: '1px solid rgba(52, 152, 219, 0.2)'
          }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>ℹ️ Informations</h4>
            <div style={{ color: '#5d6d7e', fontSize: '0.95rem', lineHeight: '1.5' }}>
              • Paiement 100% sécurisé<br/>
              • Livraison rapide sous 24-48h<br/>
              • Retour facile sous 30 jours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}