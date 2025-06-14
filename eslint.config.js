const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: [
      'dist/',
      'dist-test/',
      '*.js',
      '*.cjs',
      '*.mjs',
      'test/**/*.js',
      'src/**/*.js'
    ]
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {}
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jasmine: 'readonly',
        pending: 'readonly',
        console: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {}
  }
];
