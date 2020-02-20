module.exports = {
  env: {
    es2020: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],

    /* ESLint can't work without this. It sets the root dir to the directory of the whole monorepo 
     * so eslint knows where to find the tsconfig.json. */
    tsconfigRootDir: __dirname

  },
    
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  /* Resolving clashing airbnb rules for import/extensions. Otherwise it requires .ts at the end of import. */
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'max-len': 1
  },
  /* Resolving clashing airbnb settings for import */
  settings: {
    'import/extensions': ['.js','.jsx','.ts','.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts','.tsx']
    },
    'import/resolver': {
      'node': {
        'extensions': ['.js','.jsx','.ts','.tsx']
      }
    }
  }
}
