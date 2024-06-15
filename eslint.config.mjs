// Import necessary modules
import eslint from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Configuration for TypeScript and JavaScript files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,  // Use TypeScript parser
      globals: {
        ...globals.node,  // Include Node.js globals
        ...globals.es2021,  // Include ECMAScript 2021 globals
      },
      sourceType: 'module',  // ECMAScript module system
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,  // ESLint recommended rules
      ...tsPlugin.configs.recommended.rules,  // TypeScript recommended rules
      ...prettierConfig.rules,  // Prettier rules
      'no-unused-vars': 'off',  // Disable ESLint's unused vars rule in favor of TypeScript's rule
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // TypeScript's rule for unused vars
      'no-undef': 'error',  // Error for undefined variables
      'prefer-const': 'error',  // Prefer const declarations
      'no-console': 'warn',  // Warn on console.log statements
    },
  },
  // Specify paths to ignore
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
];
