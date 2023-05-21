"use client";
import { SidebarProvider, useSidebar } from "./contexts/useSidebar";
import { ReactNode, useState } from "react";
import { NavigationBar } from "./components/navigationBar";
import { TopBar } from "./components/topBar";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { openClose, open } = useSidebar();
  return (
    <>
      <TopBar />
      <div className="w-full h-full flex flex-shrink flex-grow-0 overflow-auto">
        <NavigationBar hidden={open} />
        <div className=" w-full h-full flex flex-col items-center pt-8 overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}
