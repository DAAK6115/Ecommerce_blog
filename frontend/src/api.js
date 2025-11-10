const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:8000';


// Utilitaires fetch avec tokens JWT
function getTokens() {
try {
return JSON.parse(localStorage.getItem('tokens') || '{}');
} catch { return {}; }
}
function setTokens(tokens) {
localStorage.setItem('tokens', JSON.stringify(tokens || {}));
}
function clearTokens() { localStorage.removeItem('tokens'); }


async function apiFetch(path, { auth = false, method = 'GET', headers = {}, body } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const init = { method, headers: { ...headers } };

  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body; // ne pas fixer Content-Type pour FormData
    } else {
      init.headers['Content-Type'] = 'application/json';
      init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
  }

  if (auth) {
    let { access, refresh } = getTokens();
    if (access) init.headers['Authorization'] = `Bearer ${access}`;
    let res = await fetch(url, init);
    if (res.status === 401 && refresh) {
      const r = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });
      if (r.ok) {
        const data = await r.json();
        access = data.access;
        setTokens({ access, refresh });
        init.headers['Authorization'] = `Bearer ${access}`;
        res = await fetch(url, init);
      }
    }
    return res;
  }
  return fetch(url, init);
}



// === Auth ===
export async function register({ email, username, password, nom, prenom }) {
  // endpoint backend : /api/accounts/register/
  const body = { email, username, password, nom, prenom };
  const res = await apiFetch('/api/accounts/register/', {
    method: 'POST',
    body
  });
  if (!res.ok)
    throw await res.json().catch(() => ({ detail: 'Registration failed' }));
  return res.json();
}



export async function activateAccount({ uid, token }) {
// respect de l’URL ?uid=...&token=...
// Certains backends exigent GET, d’autres POST: on essaie GET par défaut
const res = await apiFetch(`/api/accounts/activate/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`, { method: 'GET' });
if (!res.ok) throw await res.json().catch(() => ({ detail: 'Activation failed' }));
return res.json();
}


export async function login({ email, password }) {
// corrige l’erreur "no export named 'login'"
const res = await apiFetch('/api/accounts/login/', { method: 'POST', body: { email, password } });
if (!res.ok) throw await res.json().catch(() => ({ detail: 'Login failed' }));
const data = await res.json();
if (data.access && data.refresh) setTokens({ access: data.access, refresh: data.refresh });
return data;
}


export function logout() { clearTokens(); }


export async function getMe() {
// corrige l’erreur "no export named 'getMe'"
const tokens = JSON.parse(localStorage.getItem('tokens') || '{}');
if (!tokens.access) throw { detail: 'Not authenticated' };
const email = localStorage.getItem('lastEmail') || null;
return { email };
}

export async function uploadImage(file, scope = 'produits') {
  const form = new FormData();
  form.append('file', file);
  const endpoint = scope === 'articles'
    ? '/api/articles/upload-image/'
    : '/api/produits/upload-image/';
  const res = await apiFetch(endpoint, { auth: true, method: 'POST', body: form });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Upload failed' }));
  return res.json(); // { url }
}
export async function probeIsStaff() {
  const res = await apiFetch('/api/produits/', { auth: true, method: 'POST', body: {} });
  return res.status !== 403; // true => admin, false => non-admin
}


// === Blog ===
export async function listArticles({ page = 1 } = {}) {
  const res = await apiFetch(`/api/articles/?page=${page}`);
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'List articles failed' }));
  return res.json();
}
export async function getArticle(id) {
  const res = await apiFetch(`/api/articles/${id}/`);
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Get article failed' }));
  return res.json();
}

export async function postComment({ articleId, content, parentId = null }) {
  const body = { contenu: content, content };
  if (parentId != null) {
    body.parent = parentId;     // si le back attend "parent"
    body.parent_id = parentId;  // tolérance si le back attend "parent_id"
  }
  const res = await apiFetch(`/api/articles/${articleId}/commentaires/`, {
    auth: true,
    method: 'POST',
    body
  });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Post comment failed' }));
  return res.json();
}


export async function listComments(articleId) {
  const res = await apiFetch(`/api/articles/${articleId}/commentaires/`);
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'List comments failed' }));
  return res.json();
}



