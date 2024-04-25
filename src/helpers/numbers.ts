export function getFixedFloat(value: number, countFixed: number): number {
    return parseFloat(value.toFixed(countFixed));
}

export function getSumWithPercent(percent: number, value: number): number {
    const percentOfValue = percent * value / 100;
    return getFixedFloat((value + percentOfValue), 2);
}