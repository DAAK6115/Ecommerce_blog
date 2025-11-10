import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { confirmOrder } from '../api';

export default function Checkout(){
  const [orderId, setOrderId] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const id = Number(localStorage.getItem('orderId') || 0) || null;
    setOrderId(id);
  }, []);

  async function confirm(){
    setMsg(''); setErr('');
    if (!orderId) { setErr('Aucune commande en cours'); return; }
    try{
      await confirmOrder({ orderId });
      setMsg('Commande confirmée ✅');

      // reset local
      localStorage.removeItem('cartItems');
      localStorage.removeItem('orderId');

      setTimeout(() => nav('/products'), 1000);
    }catch(e){
      if (e?.code === 'STOCK_INSUFFISANT') {
        setErr(`Stock insuffisant pour: ${e?.produit || 'un article'}`);
      } else {
        setErr(e?.detail || 'Échec confirmation');
      }
    }
  }

  return (
    <div className="container">
      <h2>Paiement</h2>
      <p style={{opacity:.7}}>Simulation: clique pour confirmer la commande (le back décrémente le stock).</p>

      {!orderId && (
        <p>
          Aucune commande active. <Link to="/products" style={{color:'#5b73ff'}}>Voir les produits</Link>
        </p>
      )}

      <button
        onClick={confirm}
        disabled={!orderId}
        style={{
          background: orderId ? '#5b73ff' : '#c7ccd6',
          color:'#fff', border:'none', borderRadius:8, padding:'12px 16px',
          cursor: orderId ? 'pointer' : 'not-allowed'
        }}
      >
        Confirmer la commande
      </button>

      {msg && <p style={{color:'green', marginTop:10}}>{msg}</p>}
      {err && <p style={{color:'crimson', marginTop:10}}>{err}</p>}
    </div>
  );
}
