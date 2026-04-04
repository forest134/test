# 数独游戏

一个简洁的数独游戏，基于 Next.js 构建。

## 部署到 Cloudflare Pages

### 方法一：使用 Wrangler CLI

```bash
npm run build
npx wrangler pages deploy out --project-name=sudoku-game
```

### 方法二：Git 集成

1. 将代码推送到 GitHub 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 Pages → Create a project → Connect to Git
4. 选择仓库，设置构建命令为 `npm run build`，输出目录为 `out`

## 本地开发

```bash
npm install
npm run dev
```

## 功能

- ⌨️ 点击格子输入数字
- 🗑️ 清除按钮删除当前格子的数字
- 🔮 求解按钮自动填充当前选中的空格
- 🔄 重置按钮恢复初始状态
- ✓ 完成后自动提示
