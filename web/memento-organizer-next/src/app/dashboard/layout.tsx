"use client";
import { SidebarProvider, useSidebar } from "./contexts/useSidebar";
import { ReactNode, useState } from "react";
import { NavigationBar } from "./components/navigationBar";
import { TopBar } from "./components/topBar";
import { EditorProvider } from "./contexts/editor/useEditor";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import { TBaseNoteData, TBaseText } from "@/models/data/editorTypes";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: TBaseNoteData;
    Text: TBaseText;
  }
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { openClose, open } = useSidebar();
  return (
    <EditorProvider>
      <TopBar />
      <div className="w-full h-full flex flex-shrink flex-grow-0 overflow-auto">
        <NavigationBar hidden={open} />
        <div className=" w-full h-full flex flex-col items-center pt-8 overflow-auto">
          {children}
        </div>
      </div>
    </EditorProvider>
  );
}
