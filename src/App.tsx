// import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import AIPage from "./pages/AIPage";
import LoginPage from "./pages/LoginPage";
import GetToken from "./pages/GetToken";
export default function App() {
  const location = useLocation()
  const appHidden = ["/token", "/"]
  return (
    <section>
      <SidebarProvider>
        {!appHidden.includes(location.pathname) && <AppSidebar />}
        <main className="w-full bg-white">
          <Routes>
            <Route path="/tasks/:id" element={<HomePage />} />
            <Route path="/tasks" element={<HomePage />} />
            <Route path="ai" element={<AIPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/token" element={<GetToken />} />
          </Routes>
        </main>
      </SidebarProvider>

    </section>
  );
}