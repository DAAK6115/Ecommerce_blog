import { useEffect, useMemo, useState } from 'react';
import { adminListArticles, createArticle, updateArticle, deleteArticle } from "../../api";

// slug local pour l’aperçu (jamais envoyé)
function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STATUTS = [
  { value: 'brouillon', label: '📝 Brouillon', color: '#f39c12' },
  { value: 'publie', label: '🚀 Publié', color: '#27ae60' },
];

export default function AdminArticles(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ titre:'', contenu:'', statut:'brouillon' });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const slugPreview = useMemo(() => slugify(form.titre), [form.titre]);

  function load(){
    setErr(''); setMsg(''); setLoading(true);
    adminListArticles()
      .then(d => setItems(d.results || d))
      .catch(e => setErr(e?.detail||'Erreur chargement'))
      .finally(() => setLoading(false));
  }
  useEffect(()=>{ load(); }, []);

  function upd(k,v){ setForm(s=>({ ...s, [k]: v })); }

  async function onSubmit(e){
    e.preventDefault(); setErr(''); setMsg('');
    const payload = {
      titre: form.titre || '',
      contenu: form.contenu || '',
      statut: form.statut || 'brouillon'
    };
    try{
      if (editing) { 
        await updateArticle(editing.id, payload); 
        setMsg('✅ Article mis à jour avec succès !'); 
      }
      else { 
        await createArticle(payload); 
        setMsg('🎉 Article créé avec succès !'); 
      }
      setForm({ titre:'', contenu:'', statut:'brouillon' });
      setEditing(null);
      load();
    }catch(e){ setErr(e?.detail || '❌ Échec de la sauvegarde'); }
  }

  function onEdit(a){
    setEditing(a);
    setForm({
      titre: a.titre || a.title || '',
      contenu: a.contenu || a.content || '',
      statut: a.statut || 'brouillon',
    });
  }

  async function onDelete(id){
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    setErr(''); setMsg('');
    try{ 
      await deleteArticle(id); 
      setMsg('🗑️ Article supprimé avec succès !'); 
      load(); 
    }
    catch(e){ setErr(e?.detail || '❌ Échec de la suppression'); }
  }

  function getStatusStyle(statut) {
    const status = STATUTS.find(s => s.value === statut);
    if (!status) return { bg: '#f8f9fa', color: '#6c757d' };
    
    return {
      bg: statut === 'publie' ? '#e8f5e8' : '#fff3cd',
      color: status.color,
      border: `1px solid ${statut === 'publie' ? '#d4edda' : '#ffeaa7'}`
    };
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '30px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            📰 Administration • Articles
          </h1>
          <p style={{
            color: '#5d6d7e',
            fontSize: '1.2rem'
          }}>
            Gérez le contenu de votre blog
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Formulaire */}
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
              {editing ? '✏️ Modifier l\'article' : '📝 Nouvel article'}
            </h3>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Titre */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  📋 Titre de l'article
                </label>
                <input
                  placeholder="Titre de votre article..."
                  value={form.titre}
                  onChange={e=>upd('titre', e.target.value)}
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

              {/* Slug Preview */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  🔗 Aperçu du slug
                </label>
                <input
                  value={slugPreview}
                  readOnly
                  disabled
                  placeholder="slug (auto-généré)"
                  title="Généré automatiquement côté serveur"
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    fontStyle: slugPreview ? 'normal' : 'italic',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  fontSize: '0.8rem',
                  color: '#6c757d',
                  marginTop: '6px',
                  fontStyle: 'italic'
                }}>
                  Le slug final sera généré automatiquement
                </div>
              </div>

              {/* Contenu */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  📄 Contenu (HTML autorisé)
                </label>
                <textarea
                  placeholder="Contenu de votre article... (HTML autorisé)"
                  value={form.contenu}
                  onChange={e=>upd('contenu', e.target.value)}
                  rows={8}
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
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

              {/* Statut */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  🎯 Statut de publication
                </label>
                <select 
                  value={form.statut} 
                  onChange={e=>upd('statut', e.target.value)}
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {STATUTS.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div style={{display:'flex', gap:'12px', marginTop:'10px'}}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {editing ? '💾 Mettre à jour' : '✨ Créer l\'article'}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={()=>{
                      setEditing(null); 
                      setForm({ titre:'', contenu:'', statut:'brouillon' });
                    }}
                    style={{
                      background: 'transparent',
                      color: '#e74c3c',
                      border: '2px solid #e74c3c',
                      padding: '15px 20px',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#e74c3c';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#e74c3c';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ❌ Annuler
                  </button>
                )}
              </div>
            </form>

            {/* Messages */}
            {msg && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
                color: '#155724',
                borderRadius: '10px',
                border: '1px solid #c3e6cb',
                fontWeight: '500',
                textAlign: 'center'
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
                fontWeight: '500',
                textAlign: 'center'
              }}>
                {err}
              </div>
            )}
          </div>

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
                📋 Liste des articles ({items.length})
              </h3>

              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#5d6d7e'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 15px'
                  }}></div>
                  Chargement des articles...
                </div>
              ) : items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#7f8c8d'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Aucun article</h4>
                  <p>Commencez par créer votre premier article !</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '20px'
                }}>
                  {items.map(a => {
                    const statusStyle = getStatusStyle(a.statut);
                    return (
                      <div 
                        key={a.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '16px',
                          padding: '20px',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                          border: '1px solid #e9ecef',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-5px)';
                          e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)';
                        }}
                      >
                        {/* Titre */}
                        <h4 style={{
                          color: '#2c3e50',
                          margin: '0 0 12px 0',
                          fontSize: '1.2rem',
                          fontWeight: '600',
                          lineHeight: '1.3',
                          minHeight: '56px'
                        }}>
                          {a.titre || a.title}
                        </h4>

                        {/* Slug */}
                        {a.slug && (
                          <div style={{
                            opacity: 0.7, 
                            fontSize: '0.8rem', 
                            marginBottom: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px'
                          }}>
                            🔗 <code style={{ 
                              background: '#f8f9fa', 
                              padding: '4px 8px', 
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontFamily: 'monospace'
                            }}>
                              {a.slug}
                            </code>
                          </div>
                        )}

                        {/* Statut */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '15px'
                        }}>
                          <span style={{
                            fontSize: '0.8rem',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: statusStyle.border,
                            fontWeight: '600'
                          }}>
                            {a.statut === 'publie' ? '🚀 Publié' : '📝 Brouillon'}
                          </span>
                          
                          {/* Date de publication si disponible */}
                          {a.date_publication && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#6c757d'
                            }}>
                              📅 {new Date(a.date_publication).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>

                        {/* Aperçu du contenu */}
                        {a.contenu && (
                          <div style={{
                            fontSize: '0.9rem',
                            color: '#5d6d7e',
                            lineHeight: '1.4',
                            marginBottom: '15px',
                            maxHeight: '60px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {a.contenu.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </div>
                        )}

                        {/* Boutons d'action */}
                        <div style={{
                          display: 'flex', 
                          gap: '10px',
                          marginTop: 'auto'
                        }}>
                          <button 
                            type="button" 
                            onClick={()=>onEdit(a)}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(135deg, #3498db, #2980b9)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            type="button" 
                            onClick={()=>onDelete(a.id)}
                            style={{
                              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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