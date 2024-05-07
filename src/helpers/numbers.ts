export function getFixedFloat(value: number, countFixed: number): number {
    return parseFloat(value.toFixed(countFixed));
}

export function getPercentOfValue(percent: number, value: number): number {
    return percent * value / 100;
}

export function getSumWithPercent(percent: number, value: number): number {
    const percentOfValue = getPercentOfValue(percent, value);
    return getFixedFloat((value + percentOfValue), 2);
}

export function getSumWithoutPercent(percent: number, value: number): number {
    const percentOfValue = getPercentOfValue(percent, value);
    return getFixedFloat((value - percentOfValue), 2);
}