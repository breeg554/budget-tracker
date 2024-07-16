const path = require('path');

/** @type {import("prettier").Config} */
module.exports = {
  ...require(path.resolve(__dirname, '../../prettier.config.cjs')),
  plugins: [
    path.resolve(__dirname, 'node_modules/@ianvs/prettier-plugin-sort-imports/lib/src/index.js')
  ],
  importOrderParserPlugins: ["typescript"],
  importOrder: [
    '^nestjs$',
    '^@nestjs/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '<BUILTIN_MODULES>',
    '',
    '^@/(.*)$',
    '^~/(.*)$',
    '',
    '^[./]',
  ],
};
