import { IItems } from "../../../types/index.types";

export interface iCreateTaskProps {
    isUpdate?: boolean;
    data?: IItems;
    handleClose?: () => void;
}

export interface ApiError {
    data?: {
        message?: string;
    };
    status?: number;
}

export type RTKQueryError = {
    status: number;
    data: {
        message: string;
    };
}


