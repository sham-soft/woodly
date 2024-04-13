export function getFixedFloat(value: number, countFixed: number): number {
    return parseFloat(value.toFixed(countFixed));
}