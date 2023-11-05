import { signInWithEmailAndPassword } from '@firebase/auth';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import classes from './login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useUser();

  const signIn = async (email: string, password: string) => {
    try {
      const logedUser = await signInWithEmailAndPassword(auth, email, password);
      setUser(logedUser.user);
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <form
      className={classes.loginForm}
      onSubmit={(e) => {
        e.preventDefault();
        signIn(email, password);
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
