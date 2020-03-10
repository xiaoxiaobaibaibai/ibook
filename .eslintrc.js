module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-irregular-whitespace": 'off',
    'no-trailing-spaces': 'off',
    'indent': 'off',
    'space-before-function-paren': 'off',
    'spaced-comment': 'off',
    'quote-props': 'off'

  }
}
