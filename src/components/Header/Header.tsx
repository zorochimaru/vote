import { signOut } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import './Header.css';
const Header = () => {
  const { user } = useUser();
  const [showResultsLink, setShowResultsLink] = useState(false);
  const logout = () => {
    signOut(auth).then(() => {
      sessionStorage.clear();
    });
  };

  const canSeeResultsLink = useCallback((): boolean => {
    return (
      (user?.role === 'cosplay' && user?.soloCosplayFinished && user?.teamCosplayFinished) ||
      (user?.role === 'k-pop' && user?.kpopFinished) ||
      false
    );
  }, [user]);

  useEffect(() => {
    const canSeeResultsLinkRes = canSeeResultsLink();
    setShowResultsLink(canSeeResultsLinkRes);
  }, [canSeeResultsLink]);

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

          {showResultsLink && (
            <li>
              <Link to="/results">Upload Characters</Link>
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
