import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext, UserFactory } from './contexts/AuthContext';
import { AuthGuard } from './hoc/AuthGuard';
import Layout from './hoc/Layout';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Loading from './components/Loading/Loading';
import { AuthUser } from './interfaces';
import Results from './routes/Results/Results';
import { getDocument } from './services/firestore.service';

const SoloCosplayVote = lazy(() => import('./routes/SoloCosplayVote/SoloCosplayVote'));
const Login = lazy(() => import('./routes/Login/Login'));
const Home = lazy(() => import('./routes/Home/Home'));
const Profile = lazy(() => import('./routes/Profile/Profile'));
const ProfileList = lazy(() => import('./routes/ProfileList/ProfileList'));
const UploadCharacters = lazy(() => import('./routes/UploadCharacters/UploadCharacters'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const getUser = useCallback(async (uid: string) => {
    const authUser = await getDocument<AuthUser>(doc(firestore, `authUsers/${uid}`));
    setUser(authUser);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('user')) {
      getUser(JSON.parse(localStorage.getItem('user')!));
    }
  }, [getUser]);

  const userFactory = useMemo<UserFactory>(() => ({ user, setUser }), [user, setUser]);

  return (
    <ThemeProvider theme={darkTheme}>
      <UserContext.Provider value={userFactory}>
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route element={<AuthGuard />}>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="solo-cosplay-vote" element={<SoloCosplayVote />} />
                  <Route path="profiles" element={<ProfileList />} />
                  <Route path="results" element={<Results />} />
                  <Route path="upload-characters" element={<UploadCharacters />} />
                  <Route path="profiles/*" element={<Profile />} />
                  <Route
                    path="about/*"
                    element={
                      <div>
                        <p>Vote application for the Game Summit</p>
                      </div>
                    }
                  />
                  <Route path="*" element={<div>404</div>} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Suspense>
      </UserContext.Provider>
    </ThemeProvider>
  );
};
