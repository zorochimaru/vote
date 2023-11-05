import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { auth } from '../../firebase';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { useUser } from '../contexts/AuthContext';

const Layout = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    console.log('App render');
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(`Auth state changed. Loged In`);
        localStorage.setItem('user', 'true');
      } else {
        console.log(`Auth state changed. Loged Out`);
        setUser(null);
        localStorage.removeItem('user');
      }
    });
  }, [user, setUser]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Header />
      <main style={{ padding: '16px', flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
