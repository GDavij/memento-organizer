"use client";
import { Note } from "@/models/data/note";
import {
  Provider,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

type TPageDetails = {
  pageName: string;
  editorOptionsContext?: Note;
};

type TTopBarContext = {
  pageDetails: TPageDetails;
  setPageDetails: (newName: TPageDetails) => void;
  isEditingNote?: boolean;
  setIsEditingNote?: (isEditing: boolean) => void;
};

const TopBarContext = createContext<TTopBarContext>({
  pageDetails: { pageName: "" },
  setPageDetails(newDetails: TPageDetails) {},
});

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [pageDetails, setPageDetails] = useState<TPageDetails>({
    pageName: "",
  });
  const sidebarActions: TTopBarContext = {
    pageDetails,
    setPageDetails(newDetails: TPageDetails) {
      setPageDetails(newDetails);
    },
  };

  return (
    <TopBarContext.Provider value={sidebarActions}>
      {children}
    </TopBarContext.Provider>
  );
}

export const useTopBar = () => useContext(TopBarContext);
