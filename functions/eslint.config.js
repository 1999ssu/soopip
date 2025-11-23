const { ESLintUtils } = require("@typescript-eslint/utils");

module.exports = [
  {
    files: ["*.ts", "*.tsx"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": ESLintUtils,
    },
    rules: {
      // TypeScript 추천 룰
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-expressions": "off", // 기존 에러 룰 끄기
    },
  },
  {
    files: ["*.js"],
    rules: {},
  },
];
