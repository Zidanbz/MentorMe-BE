module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    // "ecmaVersion": 2018,
    "ecmaVersion": 2022,
    "sourceType": 'module',
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["off"], // Menonaktifkan aturan penggunaan tanda kutip
    "new-cap": ["off"], // Menonaktifkan aturan untuk fungsi dengan nama huruf kapital
    "max-len": ["off"], // Menonaktifkan batas panjang baris
    "prefer-arrow-callback": ["off"], // Menonaktifkan aturan untuk preferensi callback arrow function
    "indent": ["off"], // Menonaktifkan aturan indentasi
    "no-var": ["off"], // Menonaktifkan aturan penggunaan var
    "object-curly-spacing": ["off"], // Menonaktifkan aturan spasi dalam kurung kurawal
    "eol-last": ["off"], // Menonaktifkan aturan newline di akhir file
    "semi": ["off"],
    "comma-spacing": ["off"],
    "space-before-blocks": ["off"],
    "comma-dangle": ["error", "always-multiline"],
    "require-jsdoc": "off",
    "keyword-spacing": ["error", {
      "before": false, // Menyuruh ada spasi sebelum kata kunci (misal: 'if' harus diikuti oleh spasi)
      "after": true, // Menyuruh ada spasi setelah kata kunci (misal: 'if' diikuti spasi setelahnya)
    }],
    "space-before-function-paren": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "padded-blocks": ["error", "never"],
    "guard-for-in": "off",
    "valid-jsdoc": "off",
    "prefer-promise-reject-errors": "off",
    "linebreak-style": 0,
    "no-unused-vars": ["warn", { "vars": "all", "args": "none" }],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
