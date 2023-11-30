import { Dispatch, createContext, useContext } from 'react';

export type LoadingFactory = {
  loading: boolean;
  setLoading: Dispatch<boolean>;
};

export const LoadingContext = createContext<LoadingFactory>({
  loading: false,
  setLoading: () => {}
});
export const useLoading = () => useContext(LoadingContext);
