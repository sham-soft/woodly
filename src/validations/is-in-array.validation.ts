import { registerDecorator } from 'class-validator';

export function IsInArray<T = string>(allowValues: T[]) {
    return function(object: object, propertyName: string): void {
        registerDecorator({
            name: 'isInArray',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: `$property must be one of the following values: ${allowValues.join(', ')}`,
            },
            validator: {
                validate(values: any) {
                    values = Array.isArray(values) ? values : [values];
                    return values.every((value: T) => allowValues.includes(value));
                },
            },
        });
    };
}