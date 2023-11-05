import { Dispatch, createContext, useContext } from 'react';
import { AuthUser } from '../interfaces';

export type UserFactory = {
  user: AuthUser | null;
  setUser: Dispatch<AuthUser | null>;
};

export const UserContext = createContext<UserFactory>({
  user: null,
  setUser: () => {}
});
export const useUser = () => useContext(UserContext);
