# 家族传承官网 - 功能规划与实施计划

> 状态：待确认 | 创建时间：2026-02-18
> Gemini SESSION_ID: 7875461a-1bdf-47fa-a26c-27798da9eea0

---

## 1. 项目概述

为中型家族（10-30人）打造一个**高级专业**风格的公开访问家族网站。
核心关键词：**传承 (Legacy)、优雅 (Elegance)、连接 (Connection)**

### 技术栈

| 技术 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 15 (App Router, SSG) | 静态导出、SEO 友好、图片优化 |
| 样式 | Tailwind CSS 4 | 原子化 CSS、响应式设计 |
| 动画 | Framer Motion | 滚动动画、页面过渡、共享元素动画 |
| 字体 | Noto Serif SC + Noto Sans SC | 宋体标题庄重 + 黑体正文易读 |
| 部署 | Vercel (免费) | 自动部署、CDN、HTTPS |
| 内容 | JSON 数据文件 | 无需后端、易于维护 |
| 留言 | Giscus (GitHub Discussions) | 免费、无需后端、支持 Markdown |

---

## 2. 信息架构 (IA)

```
首页 (/)
├── Hero 全屏区 - 家族姓氏/徽章 + 格言
├── 家族简介 - 起源与精神
├── 核心成员亮点 - 横向卡片流
├── 最新活动/相册预览
└── Footer

家族成员 (/members)
├── 筛选器（按辈分/分支）
├── 成员网格（响应式卡片）
└── 成员详情（模态框）

家族历史 (/history)
├── 大事记时间轴（左右交替）
└── 家族故事（图文并茂）

影像画廊 (/gallery)
├── 相册分类（按年代/活动）
├── 瀑布流/网格照片墙
└── Lightbox 大图查看

留言纪念 (/guestbook)
├── 留言墙（Giscus 集成）
└── 家族寄语
```

---

## 3. 视觉设计

### 3.1 配色方案（亮色主调）

