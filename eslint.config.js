import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'build',
    'coverage',
    'node_modules',
    '**/assets/data',
    '**/assets/js',
  ]),

  // JS + TS
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...ts.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
        },
      ],
    },
  },

  // React
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      react.configs.flat['recommended'],
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 'off',
    },
  },

  // A11Y
  {
    files: ['**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },

  // Testing
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [
      jestDom.configs['flat/recommended'],
      testingLibrary.configs['flat/react'],
      vitest.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      'testing-library/no-node-access': [
        'error',
        {
          'allowContainerFirstChild': true,
        },
      ],
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            'check*',
            'expect',
            'testHelper*',
            '*TestHelper',
          ],
        },
      ],
    },
  },

  // Formatting
  prettier,
]);
