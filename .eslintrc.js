module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "vue/no-unused-components": "warn",
    "sort-imports": "warn",
    camelcase: "warn",
    "vue/valid-template-root": "warn",
    "indent": ["warn", 2],
    "eqeqeq": "warn",
    "handle-callback-err": "warn",
    "prefer-promise-reject-errors": "warn",
    "no-unused-vars": "warn",
    "no-undef": "warn",
    "new-cap": "warn",
  }
}