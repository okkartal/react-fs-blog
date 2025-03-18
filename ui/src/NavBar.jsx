import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function NavBar() {
    const isLoggedIn = false;

    const navigate = useNavigate();

    return (
        <nav>
           <ul>
             <li>
                <Link to="/">Home</Link>
             </li>
             <li>
                 <Link to="/about">About</Link>
              </li>
              {isLoggedIn && (
                <li style={{ color: 'white'}}>
                    Logged in
                </li>)}
              <li>
                {isLoggedIn ?
                <button onClick={() => signOut(getAuth())}>Logout</button> :
                <button onClick={() => navigate('/login')}>Login</button>}
              </li>
           </ul>
        </nav>
    )
}