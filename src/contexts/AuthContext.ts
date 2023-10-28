import { UserCredential } from 'firebase/auth';
import { Dispatch, createContext, useContext } from 'react';

export type UserFactory = {
  user: UserCredential | null;
  setUser: Dispatch<UserCredential>;
};

export const UserContext = createContext<UserFactory>({
  user: null,
  setUser: () => {}
});
export const useUser = () => useContext(UserContext);