// ==== ADMIN: Articles ====
export async function adminListArticles({ page = 1 } = {}) {
  const res = await apiFetch(`/api/articles/?page=${page}`, { auth: true });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Admin list articles failed' }));
  return res.json();
}

export async function createArticle(data) {
  // data attendu: { titre, contenu, statut } (slug/auteur/date_publication sont back)
  const payload = {
    titre: data.titre,
    content: data.contenu,    // tolérance si le sérializer accepte 'content'
    contenu: data.contenu,
    statut: data.statut
  };
  const res = await apiFetch('/api/articles/', { auth: true, method: 'POST', body: payload });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Create article failed' }));
  return res.json();
}

export async function updateArticle(id, data) {
  const payload = {
    titre: data.titre,
    content: data.contenu,
    contenu: data.contenu,
    statut: data.statut
  };
  const res = await apiFetch(`/api/articles/${id}/`, { auth: true, method: 'PUT', body: payload });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Update article failed' }));
  return res.json();
}

export async function deleteArticle(id) {
  const res = await apiFetch(`/api/articles/${id}/`, { auth: true, method: 'DELETE' });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Delete article failed' }));
  return true;
}


// === Produits / Catalogue ===
const PROD_BASES = ['/api/produits', '/api/products'];
async function firstOk(paths, opts) {
for (const p of paths) {
const res = await apiFetch(`${p}${opts.suffix || ''}`, opts);
if (res.ok) return res;
}
return new Response(null, { status: 404 });
}
export async function listProducts({ page = 1 } = {}) {
const res = await firstOk(PROD_BASES, { suffix: `/?page=${page}` });
if (!res.ok) throw { detail: 'List products failed' };
return res.json();
}
export async function getProduct(id) {
const res = await firstOk(PROD_BASES.map(b => `${b}/${id}/`), {});
if (!res.ok) throw { detail: 'Get product failed' };
return res.json();
}

// ==== ADMIN: Produits ====
export async function adminListProducts({ page = 1 } = {}) {
  const res = await apiFetch(`/api/produits/?page=${page}`, { auth: true });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Admin list products failed' }));
  return res.json();
}
export async function createProduct(data) {
  // data: { name/nom, description, price/prix, stock, image_url }
  const res = await apiFetch('/api/produits/', { auth: true, method: 'POST', body: data });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Create product failed' }));
  return res.json();
}
export async function updateProduct(id, data) {
  const res = await apiFetch(`/api/produits/${id}/`, { auth: true, method: 'PUT', body: data });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Update product failed' }));
  return res.json();
}
export async function deleteProduct(id) {
  const res = await apiFetch(`/api/produits/${id}/`, { auth: true, method: 'DELETE' });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Delete product failed' }));
  return true;
}

// === Commande ===
export async function createOrder() {
const res = await apiFetch('/api/produits/commandes/', { auth: true, method: 'POST', body: {} });
if (!res.ok) throw await res.json().catch(() => ({ detail: 'Create order failed' }));
return res.json();
}
export async function addOrderLine({ orderId, productId, quantity }) {
  const res = await apiFetch(`/api/produits/commandes/${orderId}/lignes/`, {
    auth: true,
    method: 'POST',
    body: { produit: productId, quantite: quantity } // ✅ correspond au backend
  });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Add line failed' }));
  return res.json();
}


export async function confirmOrder({ orderId }) {
const res = await apiFetch(`/api/produits/commandes/${orderId}/confirmer/`, { auth: true, method: 'POST', body: {} });
if (!res.ok) throw await res.json().catch(() => ({ detail: 'Confirm failed' }));
return res.json();
}

export async function getProfile() {
  const res = await apiFetch('/api/accounts/profile/', { auth: true, method: 'GET' });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Get profile failed' }));
  return res.json(); // { nom, prenom, email, actif, date_inscription }
}

export async function updateProfile({ nom, prenom, email, actif }) {
  const body = { nom, prenom, email, actif };
  const res = await apiFetch('/api/accounts/profile/', { auth: true, method: 'PUT', body });
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Update profile failed' }));
  return res.json();
}
