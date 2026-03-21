export const getFriendlyDateLabel = (dateInput: Date | string): string => {
    const date = new Date(dateInput);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // 1. Precise check for Today and Yesterday
    if (compareDate.getTime() === today.getTime()) return "Today";
    if (compareDate.getTime() === yesterday.getTime()) return "Yesterday";

    // 2. If it's the current year, show "Month Day" (e.g. "August 24")
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
    }

    // 3. For older years, show "Month Year" (e.g. "September 2024")
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
};
