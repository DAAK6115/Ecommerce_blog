import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { isAuth, user, logout } = useAuth();

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      padding: '0 40px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto',
        height: '70px'
      }}>
        {/* Partie gauche - Navigation principale */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(52, 152, 219, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🏠 Accueil
          </Link>

          {[
            { to: "/products", icon: "🛒", text: "Produits" },
            { to: "/articles", icon: "📰", text: "Blog" },
            { to: "/cart", icon: "🛍️", text: "Panier" },
            { to: "/profile", icon: "👤", text: "Profil" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.to}
              style={{
                color: '#ecf0f1',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ecf0f1';
              }}
            >
              {item.icon} {item.text}
            </Link>
          ))}
        </div>

        {/* Partie droite - Authentification */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {isAuth ? (
            <>
              {/* Badge utilisateur */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
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
                  {user?.email}
                </div>

                {/* Admin link */}
                {user?.is_staff && (
                  <Link 
                    to="/admin"
                    style={{
                      color: '#f39c12',
                      textDecoration: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #f39c12',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f39c12';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#f39c12';
                    }}
                  >
                    ⚙️ Admin
                  </Link>
                )}

                {/* Bouton déconnexion */}
                <button 
                  onClick={logout}
                  style={{
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🚪 Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Boutons connexion/inscription */}
              <Link 
                to="/login"
                style={{
                  color: '#3498db',
                  textDecoration: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: '1px solid #3498db',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
                🔑 Connexion
              </Link>

              <Link 
                to="/register"
                style={{
                  background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(46, 204, 113, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 10px rgba(46, 204, 113, 0.3)';
                }}
              >
                ✨ Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </nav>
  );
}