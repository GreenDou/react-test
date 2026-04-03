# React 19 Feature Lab

一个面向 **GitHub Pages** 的 React 19 Showcase / Playground，基于 **Vite + React 19 + TypeScript**。

这个项目的目标不是做一页静态宣传页，而是把 React 19 里真正值得体验的能力做成一个可以直接点、直接看的实验台，并明确区分：

- 哪些特性适合在纯客户端 / 纯静态环境里做交互 demo
- 哪些特性只能做原理说明
- 哪些特性必须依赖服务端运行时，不能在 GitHub Pages 里真实演示

在线部署基址按 GitHub Pages 配置为：`/react-test/`

## 页面内容

项目包含这些核心区块：

1. **首页 / 导览**
   - 介绍实验目标、静态部署边界、推荐浏览路径
2. **Actions + useActionState + useFormStatus**
   - 异步表单 demo
   - 传统 `onSubmit + useState` vs React 19 Action 模型
3. **useOptimistic**
   - 评论发送 optimistic UI demo
   - 可切换成功 / 失败，观察回滚
4. **use(promise) + Suspense**
   - 客户端可运行 demo
   - 使用模块级缓存保存 Promise / Resource，避免 render 时无限重建
5. **ref as prop**
   - `forwardRef` vs React 19 直接 `ref` prop
6. **Context provider 简化写法**
   - `<Context.Provider>` vs `<Context value={...}>`
7. **Document metadata**
   - 组件内声明 `<title>` / `<meta>`
   - 观察浏览器文档标题与 description 实时变化
8. **Web Components / Custom Elements**
   - 演示 React 19 对对象 prop、自定义事件、custom element 互操作的友好支持
9. **React 19 全量关注点总览**
   - 标注「已做交互 demo / 仅原理说明 / 不适合纯静态 Pages」

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物输出到 `dist/`，可直接用于 GitHub Pages 部署。

## GitHub Pages

已包含 `.github/workflows/deploy.yml`，默认在 `main` 分支 push 后自动部署。

同时已完成：

- `vite.config.ts` 设置 `base: '/react-test/'`
- `package.json` 设置 `homepage`
- `index.html` 使用 `%BASE_URL%favicon.svg`

## 纯静态环境下的限制

以下 React 19 相关能力在本项目里只做说明，不做“伪 demo”：

- **Server Components**
- **Server Actions / `use server`**
- **react-dom 的 streaming / static / resume 系列服务端 API**
- 某些更偏 **SSR / hydration / 资源编排** 的能力（如 hydration 错误细化、preinit / preload / preconnect 的真实收益）

原因很简单：GitHub Pages 只负责托管静态文件，不提供 Node / Edge / server runtime。

## 技术栈

- React 19
- React DOM 19
- Vite
- TypeScript
- ESLint

## 设计取向

- 中文讲解为主，术语尽量贴近 React 官方语义
- 桌面端左侧导航，移动端顶部导航
- 每个主题都强调「传统写法 vs React 19 写法」
- 先讲可运行能力，再讲边界，不把服务端能力硬伪装成客户端 demo
