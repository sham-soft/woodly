module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'import', // Добавление плагина eslint-plugin-import
    ],
    extends: ['plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'error', // Нужно обязательно указывать у функции возвращаемый тип
        '@typescript-eslint/no-explicit-any': 'off', // Допускает свободное использование any
        'eol-last': ['error', 'never'], // Нужен ли пробел вконце документа (always - нужен, never - не нужен)
        semi: ['error', 'always'], // Чтобы в конце были всегда точка с запятой
        quotes: [ // Одинарные кавычки
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        'max-len': ['error', { code: 140 }], // Максимальная длина кода в строке
        'comma-dangle': ['error', 'always-multiline'], // Чтобы в конце всегда были запятые
        curly: ['error', 'all'], // Чтобы всегда были фигурные скобки
        'brace-style': ['error', '1tbs'], // Стиль фигурных скобок (первая скобка не переносится на новую строку)
        'space-before-function-paren': [ // Запрещает пробел у функций перед скобками
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'no-multiple-empty-lines': ['error', { 'max': 1 }], // Запрещает пустые новые строки больше одной
        'no-multi-spaces': 'error',
        indent: [
            'error',
            4, // Устанавливает определенный отступ
            {
                'SwitchCase': 1, // разрешает отступ в switch
                "ignoredNodes": ["PropertyDefinition"] // разрешает не делать отступ под декораторами
            }
        ],
        'arrow-body-style': ['error', 'as-needed'], // Убирает лишние return при возвращении чего то в функции
        'import/order': [ // Порядок импортов
            'error',
            {        
                'groups': [
                    'builtin',
                    'external',
                    'sibling',
                    'parent',
                    'index',
                    'object',   
                    'type'
                ],
                'alphabetize': { 'order': 'desc' }
            }
        ],
    },
};
