/* eslint @typescript-eslint/no-var-requires: 0 */
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:promise/recommended',
    'plugin:import/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_',
        varsIgnorePattern: '_',
        caughtErrorsIgnorePattern: '_',
      },
    ],
    eqeqeq: 'error',
    'import/default': 'off',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/order': ['error', { 'newlines-between': 'always' }],
    'no-console': 'warn',
    'no-inner-declarations': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'tailwindcss/classnames-order': [
      'error',
      {
        callees: ['twMerge', 'cn', 'classnames', 'clsx', 'ctl', 'cva', 'tv'],
        prependCustom: true,
      },
    ],
    'tailwindcss/no-custom-classname': [
      'warn',
      {
        callees: ['twMerge', 'cn', 'classnames', 'clsx', 'ctl', 'cva', 'tv'],
        config: path.resolve(__dirname, 'tailwind.config.ts'),
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  overrides: [
    {
      files: ['src/components/ui/*.tsx'],
      rules: {
        'tailwindcss/no-custom-classname': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
