import { useContext, createContext, useState, ReactNode } from 'react';

type TImageStorageCacheContext = {
  hasCached(id: string): string | null;
  addCache(id: string, data: string): boolean;
  removeCache(id: string): boolean;
  hasCachedOnTrash(id: string): string | null;
};

const ImageStorageCacheContext = createContext({} as TImageStorageCacheContext);

export function ImageStorageCacheProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cachedOnTrash, setCachedOnTrash] = useState<any>({});
  const [cachedDatas, setCachedDatas] = useState<any>({});

  function addToTrash(id: string, data: string) {
    const newCachedOnTrash = { ...cachedOnTrash };
    newCachedOnTrash[id] = data;
    setCachedOnTrash(newCachedOnTrash);
    return true;
  }

  function removeFromTrash(id: string) {
    const newCachedOnTrash = { ...cachedOnTrash };
    delete newCachedOnTrash[id];
    setCachedOnTrash(newCachedOnTrash);
    return true;
  }

  const ImageStorageCacheActions: TImageStorageCacheContext = {
    hasCached(id: string) {
      if (typeof cachedDatas[id] == 'string') return cachedDatas[id];
      return null;
    },
    addCache(id: string, data: string) {
      const newCachedDatas = { ...cachedDatas };
      newCachedDatas[id] = data;
      setCachedDatas(newCachedDatas);
      return true;
    },
    removeCache(id: string) {
      const newCachedDatas = { ...cachedDatas };

      const thrashCache = newCachedDatas[id];
      addToTrash(id, thrashCache);
      delete newCachedDatas[id];
      setCachedDatas(newCachedDatas);
      return true;
    },
    hasCachedOnTrash(id: string) {
      if (typeof cachedOnTrash[id] === 'string') {
        const aux = { ...cachedOnTrash }[id];
        removeFromTrash(id);
        return aux;
      }
      return null;
    },
  };
  return (
    <ImageStorageCacheContext.Provider value={ImageStorageCacheActions}>
      {children}
    </ImageStorageCacheContext.Provider>
  );
}

export const useImageStorageCacheContext = () =>
  useContext(ImageStorageCacheContext);
