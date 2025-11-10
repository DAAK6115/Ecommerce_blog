import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { activateAccount } from '../api';


export default function Activate(){
const [params] = useSearchParams();
const [state, setState] = useState({ loading: true, ok: false, error: '' });
useEffect(() => {
const uid = params.get('uid');
const token = params.get('token');
(async () => {
try {
await activateAccount({ uid, token });
setState({ loading:false, ok:true, error:'' });
} catch (e) {
setState({ loading:false, ok:false, error: e?.detail || 'Activation impossible' });
}
})();
}, [params]);


if (state.loading) return <div className="container"><p>Activation en cours…</p></div>;
if (state.ok) return <div className="container"><h2>Compte activé ✅</h2><p>Vous pouvez maintenant vous connecter.</p></div>;
return <div className="container"><h2>Échec d’activation</h2><p style={{color:'crimson'}}>{state.error}</p></div>;
}