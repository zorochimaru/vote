import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext, UserFactory } from './contexts/AuthContext';
import { AuthGuard } from './hoc/AuthGuard';
import Layout from './hoc/Layout';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { onSnapshot } from 'firebase/firestore';
import { ConfirmProvider } from 'material-ui-confirm';
import { userDocumentRef } from '../firebase';
import Loading from './components/Loading/Loading';
import { AuthUser } from './interfaces';

const KPopVote = lazy(() => import('./routes/KPopVote/KPopVote'));
const TeamCosplayVote = lazy(() => import('./routes/TeamCosplayVote/TeamCosplayVote'));
const Results = lazy(() => import('./routes/Results/Results'));
const SoloCosplayVote = lazy(() => import('./routes/SoloCosplayVote/SoloCosplayVote'));
const Login = lazy(() => import('./routes/Login/Login'));
const Home = lazy(() => import('./routes/Home/Home'));
const UploadCharacters = lazy(() => import('./routes/UploadCharacters/UploadCharacters'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const getUser = useCallback(async (uid: string) => {
    const unsuscribe = onSnapshot(userDocumentRef(uid), (doc) => {
      setUser({ ...doc.data(), id: doc.id } as AuthUser);
    });

    return () => {
      unsuscribe();
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('user')) {
      getUser(JSON.parse(sessionStorage.getItem('user')!));
    }
  }, [getUser]);

  const userFactory = useMemo<UserFactory>(() => ({ user, setUser }), [user, setUser]);

  return (
    <ThemeProvider theme={darkTheme}>
      <UserContext.Provider value={userFactory}>
        <Suspense fallback={<Loading />}>
          <ConfirmProvider>
            <BrowserRouter>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route element={<AuthGuard />}>
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="solo-cosplay-vote" element={<SoloCosplayVote />} />
                    <Route path="team-cosplay-vote" element={<TeamCosplayVote />} />
                    <Route path="k-pop-vote" element={<KPopVote />} />
                    <Route path="results" element={<Results />} />
                    <Route path="upload-characters" element={<UploadCharacters />} />
                    <Route path="*" element={<div>404</div>} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </ConfirmProvider>
        </Suspense>
      </UserContext.Provider>
    </ThemeProvider>
  );
};
