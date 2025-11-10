import { useEffect, useState } from 'react';
import { adminListProducts, createProduct, updateProduct, deleteProduct, uploadImage } from "../../api";

export default function AdminProducts(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nom:'', prix:'', stock:'', image_url:'', description:'', slug:'', actif:true
  });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  function load() {
    setErr(''); setMsg(''); setLoading(true);
    adminListProducts()
      .then(d => setItems(d.results || d))
      .catch(e => setErr(e?.detail||'Erreur chargement'))
      .finally(() => setLoading(false));
  }
  useEffect(() => { load(); }, []);

  function upd(k,v){ setForm(s=>({ ...s, [k]: v })); }

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(''); setMsg(''); setUploading(true);
    try {
      const { url } = await uploadImage(file, 'produits');
      setForm(s => ({ ...s, image_url: url }));
      setMsg('🖼️ Image importée avec succès !');
    } catch (e) {
      setErr(e?.detail || '❌ Échec du téléversement');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e){
    e.preventDefault(); setErr(''); setMsg('');
    const payload = {
      nom: form.nom || undefined,
      name: form.nom || undefined,
      prix: form.prix !== '' ? Number(form.prix) : undefined,
      price: form.prix !== '' ? Number(form.prix) : undefined,
      stock: form.stock !== '' ? Number(form.stock) : undefined,
      image_url: form.image_url || undefined,
      description: form.description || '',
      actif: Boolean(form.actif),
    };
    try{
      if (editing) {
        await updateProduct(editing.id, payload);
        setMsg('✅ Produit mis à jour avec succès !');
      } else {
        await createProduct(payload);
        setMsg('🎉 Produit créé avec succès !');
      }
      setForm({ nom:'', prix:'', stock:'', image_url:'', description:'', slug:'', actif:true });
      setEditing(null);
      load();
    }catch(e){ setErr(e?.detail || '❌ Échec de la sauvegarde'); }
  }

  async function onEdit(p){
    setEditing(p);
    setForm({
      nom: p.nom || p.name || '',
      slug: p.slug || '',
      prix: (p.prix ?? p.price) ?? '',
      stock: p.stock ?? '',
      image_url: p.image_url || '',
      description: p.description || '',
      actif: p.actif ?? true,
    });
  }

  async function onDelete(id){
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    setErr(''); setMsg('');
    try{ 
      await deleteProduct(id); 
      setMsg('🗑️ Produit supprimé avec succès !'); 
      load(); 
    }
    catch(e){ setErr(e?.detail || '❌ Échec de la suppression'); }
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
            🛍️ Administration • Produits
          </h1>
          <p style={{
            color: '#5d6d7e',
            fontSize: '1.2rem'
          }}>
            Gérez votre catalogue de produits
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
              {editing ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
            </h3>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Nom */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  📝 Nom du produit
                </label>
                <input
                  placeholder="Nom du produit"
                  value={form.nom}
                  onChange={e=>upd('nom', e.target.value)}
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

              {/* Slug */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  🔗 Slug (auto-généré)
                </label>
                <input
                  placeholder="Slug"
                  value={form.slug}
                  disabled
                  style={{
                    width: '100%',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    color: '#6c757d',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Prix et Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#2c3e50',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '0.95rem'
                  }}>
                    💰 Prix (FCFA)
                  </label>
                  <input
                    placeholder="0"
                    type="number"
                    value={form.prix}
                    onChange={e=>upd('prix', e.target.value)}
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

                <div>
                  <label style={{
                    display: 'block',
                    color: '#2c3e50',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '0.95rem'
                  }}>
                    📦 Stock
                  </label>
                  <input
                    placeholder="0"
                    type="number"
                    value={form.stock}
                    onChange={e=>upd('stock', e.target.value)}
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
              </div>

              {/* Upload Image */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  🖼️ Image du produit
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onFileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px dashed #e9ecef',
                    borderRadius: '12px',
                    background: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.background = '#e3f2fd';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.background = '#f8f9fa';
                  }}
                />
                {uploading && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '10px',
                    color: '#3498db',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid #3498db',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Téléversement en cours...
                  </div>
                )}
                {form.image_url && (
                  <div style={{margin:'15px 0', textAlign: 'center'}}>
                    <img 
                      src={form.image_url} 
                      alt="Aperçu" 
                      style={{
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2c3e50',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '0.95rem'
                }}>
                  📄 Description
                </label>
                <textarea
                  placeholder="Description du produit..."
                  value={form.description}
                  onChange={e=>upd('description', e.target.value)}
                  rows={4}
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
                    fontFamily: 'inherit'
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

              {/* Statut Actif */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '15px',
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
                  <input
                    type="checkbox"
                    checked={!!form.actif}
                    onChange={e => upd("actif", e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>🎯 Statut du produit</span>
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
                  {editing ? '💾 Mettre à jour' : '✨ Créer le produit'}
                </button>
                {editing && (
                  <button
                    type="button"
                    onClick={()=>{
                      setEditing(null);
                      setForm({ nom:'', prix:'', stock:'', image_url:'', description:'', slug:'', actif:true });
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

          {/* Liste des produits */}
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
                📋 Liste des produits ({items.length})
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
                  Chargement des produits...
                </div>
              ) : items.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#7f8c8d'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Aucun produit</h4>
                  <p>Commencez par créer votre premier produit !</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {items.map(p => {
                    const price = (p.prix ?? p.price) || 0;
                    return (
                      <div 
                        key={p.id}
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
                        {/* En-tête avec nom et statut */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                          <h4 style={{
                            color: '#2c3e50',
                            margin: 0,
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            lineHeight: '1.3'
                          }}>
                            {p.nom || p.name}
                          </h4>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              background: p.actif ? 
                                'linear-gradient(135deg, #2ecc71, #27ae60)' : 
                                'linear-gradient(135deg, #e74c3c, #c0392b)',
                              color: 'white',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {p.actif ? '🟢 Actif' : '🔴 Inactif'}
                          </span>
                        </div>

                        {/* Slug */}
                        {p.slug && (
                          <div style={{opacity: 0.7, fontSize: '0.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                            🔗 <code style={{ background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>{p.slug}</code>
                          </div>
                        )}

                        {/* Image */}
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.nom || p.name}
                            style={{
                              width: '100%',
                              height: '140px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              marginBottom: '12px'
                            }}
                          />
                        )}

                        {/* Prix et Stock */}
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '6px'
                          }}>
                            {price.toLocaleString()} FCFA
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: p.stock > 10 ? '#27ae60' : p.stock > 0 ? '#f39c12' : '#e74c3c',
                            fontWeight: '500'
                          }}>
                            📦 Stock: {p.stock} unité{p.stock !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div style={{display: 'flex', gap: '10px'}}>
                          <button 
                            type="button" 
                            onClick={()=>onEdit(p)}
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
                            onClick={()=>onDelete(p.id)}
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