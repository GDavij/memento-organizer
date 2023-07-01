import { SidebarProvider } from "./dashboard/contexts/useSidebar";
import { TopBarProvider } from "./dashboard/contexts/useTopBar";
import "./globals.css";
import { Inter } from "next/font/google";
import "react-toastify/dist/ReactToastify.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Memento Organizer",
  description: "Your Personal Organizer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBarProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </TopBarProvider>
      </body>
    </html>
  );
}
