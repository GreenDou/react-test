# React 19 Feature Lab

一个面向 **GitHub Pages** 的 React 19 导览站 / Playground，基于 **Vite + React 19 + TypeScript**。

这次重构后的目标很明确：

- **首页先做导览，不再一上来把所有 feature 卡片堆满。**
- **把内容分层**：
  1. 导览 / 推荐浏览路径
  2. 可直接体验的 React 19 新能力
  3. 不能在线真跑，但仓库里已真实实现的代码案例
  4. 完整特性地图
- **讲解先说人话，再说 API 名字。**
- 对于 **Server Components / Server Actions / SSR / hydration / 资源编排** 这类不适合在静态 Pages 上伪装成 demo 的内容，
  **不再只写一句“这里不能展示”**，而是新增 `reference-code/` 目录放真实项目片段，并在页面里做代码讲解。

在线部署基址按 GitHub Pages 配置为：`/react-test/`

## 新的信息架构

### 1) 首页 / 导览总控台
先告诉读者这站怎么逛：
- 先玩 demo
- 或先看代码案例
- 最后用特性地图收束全貌

### 2) 可直接体验的能力
这些可以在纯静态 GitHub Pages 上真实运行：
- Actions / `useActionState` / `useFormStatus`
- `useOptimistic`
- `use()` + `Suspense`
- `ref as prop`
- Context provider 简化写法
- Document metadata
- Web Components / Custom Elements 互操作

### 3) 代码案例讲解区
这些不伪装成在线 demo，而是展示仓库中的真实代码案例：
- Server Components
- Server Actions / `use server`
- `react-dom` 的服务端输出 API：`prerender` / `stream` / `resume`
- `preload` / `preinit` / `preconnect`
- hydration 错误改进与 SSR 场景价值

### 4) 完整特性地图
用一张总览说明：
- 哪些可以直接体验
- 哪些更适合看代码
- 每一类真正需要什么运行环境

## `reference-code/` 目录

新增了 `reference-code/` 目录，里面放的是 **真实可读的项目片段**，不参与当前静态页面运行，但会被页面通过 raw import 当作代码讲解素材展示。

目录包括：

- `reference-code/server-components/`
- `reference-code/server-actions/`
- `reference-code/server-rendering/`
- `reference-code/resource-hints/`
- `reference-code/hydration/`

## 本地开发

```bash
npm install
npm run dev
```

## 构建与检查

```bash
npm run build
npm run lint
```

构建产物输出到 `dist/`，可直接用于 GitHub Pages 部署。

## GitHub Pages

已兼容当前 GitHub Pages 配置：

- `vite.config.ts` 设置 `base: '/react-test/'`
- `package.json` 设置 `homepage`
- 保持静态部署方式不变

## 为什么有些能力不做在线 demo？

因为 GitHub Pages 只托管静态文件，不提供 Node / Edge / server runtime。

所以像下面这些能力：
- Server Components
- Server Actions / `use server`
- `react-dom` 的 streaming / static / resume 系列 API
- 需要 SSR + hydration 才有代表性的能力

更靠谱的做法不是“伪造一个看起来像能跑的 demo”，而是：
- **页面里讲清楚边界**
- **仓库里给出真实代码片段**
- **告诉读者运行前提是什么**

## 技术栈

- React 19
- React DOM 19
- Vite
- TypeScript
- ESLint

## 设计取向

- 中文讲解为主，尽量先说问题，再说 API
- 桌面端分组侧边导航，移动端分组顶部导航
- demo 页和代码讲解页分开，减少信息噪音
- 所有可在线运行的 demo 都保留，并重新组织顺序
- 对服务端能力提供真实代码案例，不再只做一句话说明
