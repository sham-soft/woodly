export function getEnumIntValues(values: object): number[] {
    return Object.values(values).filter((v) => !isNaN(Number(v)));
}