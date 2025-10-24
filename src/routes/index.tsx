import { Route, Routes, useLocation } from "react-router-dom";
import ToDo from "../pages/todo";
import Auth from "../pages/auth";
import GetToken from "../pages/token";
import Aside from "../components/shared/Aside";
import NotesPage from "../pages/notes";
import Lessons from "../pages/notes/detail page";
import ProtectedRoutes from "./protectedRoutes";

export default function IndexRoutes() {
    const location = useLocation();
    const hiddenAsideRoutes = ["/login", "/token"];

    const showAside = !hiddenAsideRoutes.includes(location.pathname);

    return (
        <div className="w-full h-screen flex overflow-hidden">
            {/* 🔹 ASIDE */}
            {showAside && (
                <aside className="w-1/5 h-full sticky top-0 overflow-y-auto border-r border-neutral-200">
                    <Aside />
                </aside>
            )}

            {/* 🔹 MAIN CONTENT */}
            <main className="flex-1 h-full overflow-y-auto">
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/todo" element={<ToDo />} />
                        <Route path="/todo/:id" element={<ToDo />} />
                        <Route path="/note" element={<NotesPage />} />
                        <Route path="/note/:id" element={<Lessons />} />
                    </Route>
                    <Route path="/token" element={<GetToken />} />
                </Routes>
            </main>
        </div>
    );
}
