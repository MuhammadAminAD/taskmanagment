export type TStatus = "success" | "in progress" | "to do"

export interface IItems {
    id: string;
    title: string;
    status: TStatus;
    created: number;
    expire: number;
    group_id: number
}

export interface IGroups {
    id: string,
    title: string
}

export interface ITodo { success: IItems[], todo: IItems[], progress: IItems[] }