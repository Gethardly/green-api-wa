import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface InstanceContextType {
  idInstance: string;
  apiTokenInstance: string;
  setInstance: (idInstance: string, apiTokenInstance: string) => void;
  clearInstance: () => void;
}

const InstanceContext = createContext<InstanceContextType | undefined>(undefined);

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

  const clearInstance = () => {
    setIdInstance('');
    setApiTokenInstance('');
  };

  return (
    <InstanceContext.Provider value={{idInstance, apiTokenInstance, setInstance, clearInstance}}>
      {children}
    </InstanceContext.Provider>
  );
};

export const useInstance = () => {
  const context = useContext(InstanceContext);
  if (!context) {
    throw new Error('useInstance must be used within an InstanceProvider');
  }
  return context;
};
