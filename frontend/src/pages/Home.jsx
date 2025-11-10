export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '40px'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '1000px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        padding: '60px 40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        {/* Icône animée */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 40px',
          boxShadow: '0 15px 30px rgba(52, 152, 219, 0.4)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <span style={{ fontSize: '48px' }}>👋</span>
        </div>

        {/* Titre principal */}
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          lineHeight: '1.1'
        }}>
          Bienvenue
        </h1>
        
        {/* Sous-titre */}
        <p style={{
          fontSize: '1.5rem',
          color: '#5d6d7e',
          marginBottom: '50px',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto 50px'
        }}>
          Bienvenue sur notre plateforme de{' '}
          <strong style={{
            background: 'linear-gradient(135deg, #3498db, #9b59b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>e-commerce premium</strong>. 
          Découvrez une expérience shopping exceptionnelle.
        </p>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px'
        }}>
          {[
            { number: '10K+', label: 'Produits disponibles', icon: '📦' },
            { number: '4.9/5', label: 'Satisfaction client', icon: '⭐' },
            { number: '24h', label: 'Livraison express', icon: '🚚' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: '#f8f9fa',
              padding: '30px 20px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #e9ecef',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-8px)';
              e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              e.target.style.background = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = '#f8f9fa';
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '10px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '8px'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#7f8c8d'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action principaux */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          <button style={{
            padding: '18px 40px',
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(52, 152, 219, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 25px rgba(52, 152, 219, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
          }}>
            🛒 Explorer nos produits
          </button>
          
          <button style={{
            padding: '18px 40px',
            background: 'transparent',
            color: '#3498db',
            border: '2px solid #3498db',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#3498db';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-3px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#3498db';
            e.target.style.transform = 'translateY(0)';
          }}>
            ⭐ Voir les promotions
          </button>
        </div>

        {/* Section avantages */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(52, 152, 219, 0.2)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            color: '#2c3e50',
            marginBottom: '25px',
            fontWeight: '600'
          }}>
            🎯 Pourquoi nous choisir ?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            textAlign: 'left'
          }}>
            {[
              { text: 'Paiement 100% sécurisé', icon: '🛡️' },
              { text: 'Support client 24/7', icon: '💬' },
              { text: 'Retours faciles', icon: '↩️' },
              { text: 'Qualité garantie', icon: '✅' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#2c3e50',
                fontSize: '1rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}