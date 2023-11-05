import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user } = useUser();

  const logout = () => {
    signOut(auth).then(() => {});
  };

  return (
    <header>
      <nav>
        <Link className="logo" to="/">
          <img src="gs.logo.white.png" alt="logo" />
        </Link>
        <ul>
          {user?.canUpload && (
            <li>
              <Link to="/upload-characters">Upload Characters</Link>
            </li>
          )}

          <li>
            <Link to="/about">About</Link>
          </li>
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
