import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function logIn() {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch(e) {
            setError(e.message);
        }
    }

    return (
        <>
         <h1>Login</h1>
         {error && <p>{error}</p>}
         <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
         <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
         <button onClick={logIn}>Login</button>
         <Link to="/create-account">Don't have an account? Create one</Link>
        </>
    );
}