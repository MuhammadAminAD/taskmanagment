export type AlertType = "success" | "error";

export interface AlertItem {
    id: number;
    title: string;
    status: AlertType;
}

export interface AlertContextType {
    addAlert: (title: string, status: AlertType) => void;
}
