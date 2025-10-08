import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Menu1 from "@/components/drawer";
// import { AppSidebar } from "../components/app-sidebar";

export const metadata: Metadata = {
  title: "Plataforma de Aulas",
  description: "Criado por brunolobo2110@gmail.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar-state")?.value === "true";

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="min-h-screen w-full overflow-x-hidden bg-telas">
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex min-h-screen w-full">
            {/* <AppSidebar /> */}
            <main className="flex-1 w-full">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
