
import { AlertProvider } from "./components/Alert";
import IndexRoutes from "./routes";

export default function App() {
  return (
    <AlertProvider>
      <IndexRoutes />
    </AlertProvider>
  )
}
