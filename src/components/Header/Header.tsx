import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';
import './Header.css';

const Header = () => {
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
          <li>
            <Link to="/upload-characters">Upload Characters</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
