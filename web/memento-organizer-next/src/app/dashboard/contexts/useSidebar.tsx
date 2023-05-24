"use client";
import { NavigationBar } from "../components/navigationBar";
import {
  Provider,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

type TSidebarContext = {
  openClose: () => void;
  open: boolean;
};

const SidebarContext = createContext<TSidebarContext>({
  openClose() {},
  open: false,
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const sidebarActions: TSidebarContext = {
    openClose: () => {
      setOpenSidebar((prev) => !prev);
    },
    open: openSidebar,
  };

  return (
    <SidebarContext.Provider value={sidebarActions}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
