import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import './Header.css';
const Header = () => {
  const { user } = useUser();
  const logout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
    });
  };

  return (
    <header>
      <nav>
        <Link className="logo" to="/">
          <img className="logoImg" src="gs.logo.white.png" alt="logo" />
          <img className="mobLogo" src="gs.logo.white-mini.png" alt="logo" />
        </Link>
        <ul>
          {user?.canUpload && (
            <li>
              <Link to="/admin-panel">Admin panel</Link>
            </li>
          )}

          <li>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
