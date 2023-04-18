# @lincy/eslint-config

A set of opinionated ESLint (http://eslint.org) rules (all rules included) tailored for Vue.js projects

如果依赖安装了 typescript, 则自动应用 ts 的规则
如果依赖安装了 prettier, 则自动应用 prettier 的规则

Usage

- pnpm install -D eslint @lincy/eslint-config
- create a file named .eslintrc in your project:
```
{
  "extends": "@lincy"
  // Your overrides...
}
```

License

MIT
