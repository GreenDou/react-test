import productPageServer from '../../reference-code/server-components/ProductPage.server.tsx?raw'
import productGalleryClient from '../../reference-code/server-components/ProductGallery.client.tsx?raw'
import serverComponentsData from '../../reference-code/server-components/data.ts?raw'
import serverActionsForm from '../../reference-code/server-actions/CheckoutForm.tsx?raw'
import serverActionsActions from '../../reference-code/server-actions/actions.ts?raw'
import serverActionsDb from '../../reference-code/server-actions/db.ts?raw'
import serverRenderingRequest from '../../reference-code/server-rendering/request-handler.tsx?raw'
import serverRenderingStatic from '../../reference-code/server-rendering/static-prerender.tsx?raw'
import serverRenderingStorage from '../../reference-code/server-rendering/storage.ts?raw'
import resourceHintsArticle from '../../reference-code/resource-hints/ArticlePage.tsx?raw'
import resourceHintsVideo from '../../reference-code/resource-hints/VideoHero.tsx?raw'
import hydrationMismatch from '../../reference-code/hydration/ClockThatMismatches.tsx?raw'
import hydrationSafe from '../../reference-code/hydration/HydrationSafeClock.tsx?raw'
import hydrationClientEntry from '../../reference-code/hydration/client-entry.tsx?raw'
import type { ReferenceCase } from '../types'

export const referenceCases: Record<string, ReferenceCase> = {
  'server-components': {
    title: 'Server Components',
    summary: '演示“页面主体在服务端完成，客户端只接交互岛”的真实分工。',
    environment: '需要支持 RSC 的框架和服务端模块边界。',
    whyNotOnPages:
      'GitHub Pages 只会托管构建后的静态文件，不能在请求到来时执行服务器组件，也没有 RSC payload 这层协议。',
    files: [
      {
        label: '页面主体（服务端）',
        path: 'reference-code/server-components/ProductPage.server.tsx',
        summary: '负责读数据、拼页面主结构，并把真正需要交互的部分留给客户端组件。',
        code: productPageServer,
      },
      {
        label: '图片库（客户端交互岛）',
        path: 'reference-code/server-components/ProductGallery.client.tsx',
        summary: '只处理图片切换这类浏览器端交互，体现 server / client 分工。',
        code: productGalleryClient,
      },
      {
        label: '数据读取',
        path: 'reference-code/server-components/data.ts',
        summary: '模拟服务端读取商品与推荐列表，帮助理解 server component 为什么擅长“先拿数据再出结构”。',
        code: serverComponentsData,
      },
    ],
  },
  'server-actions': {
    title: 'Server Actions / use server',
    summary: '演示“服务端动作 + 客户端表单状态 + 缓存刷新 / 跳转”如何贴着业务一起写。',
    environment: '需要 Server Actions 运行时、框架路由和缓存系统。',
    whyNotOnPages:
      '静态站点没有真正的服务器函数可执行，所以你在 Pages 上只能模拟客户端 Action 的心智，不能真跑 use server。',
    files: [
      {
        label: '客户端表单',
        path: 'reference-code/server-actions/CheckoutForm.tsx',
        summary: '展示 useActionState / useFormStatus 如何和服务端动作对接。',
        code: serverActionsForm,
      },
      {
        label: '服务端动作',
        path: 'reference-code/server-actions/actions.ts',
        summary: '把校验、写入、revalidate、redirect 贴着业务动作排在一起。',
        code: serverActionsActions,
      },
      {
        label: '数据层示意',
        path: 'reference-code/server-actions/db.ts',
        summary: '模拟数据库层，说明 Server Actions 并不是脱离服务端存在的魔法。',
        code: serverActionsDb,
      },
    ],
  },
  'server-rendering': {
    title: 'prerender / stream / resume',
    summary: '演示 React 19 在静态预渲染、流式输出、恢复输出上的不同职责。',
    environment: '需要 Node / Edge / Streams 宿主，通常也要接框架或服务端入口。',
    whyNotOnPages:
      '这些 API 的价值都发生在“生成 HTML 的那一端”。GitHub Pages 只负责托管结果，不负责执行这条产线。',
    files: [
      {
        label: '请求时流式输出',
        path: 'reference-code/server-rendering/request-handler.tsx',
        summary: '展示 renderToPipeableStream / resumeToPipeableStream 在请求阶段如何工作。',
        code: serverRenderingRequest,
      },
      {
        label: '构建期预渲染',
        path: 'reference-code/server-rendering/static-prerender.tsx',
        summary: '展示 prerender / resumeAndPrerenderToNodeStream 如何服务于静态产线。',
        code: serverRenderingStatic,
      },
      {
        label: 'postponed state 存取',
        path: 'reference-code/server-rendering/storage.ts',
        summary: '补足 resume 这类 API 依赖的 postponed state 存取逻辑。',
        code: serverRenderingStorage,
      },
    ],
  },
  'resource-hints': {
    title: 'preload / preinit / preconnect',
    summary: '演示如何在组件里按“先建连接、先准备脚本样式、先提示关键资源”来编排加载顺序。',
    environment: '浏览器端可调用，但在 SSR / streaming 场景最能体现收益。',
    whyNotOnPages:
      '静态 demo 能把 API 调用写出来，但很难在 GitHub Pages 上严谨展示真实产线中的首屏收益，所以这里用项目代码解释更靠谱。',
    files: [
      {
        label: '文章页资源编排',
        path: 'reference-code/resource-hints/ArticlePage.tsx',
        summary: '围绕首屏大图、评论区和分析脚本，演示资源优先级如何贴着页面表达。',
        code: resourceHintsArticle,
      },
      {
        label: '视频头图资源预热',
        path: 'reference-code/resource-hints/VideoHero.tsx',
        summary: '用视频海报与字幕轨道示意 preload / preconnect 更贴近真实媒体页面。',
        code: resourceHintsVideo,
      },
    ],
  },
  hydration: {
    title: 'Hydration 错误改进 / SSR 场景价值',
    summary: '演示什么写法容易触发 mismatch，以及怎样把客户端第一次渲染和服务端 HTML 对齐。',
    environment: '需要服务端先输出 HTML，再由 hydrateRoot 接管。',
    whyNotOnPages:
      '当前站点是纯客户端挂载，不存在“服务端 HTML + 客户端接管”这一步，所以没法真实做出有代表性的 hydration 错误现场。',
    files: [
      {
        label: '会 mismatch 的写法',
        path: 'reference-code/hydration/ClockThatMismatches.tsx',
        summary: '直接在 render 里读当前时间，是最典型的 hydration mismatch 诱因之一。',
        code: hydrationMismatch,
      },
      {
        label: '更稳妥的时钟组件',
        path: 'reference-code/hydration/HydrationSafeClock.tsx',
        summary: '先用服务端给的初始值对齐首屏，再在客户端继续更新。',
        code: hydrationSafe,
      },
      {
        label: 'hydrateRoot 接管入口',
        path: 'reference-code/hydration/client-entry.tsx',
        summary: '展示 onRecoverableError 如何帮助记录和定位 hydration 问题。',
        code: hydrationClientEntry,
      },
    ],
  },
}
