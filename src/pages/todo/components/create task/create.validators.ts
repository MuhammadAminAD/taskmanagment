import { tCreateTodoErrors } from "./create.reducers";
import { isValidDate, isDateInPast } from "./create.utils";

interface ValidateFormParams {
    title: string;
    date?: string;
    isUpdate: boolean;
}

export const validateForm = ({ title, date, isUpdate }: ValidateFormParams): { isValid: boolean; errors: tCreateTodoErrors } => {
    const newErrors: tCreateTodoErrors = {};

    // Title validatsiya
    if (!title.trim()) {
        newErrors.title = "Task title is required";
    } else if (title.trim().length < 3) {
        newErrors.title = "Task title must be at least 3 characters";
    } else if (title.trim().length > 100) {
        newErrors.title = "Task title must be less than 100 characters";
    }

    // Date validatsiya (faqat yangi task uchun)
    if (!isUpdate) {
        if (!date) {
            newErrors.date = "Deadline date is required";
        } else if (isDateInPast(date)) {
            newErrors.date = "Cannot create task in the past";
        } else if (!isValidDate(date)) {
            newErrors.date = "Invalid date format";
        }
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
};