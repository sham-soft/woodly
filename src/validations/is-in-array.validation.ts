import { registerDecorator } from 'class-validator';

export function IsInArray(allowValues: string[]) {
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
                    return values.every((value: string) => allowValues.includes(value));
                },
            },
        });
    };
}