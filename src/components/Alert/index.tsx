import { createContext, useState } from "react";
import type { AlertType, AlertItem, AlertContextType } from "./alert.types";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const addAlert = (title: string, status: AlertType) => {
        const id = Date.now();
        setAlerts((prev) => [...prev, { id, title, status }]);
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 3000);
    };

    return (
        <AlertContext.Provider value={{ addAlert }}>
            {children}

            <div className="fixed top-[10vh] left-1/2 -translate-x-1/2 space-y-2 z-50">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`px-4 py-2 rounded-md text-white shadow-md transition-all ${alert.status === "success" ? "bg-green-600" : "bg-red-600"
                            }`}
                    >
                        {alert.title}
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export { AlertContext };
