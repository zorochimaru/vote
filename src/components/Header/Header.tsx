import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
        </ul>
      </nav>
    </header>
  );
};

export default Header;
