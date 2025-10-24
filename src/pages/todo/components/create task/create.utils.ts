export const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

export const isDateInPast = (date: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date + 'T00:00:00');
    return selectedDate < today;
};

export const formatDateTimeToISO = (dateString: string, timeString: string): string => {
    const combined = `${dateString}T${timeString}`;
    const dateObj = new Date(combined);
    // Local vaqtni to'g'ri ISO formatga o'tkazish
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString();
};