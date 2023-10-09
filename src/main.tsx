import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Home from './routes/Home';
import Profile from './routes/Profile';
import ProfileList from './routes/ProfileList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'profiles',
    element: <ProfileList />
  },
  {
    path: '/profiles/:id',
    element: <Profile />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
