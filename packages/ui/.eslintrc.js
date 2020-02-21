module.exports = {
  extends: [
    '../../.eslintrc.js',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:vue/essential',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      }
    ],
    'max-len': 1
  },
  settings: {
    'import/resolver': {
      'typescript': {},
    }
  }
}
