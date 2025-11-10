import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getArticle, listComments, postComment } from '../api';
import { useAuth } from '../AuthContext';

function formatDate(v) {
  if (!v) return '';
  try { return new Date(v).toLocaleString(); } catch { return String(v); }
}
function getArticleAuthor(a) {
  const author = a?.auteur?.username || a?.auteur?.email || a?.auteur || a?.author?.username || a?.author || 'Auteur inconnu';
  return typeof author === 'string' ? author : String(author);
}

function getAuthor(c) {
  const author = c.auteur?.username || c.auteur?.email || c.auteur || c.author?.username || c.author || 'Utilisateur';
  return typeof author === 'string' ? author : String(author);
}
function getContent(c) {
  return c.contenu ?? c.content ?? '';
}
function getStatus(c) {
  const s = (c.statut ?? c.status ?? c.state ?? '').toString().toLowerCase();
  if (!s) return '—';
  if (['approuve', 'approved', 'validé', 'publie', 'publié'].includes(s)) return 'approuvé';
  if (['en_attente', 'pending', 'modération'].includes(s)) return 'en_attente';
  if (['refuse', 'rejeté', 'rejected'].includes(s)) return 'refusé';
  if (['brouillon', 'draft'].includes(s)) return 'brouillon';
  return s;
}
function statusStyle(s) {
  const map = {
    approuvé: { bg:'#e8fff0', fg:'#0a8f2a' },
    en_attente: { bg:'#fff7e6', fg:'#ad6a00' },
    refusé: { bg:'#ffecec', fg:'#b00020' },
    brouillon: { bg:'#eef2ff', fg:'#3b5bdb' },
  };
  return map[s] || { bg:'#f3f4f6', fg:'#374151' };
}

