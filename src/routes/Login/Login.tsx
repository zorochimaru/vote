import { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import classes from './login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword, authUser, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const { user, setUser } = useUser();

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (loading) {
    return <img className={classes.loadingLogo} src="gs.logo.white-mini.png" alt="logo" />;
  }
  if (user) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <form
      className={classes.loginForm}
      onSubmit={(e) => {
        e.preventDefault();
        signInWithEmailAndPassword(email, password);
      }}>
      <h1>Login</h1>
      <input
        className={classes.formField}
        placeholder="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={classes.formField}
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={!email || !password} className={classes.formSubmitBtn} type="submit">
        Sign In
      </button>
    </form>
  );
};

export default Login;
