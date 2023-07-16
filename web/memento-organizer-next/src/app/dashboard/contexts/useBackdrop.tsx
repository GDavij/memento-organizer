import { ReactNode, createContext, useContext, useState } from 'react';

type TUseBackdropContext = {
  dropBackdrop: boolean;
  setDropBackdrop: (dropBackdrop: boolean) => void;
};

const BackdropContext = createContext({} as TUseBackdropContext);

type TBackdropProvider = {
  children: ReactNode;
};
export function BackdropProvider({ children }: TBackdropProvider) {
  const [drop, setDrop] = useState(false);
  const backdropActions: TUseBackdropContext = {
    dropBackdrop: drop,
    setDropBackdrop(dropBackdrop: boolean) {
      setDrop(dropBackdrop);
    },
  };

  return (
    <BackdropContext.Provider value={backdropActions}>
      {children}
    </BackdropContext.Provider>
  );
}

export const useBackdrop = () => useContext(BackdropContext);
