import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface InstanceContextType {
  idInstance: string;
  apiTokenInstance: string;
  setInstance: (idInstance: string, apiTokenInstance: string) => void;
  logOut: () => void;
}

const AppContext = createContext<InstanceContextType | undefined>(undefined);

export const InstanceProvider: FC<{ children: ReactNode }> = ({children}) => {
  const localIdInstance = localStorage.getItem('idInstance') || '';
  const localApiTokenInstance = localStorage.getItem('apiTokenInstance') || '';
  const [idInstance, setIdInstance] = useState<string>(localIdInstance);
  const [apiTokenInstance, setApiTokenInstance] = useState<string>(localApiTokenInstance);

  const setInstance = (id: string, token: string) => {
    setIdInstance(id);
    setApiTokenInstance(token);
    localStorage.setItem('idInstance', id);
    localStorage.setItem('apiTokenInstance', token);
  };

  const logOut = () => {
    setIdInstance('');
    setApiTokenInstance('');
    localStorage.clear();
  };

  return (
    <AppContext.Provider value={{idInstance, apiTokenInstance, setInstance, logOut}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useInstance must be used within an InstanceProvider');
  }
  return context;
};
