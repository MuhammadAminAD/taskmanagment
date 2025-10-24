import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoutes() {


    function handleCheckisActiveUser(): boolean {
        const accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")

        if (accessToken && refreshToken) {
            return true
        } else {
            return false
        }
    }
    return handleCheckisActiveUser() ? <Outlet /> : <Navigate to={"/login"} replace/>
}
