import CircularProgress from '@mui/material/CircularProgress';
import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { LoadingContext, LoadingFactory } from '../contexts/LoadingContext';

const Layout = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const loadingFactory = useMemo<LoadingFactory>(
    () => ({ loading, setLoading }),
    [loading, setLoading]
  );

  return (
    <LoadingContext.Provider value={loadingFactory}>
      <div
        style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          minHeight: '100dvh'
        }}>
        {loading && (
          <div
            style={{
              display: 'flex',
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.5)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}>
            <CircularProgress size={60} />
          </div>
        )}
        <Header />
        <main style={{ padding: '16px', flexGrow: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </LoadingContext.Provider>
  );
};

export default Layout;
