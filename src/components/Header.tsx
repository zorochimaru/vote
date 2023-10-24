import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <Link className="logo" to="/">
          <h1>Logo</h1>
        </Link>
        <ul>
          <li>
            <Link to="/profiles">Profiles</Link>
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
