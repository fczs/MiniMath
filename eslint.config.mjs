import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import stylistic from '@stylistic/eslint-plugin';

export default tsEslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tsEslint.configs.recommended,
      prettierConfig,
    ],
    files: ['./src/**/*.ts', './src/**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'do', 'switch', 'try'] },
        { blankLine: 'always', prev: 'expression', next: ['if', 'for', 'while', 'do', 'switch', 'try'] },
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
  {
    extends: [js.configs.recommended, prettierConfig],
    files: ['*.js', '*.mjs', '*.cjs'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
);
