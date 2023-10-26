import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { useMemo, useState } from 'react';
import { UserContext, UserFactory } from './contexts/AuthContext';

import { AuthGuard } from './hoc/AuthGuard';
import Layout from './hoc/Layout';

import Home from './routes/Home/Home';
import Login from './routes/Login/Login';
import Profile from './routes/Profile/Profile';
import ProfileList from './routes/ProfileList/ProfileList';

export const App = () => {
  const [user, setUser] = useState<any>(null);
  const userFactory = useMemo<UserFactory>(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={userFactory}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profiles" element={<ProfileList />} />
              <Route path="profiles/*" element={<Profile />} />
              <Route path="about/*" element={<div>About</div>} />
              <Route path="*" element={<div>404</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};
