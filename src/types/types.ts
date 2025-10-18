export type stageType = "success" | "in-progress" | "to-do"
export type itemType = {title: string , id: string , done: boolean}
export type TaskType = { id:string , title: string ,expire: string , status: stageType , items: itemType[] , group_id: number, created: Date }