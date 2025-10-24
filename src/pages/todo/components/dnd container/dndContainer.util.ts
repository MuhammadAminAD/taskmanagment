export const STATUS_CONFIG = [
    { value: "success", key: "success", label: "success", color: "bg-green-600" },
    { value: "in progress", key: "progress", label: "in-progress", color: "bg-orange-600" },
    { value: "to do", key: "todo", label: "to do", color: "bg-rose-600" },
] as const;

export const STATUS_MAP = {
    progress: "in-progress",
    success: "success",
    todo: "to-do"
} as const;

export const OVER_ID_TO_STATUS = {
    "to do": "todo",
    "in progress": "progress",
    "success": "success"
} as const;