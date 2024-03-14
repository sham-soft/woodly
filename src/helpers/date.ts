export function isToday(date: Date) {
    const today = new Date();

    return today.toDateString() === date.toDateString();
}