export default function ArticleDetail(){
  const { id } = useParams();
  const { isAuth } = useAuth();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [replyOpen, setReplyOpen] = useState({});

  // Charger article + commentaires
  useEffect(() => { (async () => {
    try {
      setArticle(await getArticle(id));
      const data = await listComments(id);
      setComments(Array.isArray(data) ? data : (data.results || []));
    } catch(e){
      setErr(e?.detail || 'Erreur de chargement');
    }
  })(); }, [id]);

  // Construire l'arbre parent -> enfants
  const tree = useMemo(() => {
    const byParent = {};
    for (const c of comments) {
      const parent = (c.parent ?? c.parent_id ?? c.parentId ?? null) || null;
      if (!byParent[parent]) byParent[parent] = [];
      byParent[parent].push(c);
    }
    Object.keys(byParent).forEach(k => {
      byParent[k].sort((a,b) => {
        const da = new Date(a.date_creation || a.created_at || a.created || 0).getTime();
        const db = new Date(b.date_creation || b.created_at || b.created || 0).getTime();
        return (da||0) - (db||0);
      });
    });
    return byParent;
  }, [comments]);

  // Publier un commentaire racine
  async function submitRoot(e){
    e.preventDefault(); setMsg(''); setErr('');
    const contenu = (text || '').trim();
    if (!contenu) { setErr('Le commentaire est vide.'); return; }
    try {
      const created = await postComment({ articleId: id, content: contenu });
      setComments(prev => [created, ...prev]);
      setText(''); setMsg('Commentaire publié');
    } catch(e){
      const d = e?.detail || e?.contenu?.[0];
      setErr(d || 'Échec commentaire');
    }
  }

  // Publier une réponse
  async function submitReply(parentId, value, reset){
    setMsg(''); setErr('');
    const contenu = (value || '').trim();
    if (!contenu) { setErr('La réponse est vide.'); return; }
    try {
      const created = await postComment({ articleId: id, content: contenu, parentId });
      setComments(prev => [created, ...prev]);
      reset('');
      setReplyOpen(o => ({ ...o, [parentId]: false }));
      setMsg('Réponse publiée');
    } catch(e){
      const d = e?.detail || e?.contenu?.[0];
      setErr(d || 'Échec réponse');
    }
  }

  function CommentNode({ c }){
    const [val, setVal] = useState('');
    const cid = c.id ?? c.pk;
    const children = tree[cid] || [];
    
    const auteur = getAuthor(c);
    const contenu = getContent(c);
    const date = formatDate(c.date_creation || c.created_at || c.created);
    const statut = getStatus(c);
    const st = statusStyle(statut);

    // Gestion sécurisée de l'initial
    const userInitial = typeof auteur === 'string' && auteur.length > 0 
      ? auteur.charAt(0).toUpperCase() 
      : 'U';

    return (
      <div style={{ 
        marginTop: '20px', 
        borderLeft: '3px solid #e9ecef', 
        paddingLeft: '20px',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #3498db, #9b59b6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              flexShrink: 0
            }}>
              {userInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                fontSize: '14px'
              }}>
                {auteur}
              </div>
              <div style={{ 
                color: '#7f8c8d', 
                fontSize: '12px',
                marginTop: '2px'
              }}>
                {date}
              </div>
            </div>
            <span
              title={`statut: ${statut}`}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: st.bg,
                color: st.fg,
                fontWeight: '600'
              }}
            >
              {statut}
            </span>
          </div>
          
          <div style={{ 
            color: '#2c3e50',
            lineHeight: '1.5',
            fontSize: '14px',
            marginBottom: '12px'
          }}>
            {contenu}
          </div>

          {isAuth && (
            <div style={{ marginTop: '12px' }}>
              {!replyOpen[cid] ? (
                <button 
                  onClick={() => setReplyOpen(o => ({ ...o, [cid]: true }))}
                  style={{
                    background: 'transparent',
                    color: '#3498db',
                    border: '1px solid #3498db',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#3498db';
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#3498db';
                  }}
                >
                  💬 Répondre
                </button>
              ) : (
                <form
                  onSubmit={(e)=>{ e.preventDefault(); submitReply(cid, val, setVal); }}
                  style={{ marginTop: '12px' }}
                >
                  <textarea
                    placeholder="Votre réponse…"
                    value={val}
                    onChange={e=>setVal(e.target.value)}
                    rows={3}
                    style={{ 
                      width: '100%',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3498db';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef';
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3498db, #2980b9)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      📤 Publier
                    </button>
                    <button
                      type="button"
                      onClick={()=>{ setReplyOpen(o=>({ ...o, [cid]: false })); setVal(''); }}
                      style={{
                        background: 'transparent',
                        color: '#7f8c8d',
                        border: '1px solid #bdc3c7',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#e74c3c';
                        e.target.style.color = 'white';
                        e.target.style.borderColor = '#e74c3c';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#7f8c8d';
                        e.target.style.borderColor = '#bdc3c7';
                      }}
                    >
                      ❌ Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* enfants */}
        {children.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            {children.map(child => <CommentNode key={child.id ?? child.pk} c={child} />)}
          </div>
        )}
      </div>
    );
  }

  if (!article) return (
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
        <h3 style={{ color: '#2c3e50', margin: 0 }}>Chargement de l'article...</h3>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const roots = tree[null] || tree[undefined] || tree['null'] || [];
  const articleAuthor = getArticleAuthor(article);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        
        {/* En-tête de l'article */}
        <div style={{
          background: 'linear-gradient(135deg, #2c3e50, #3498db)',
          color: 'white',
          padding: '50px 40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            margin: '0 0 15px 0',
            lineHeight: '1.2'
          }}>
            {article.titre || article.title}
          </h1>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '1rem',
            opacity: 0.9
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👤</span>
              <span>{articleAuthor}</span>
            </div>
            {article.slug && (
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                🔗 {article.slug}
              </div>
            )}
            {article.date_publication && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📅 {new Date(article.date_publication).toLocaleString('fr-FR')}
              </div>
            )}
          </div>
        </div>

        {/* Contenu de l'article */}
        <div style={{
          padding: '50px 40px',
          lineHeight: '1.7',
          fontSize: '1.1rem',
          color: '#2c3e50'
        }}>
          <div 
            dangerouslySetInnerHTML={{__html: article.contenu || article.content}}
            style={{
              fontFamily: 'Georgia, serif'
            }}
          />
        </div>

        {/* Section commentaires */}
        <div style={{
          padding: '40px',
          background: '#f8f9fa',
          borderTop: '1px solid #e9ecef'
        }}>
          <h3 style={{
            fontSize: '1.8rem',
            color: '#2c3e50',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💬 Commentaires ({comments.length})
          </h3>

          {/* Formulaire de commentaire principal */}
          {isAuth ? (
            <form 
              onSubmit={submitRoot} 
              style={{ 
                marginBottom: '30px',
                background: 'white',
                padding: '25px',
                borderRadius: '16px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Laissez un commentaire</h4>
              <textarea
                value={text}
                onChange={e=>setText(e.target.value)}
                placeholder="Partagez vos pensées…"
                rows={4}
                style={{ 
                  width: '100%',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '15px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'all 0.3s ease',
                  outline: 'none',
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
              <button
                style={{
                  background: 'linear-gradient(135deg, #3498db, #2980b9)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '15px',
                  transition: 'all 0.3s ease'
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
                📤 Publier le commentaire
              </button>
            </form>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <p style={{ 
                color: '#2d3436', 
                margin: 0,
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                🔐 Connectez-vous pour commenter et répondre aux discussions.
              </p>
            </div>
          )}

          {/* Messages */}
          {msg && (
            <div style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
              color: '#155724',
              borderRadius: '10px',
              border: '1px solid #c3e6cb',
              fontWeight: '500',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {msg}
            </div>
          )}
          {err && (
            <div style={{
              padding: '15px',
              background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
              color: '#721c24',
              borderRadius: '10px',
              border: '1px solid #f5c6cb',
              fontWeight: '500',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {err}
            </div>
          )}

          {/* Liste des commentaires */}
          {roots.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💬</div>
              <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Aucun commentaire</h4>
              <p style={{ color: '#7f8c8d' }}>
                Soyez le premier à commenter cet article !
              </p>
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              {roots.map(c => <CommentNode key={c.id ?? c.pk} c={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}