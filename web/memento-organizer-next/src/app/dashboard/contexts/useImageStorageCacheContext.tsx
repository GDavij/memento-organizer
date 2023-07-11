import { useContext, createContext, useState, ReactNode } from 'react';

type TImageStorageCacheContext = {
  hasCached(id: string): string | null;
  addCache(id: string, data: string): boolean;
  removeCache(id: string): boolean;
};

const ImageStorageCacheContext = createContext<TImageStorageCacheContext>({
  addCache() {
    return false;
  },
  removeCache() {
    return false;
  },
  hasCached() {
    return null;
  },
});

export function ImageStorageCacheProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cachedDatas, setCachedDatas] = useState<any>({});
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
      delete newCachedDatas[id];
      setCachedDatas(newCachedDatas);
      return true;
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
