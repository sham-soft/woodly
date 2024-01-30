module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'eol-last': ['error', 'never'], // Нужен ли пробел вконце документа (always - нужен, never - не нужен)
        semi: ['error', 'always'], // Чтобы в конце были всегда точка с запятой
        quotes: [
            'error',
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ], // Одинарные кавычки
        'max-len': ['error', { code: 140 }],
        'comma-dangle': ['error', 'always-multiline'], // Чтобы в конце всегда были запятые
        curly: ['error', 'all'], // Чтобы всегда были фигурные скобки
        'brace-style': ['error', '1tbs'], // Стиль фигурных скобок (первая скобка не переносится на новую строку)
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
    },
};
