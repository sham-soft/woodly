export function getEnumIntValues(values: object): number[] {
    return Object.values(values).filter((v) => !isNaN(Number(v)));
}

export function getEnumIntValuesToString(values: object): string[] {
    return Object.keys(values).filter((v) => !Number.isNaN(Number(v)));
}