import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './routes/Home';
import ProfileList from './routes/ProfileList';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profiles/*" element={<ProfileList />} />
          <Route path="/about/*" element={<div></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

function Layout() {
  return (
    <>
      <Header />
      <main className="content-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
