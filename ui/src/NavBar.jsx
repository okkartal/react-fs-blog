import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";

export default function NavBar() {
  const { user } = useUser();
  const navigage = useNavigate();

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
        <li>
          <Link to="/articles-list">Articles</Link>
        </li>
      </ul>
      <div className="nav-right">
        {user ?
          <button onClick={() => signOut(getAuth())}>Logout</button> :
          <button onClick={() => navigate('/login')}>Login</button>}
      </div>
    </nav>
  )
}