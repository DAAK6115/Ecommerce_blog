import { useState } from "react";
import AdminProducts from "./ProductsAdmin";
import AdminArticles from "./ArticlesAdmin";

export default function AdminDashboard() {
  const [tab, setTab] = useState("products"); // "products" | "articles"

  const tabs = [
    { id: "products", label: "🛍️ Produits", icon: "🛍️" },
    { id: "articles", label: "📰 Articles", icon: "📰" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            ⚙️ Espace Administration
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            margin: 0,
            fontWeight: '500'
          }}>
            Gérez votre boutique et votre contenu en toute simplicité
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'white',
          padding: '0 40px',
          borderBottom: '1px solid #e9ecef'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '20px 0'
          }}>
            {tabs.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  background: tab === id 
                    ? 'linear-gradient(135deg, #3498db, #2980b9)' 
                    : 'transparent',
                  color: tab === id ? 'white' : '#5d6d7e',
                  border: tab === id ? 'none' : '2px solid #e9ecef',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: tab === id ? '0 6px 20px rgba(52, 152, 219, 0.4)' : 'none',
                  transform: tab === id ? 'translateY(-2px)' : 'translateY(0)'
                }}
                onMouseOver={(e) => {
                  if (tab !== id) {
                    e.target.style.background = '#f8f9fa';
                    e.target.style.color = '#3498db';
                    e.target.style.borderColor = '#3498db';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (tab !== id) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#5d6d7e';
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{
          background: '#f8f9fa',
          minHeight: '600px',
          padding: '40px'
        }}>
          {tab === "products" ? <AdminProducts /> : <AdminArticles />}
        </div>

        {/* Footer */}
        <div style={{
          background: '#2c3e50',
          color: 'white',
          padding: '20px 40px',
          textAlign: 'center',
          borderTop: '1px solid #34495e'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem'
            }}>
              <span>🛡️</span>
              <span>Interface d'administration sécurisée</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '0.9rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#2ecc71',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span>Système en ligne</span>
              </div>
              <span style={{ opacity: 0.7 }}>•</span>
              <span style={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} Administration
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}