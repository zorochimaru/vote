import { User } from 'firebase/auth';
import { Dispatch, createContext, useContext } from 'react';

export type UserFactory = {
  user: User | null;
  setUser: Dispatch<User | null>;
};

export const UserContext = createContext<UserFactory>({
  user: null,
  setUser: () => {}
});
export const useUser = () => useContext(UserContext);
