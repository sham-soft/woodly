export function isToday(date: Date): boolean {
    const today = new Date();

    return today.toDateString() === date.toDateString();
}

export function getСurrentDateToString(): string {
    return  new Date().toLocaleString( 'sv', { timeZoneName: 'short' } );
}