| 角色 | 色值 | 用途 |
|------|------|------|
| 页面底色 | `White` (#ffffff) | 主背景，干净通透 |
| 辅助底色 | `Stone-50` (#fafaf9) | 交替区块背景，层次区分 |
| 标题色 | `Slate-900` (#0f172a) | 标题文字，沉稳有力 |
| 正文色 | `Slate-700` (#334155) | 段落正文，柔和易读 |
| 次要色 | `Slate-400` (#94a3b8) | 次要信息/描述/时间 |
| 强调色 | `Amber-600` (#d97706) | 金色装饰线/按钮/高亮 |
| 卡片色 | `White` + 阴影 | 卡片浮起效果，shadow-sm |
| 分割线 | `Stone-200` (#e7e5e4) | 细线分割，柔和不突兀 |

### 3.2 字体方案

- **标题**: Noto Serif SC（思源宋体）- 庄重、人文、传承感
- **正文**: Noto Sans SC（思源黑体）- 现代、清晰、易读
- 通过 `next/font` 预加载，避免字体闪烁

### 3.3 设计原则

- **亮色为主**，白底 + 暖米白交替，整体明亮通透
- 大量留白，制造呼吸感和高级感
- 照片保持原色或轻微暖色调处理，不使用黑白/低饱和度
- 卡片采用白色 + 轻阴影（shadow-sm），浮于底色之上
- 细线（1px Stone-200）分割区块，柔和不突兀
- 金色（Amber-600）点缀装饰线、按钮、重点高亮

---

## 4. 交互设计

### 4.1 导航栏
- 白色背景 + 底部细线 → 滚动后 `backdrop-blur` 毛玻璃效果固定顶部
- 移动端：汉堡菜单 + 侧边抽屉

### 4.2 首页 Hero
- 全屏亮色背景 + 高品质家族合影/风景照（保持原色）
- 半透明白色遮罩确保文字可读
- 居中家族姓氏 + 格言，Framer Motion 文字逐字渐现
- 底部滚动提示箭头（上下浮动动画）

### 4.3 滚动动画
- **Reveal**: 元素进入视口时 `y: 20→0, opacity: 0→1`，交错延迟
- **Parallax**: Hero 背景慢速滚动
- **Timeline**: 时间轴线条随滚动向下延伸

### 4.4 图片交互
- Hover: 照片轻微放大 (scale: 1.02)
- 点击: `layoutId` 共享元素过渡到 Lightbox

---

## 5. 响应式策略

| 断点 | 范围 | 适配 |
|------|------|------|
| Mobile | < 640px | 单列、汉堡菜单、时间轴左对齐 |
| Tablet | 640-1024px | 2-3列、保留触摸区域 |
| Desktop | > 1024px | 4列、max-w-7xl 居中、Hover 效果 |

---

## 6. 数据模型

### 6.1 家族成员 (`data/members.json`)
```json
{
  "members": [
    {
      "id": "001",
      "name": "张三",
      "generation": 1,
      "branch": "长房",
      "title": "家族长辈",
      "bio": "简介...",
      "photo": "/images/members/001.jpg",
      "birthYear": 1940,
      "highlights": ["创办家族企业", "教育事业贡献"]
    }
  ]
}
```

### 6.2 历史事件 (`data/history.json`)
```json
{
  "events": [
    {
      "year": 1950,
      "title": "家族南迁",
      "description": "描述...",
      "image": "/images/history/1950.jpg"
    }
  ]
}
```

### 6.3 相册 (`data/albums.json`)
```json
{
  "albums": [
    {
      "id": "spring-2024",
      "title": "2024 春节团聚",
      "date": "2024-02-10",
      "category": "节日",
      "cover": "/images/gallery/spring-2024/cover.jpg",
      "photos": [
        { "src": "/images/gallery/spring-2024/01.jpg", "caption": "全家福" }
      ]
    }
  ]
}
```

---

## 7. 目录结构

```
photo-wall/
├── app/                          # L1 入口层
│   ├── layout.tsx                # 根布局（字体、导航、Footer）
│   ├── page.tsx                  # 首页
│   ├── members/
│   │   └── page.tsx              # 家族成员页
│   ├── history/
│   │   └── page.tsx              # 家族历史页
│   ├── gallery/
│   │   └── page.tsx              # 影像画廊页
│   └── guestbook/
│       └── page.tsx              # 留言纪念页
├── components/                   # L2-L4 组件层
│   ├── layout/                   # L2 协调层（页面区块）
│   │   ├── NavBar.tsx
│   │   ├── Footer.tsx
│   │   └── SectionContainer.tsx
│   ├── sections/                 # L3 分子层（页面 Section）
│   │   ├── HeroSection.tsx
│   │   ├── IntroSection.tsx
│   │   ├── MemberHighlight.tsx
│   │   ├── MemberGrid.tsx
│   │   ├── Timeline.tsx
│   │   ├── PhotoGallery.tsx
│   │   └── GuestbookSection.tsx
│   └── ui/                       # L4 原子层（基础组件）
│       ├── Button.tsx
│       ├── MemberCard.tsx
│       ├── TimelineItem.tsx
│       ├── PhotoCard.tsx
│       ├── SectionHeading.tsx
│       ├── Divider.tsx
│       ├── Lightbox.tsx
│       ├── FilterBar.tsx
│       └── ScrollReveal.tsx
├── data/                         # 内容数据
│   ├── members.json
│   ├── history.json
│   ├── albums.json
│   └── site.json                 # 站点配置（标题、格言等）
├── public/
│   └── images/                   # 图片资源
│       ├── members/
│       ├── history/
│       ├── gallery/
│       └── hero/
├── lib/                          # 工具函数
│   ├── data.ts                   # 数据读取工具
│   └── animations.ts             # Framer Motion 动画预设
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

---

## 8. WBS 实施任务分解

### Phase 1: 项目初始化 (Task 1-3)

| # | 任务 | 产出 | 预估复杂度 |
|---|------|------|-----------|
| 1 | 初始化 Next.js 项目 + Tailwind + Framer Motion | 可运行的空项目 | 低 |
| 2 | 配置字体（Noto Serif SC + Noto Sans SC）+ 全局样式 | globals.css + layout.tsx | 低 |
| 3 | 创建数据文件结构 + 示例数据 | data/*.json + lib/data.ts | 低 |

### Phase 2: 基础组件 (Task 4-8)

| # | 任务 | 产出 | 预估复杂度 |
|---|------|------|-----------|
| 4 | Button、SectionHeading、Divider 原子组件 | ui/ 基础组件 | 低 |
| 5 | ScrollReveal 滚动动画包装组件 | ui/ScrollReveal.tsx | 中 |
| 6 | NavBar（响应式 + 毛玻璃 + 汉堡菜单） | layout/NavBar.tsx | 中 |
| 7 | Footer 组件 | layout/Footer.tsx | 低 |
| 8 | MemberCard、TimelineItem、PhotoCard 组件 | ui/ 内容组件 | 中 |

### Phase 3: 页面实现 (Task 9-13)

| # | 任务 | 产出 | 预估复杂度 |
|---|------|------|-----------|
| 9 | 首页：Hero + 简介 + 成员亮点 + 活动预览 | app/page.tsx + sections/ | 高 |
| 10 | 家族成员页：筛选器 + 网格 + 详情模态框 | app/members/page.tsx | 中 |
| 11 | 家族历史页：时间轴 + 故事 | app/history/page.tsx | 中 |
| 12 | 影像画廊页：分类 + 瀑布流 + Lightbox | app/gallery/page.tsx | 高 |
| 13 | 留言纪念页：Giscus 集成 + 布局 | app/guestbook/page.tsx | 低 |

### Phase 4: 优化与交付 (Task 14-16)

| # | 任务 | 产出 | 预估复杂度 |
|---|------|------|-----------|
| 14 | 图片优化（next/image + 占位 blur） | 全站图片组件优化 | 中 |
| 15 | SEO + Metadata + Open Graph | 各页面 metadata | 低 |
| 16 | Vercel 部署配置 + 静态导出验证 | 可访问的线上站点 | 低 |

---

## 9. 留言系统技术方案

**选择 Giscus**（基于 GitHub Discussions）：
- 免费、无需后端服务
- 支持 Markdown 格式
- 支持点赞/回复
- 与 GitHub 账号集成
- 可自定义主题匹配网站风格

**替代方案**：
- Cusdis（轻量评论系统，自托管）
- Utterances（基于 GitHub Issues）
- 静态留言：通过 Google Form 收集，定期更新 JSON

---

## 10. 性能优化策略

1. **图片**: `next/image` 自动 WebP/AVIF + 响应式尺寸 + blur 占位
2. **字体**: `next/font` 预加载 + `font-display: swap`
3. **动画**: 仅使用 `transform` + `opacity`（GPU 加速）
4. **代码分割**: Next.js 自动按页面分割
5. **静态导出**: `output: 'export'` 纯静态 HTML，CDN 直接分发
