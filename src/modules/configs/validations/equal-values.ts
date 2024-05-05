import { registerDecorator, ValidationArguments } from 'class-validator';

export function EqualValues() {
    return function(object: object, propertyName: string): void {
        registerDecorator({
            name: 'equalValues',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: '$property must be equivalent to true or false',
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return args.object['name'] === 'IS_WORK_TRANSACTIONS' ? ['true', 'false'].includes(value) : true;
                },
            },
        });
    };
}