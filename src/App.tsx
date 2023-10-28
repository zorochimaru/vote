import { lazy, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext, UserFactory } from './contexts/AuthContext';
import { AuthGuard } from './hoc/AuthGuard';
import Layout from './hoc/Layout';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { User } from 'firebase/auth';

const Home = lazy(() => import('./routes/Home/Home'));
const Login = lazy(() => import('./routes/Login/Login'));
const Profile = lazy(() => import('./routes/Profile/Profile'));
const ProfileList = lazy(() => import('./routes/ProfileList/ProfileList'));
const UploadCharacters = lazy(() => import('./routes/UploadCharacters/UploadCharacters'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

export const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const userFactory = useMemo<UserFactory>(() => ({ user, setUser }), [user, setUser]);

  return (
    <ThemeProvider theme={darkTheme}>
      <UserContext.Provider value={userFactory}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route element={<AuthGuard />}>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="profiles" element={<ProfileList />} />
                <Route path="upload-characters" element={<UploadCharacters />} />
                <Route path="profiles/*" element={<Profile />} />
                <Route path="about/*" element={<div>About</div>} />
                <Route path="*" element={<div>404</div>} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
};
