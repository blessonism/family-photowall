# Admin 管理面板 - 实施计划

> 状态：待确认 | 创建时间：2026-02-18
> CODEX_SESSION: 019c707e-1d42-7263-89c0-ca1842c7c577
> GEMINI_SESSION: 6bd36761-ebac-4c65-8fc3-676e7cf8094a

---

## 1. 需求概述

为家族照片墙网站新增 Admin 管理后台，通过可视化界面管理：
- 家族成员（CRUD + 头像上传）
- 活动相册（CRUD + 批量照片上传）
- 历史事件（CRUD + 配图上传）
- 站点配置（标题、格言、描述等）

---

## 2. 架构方案

### 2.1 核心决策：本地开发模式 Admin

**保持 `output: "export"` 不变**，Admin 仅在 `npm run dev` 时可用。

| 特性 | 说明 |
|------|------|
| 运行环境 | 仅限 `next dev`（本地开发服务器） |
| 数据读写 | API Routes 通过 Node.js `fs` 直接读写 `data/*.json` |
| 图片上传 | 写入 `public/images/` 目录 |
| 发布流程 | 编辑完成 → `git add && git commit && git push` → Vercel 自动构建静态站 |
| 外部依赖 | **零**（无数据库、无云存储、无第三方服务） |
| 生产环境 | Admin 页面和 API 在静态导出中自动排除，公开站无安全暴露 |

**优势**：
- 零成本、零外部依赖
- 公开站保持纯静态（CDN 极速、SEO 友好）
- Admin 天然隔离（生产环境不存在）
- 数据和图片都在 Git 版本控制中

**工作流**：
```
本地 npm run dev → 访问 /admin → 可视化编辑 → git push → Vercel 自动部署
```

### 2.2 认证方案

简单环境变量密码 + Cookie 会话：
- 密码存储在 `.env.local`（`ADMIN_PASSWORD=xxx`）
- 登录后设置 HttpOnly Cookie
- Admin layout 中间件检查 Cookie
- **仅 dev 模式有效**，无生产安全风险

### 2.3 未来升级路径（非本次范围）

若后续需要**在线管理**（生产环境可用），可：
1. 移除 `output: "export"`，切换服务端模式
2. 数据迁移至 Supabase Postgres
3. 图片迁移至 Vercel Blob / Supabase Storage
4. 认证升级至 NextAuth/Auth.js

---

## 3. 技术方案

### 3.1 Admin 布局

采用 **可折叠侧边栏** 设计（Gemini 推荐）：

```
┌─────────────────────────────────────────────┐
│  🏠 家族传承 Admin          [← 返回前台]     │
├──────────┬──────────────────────────────────┤
│ 📊 仪表盘 │                                  │
│ 👥 成员   │        内容区域                   │
│ 📷 相册   │     （表格/表单/上传）             │
│ 📜 历史   │                                  │
│ ⚙️ 设置   │                                  │
│          │                                  │
│ ─────── │                                  │
│ 🔓 退出   │                                  │
└──────────┴──────────────────────────────────┘
```

- **桌面优先**，移动端基础适配（侧边栏可折叠为图标）
- 配色延续主站暖石色系，但信息密度更高、对比度更强
- 内容卡片用白色/浅色背景 + 阴影，区别于主站的大留白风格

### 3.2 数据模型（无变化）

沿用现有 JSON 结构，API Routes 直接读写：

| 数据 | 文件 | 操作 |
|------|------|------|
| 成员 | `data/members.json` | CRUD + 排序 |
| 相册 | `data/albums.json` | CRUD + 照片子项管理 |
| 历史 | `data/history.json` | CRUD + 排序 |
| 站点 | `data/site.json` | 读取 + 更新 |

### 3.3 图片处理

- 上传目标目录：`public/images/{members|gallery|history}/`
- 支持格式：JPG、PNG、WebP
- 文件名规则：`{id}-{timestamp}.{ext}`（避免冲突）
- 前端预览：上传前即时预览（FileReader API）
- 图片管理：上传时自动清理旧图片引用

---

## 4. 目录结构

```
app/
├── admin/                          # Admin 入口层
│   ├── layout.tsx                  # Admin 布局（侧边栏 + 认证检查）
│   ├── page.tsx                    # 仪表盘
│   ├── login/
│   │   └── page.tsx                # 登录页
│   ├── members/
│   │   └── page.tsx                # 成员管理
│   ├── albums/
│   │   └── page.tsx                # 相册管理
│   ├── history/
│   │   └── page.tsx                # 历史管理
│   └── settings/
│       └── page.tsx                # 站点设置
├── api/                            # API 协调层
│   ├── auth/
│   │   ├── login/route.ts          # POST 登录
│   │   └── logout/route.ts         # POST 登出
│   ├── members/
│   │   └── route.ts                # GET/POST 成员列表 & 新增
│   ├── members/[id]/
│   │   └── route.ts                # GET/PUT/DELETE 单个成员
│   ├── albums/
│   │   └── route.ts                # GET/POST 相册
│   ├── albums/[id]/
│   │   └── route.ts                # GET/PUT/DELETE 单个相册
│   ├── history/
│   │   └── route.ts                # GET/POST 历史事件
│   ├── history/[id]/
│   │   └── route.ts                # PUT/DELETE（id 用 year 标识）
│   ├── settings/
│   │   └── route.ts                # GET/PUT 站点配置
│   └── upload/
│       └── route.ts                # POST 图片上传
components/
├── admin/                          # Admin 专用组件
│   ├── AdminSidebar.tsx            # 侧边栏导航
│   ├── AdminHeader.tsx             # 顶部栏（面包屑 + 返回前台）
│   ├── DataTable.tsx               # 通用数据表格（排序/搜索）
│   ├── FormDrawer.tsx              # 侧边抽屉表单（新增/编辑）
│   ├── ImageUploader.tsx           # 图片上传组件（拖拽 + 预览）
│   ├── StatsCard.tsx               # 仪表盘统计卡片
│   ├── ConfirmDialog.tsx           # 删除确认对话框
│   └── Toast.tsx                   # 操作反馈提示
lib/
├── admin/                          # Admin 原子工具
│   ├── auth.ts                     # 认证工具（验证密码/Cookie）
│   ├── json-store.ts               # JSON 文件读写（fs 封装）
│   └── upload.ts                   # 图片上传处理
```

---

## 5. 实施步骤

### Step 1：基础设施（认证 + 布局 + API 框架）

**产出**：可登录的空 Admin 骨架

| 文件 | 操作 | 说明 |
|------|------|------|
| `.env.local` | 新增 | `ADMIN_PASSWORD=family2024` |
| `lib/admin/auth.ts` | 新增 | 密码验证 + Cookie 工具 |
| `lib/admin/json-store.ts` | 新增 | JSON 文件通用读写（`readJson`/`writeJson`） |
| `app/api/auth/login/route.ts` | 新增 | POST 登录接口 |
| `app/api/auth/logout/route.ts` | 新增 | POST 登出接口 |
| `app/admin/layout.tsx` | 新增 | Admin 布局 + Cookie 认证检查 |
| `app/admin/login/page.tsx` | 新增 | 登录页面 |
| `components/admin/AdminSidebar.tsx` | 新增 | 侧边栏导航 |
| `components/admin/AdminHeader.tsx` | 新增 | 顶部栏 |

### Step 2：仪表盘 + 通用组件

**产出**：仪表盘 + 可复用的表格/表单/上传组件

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/admin/page.tsx` | 新增 | 仪表盘（统计卡片 + 快捷入口） |
| `components/admin/StatsCard.tsx` | 新增 | 统计卡片组件 |
| `components/admin/DataTable.tsx` | 新增 | 通用数据表格 |
| `components/admin/FormDrawer.tsx` | 新增 | 抽屉式表单组件 |
| `components/admin/ImageUploader.tsx` | 新增 | 拖拽上传 + 预览 |
| `components/admin/ConfirmDialog.tsx` | 新增 | 删除确认弹窗 |
| `components/admin/Toast.tsx` | 新增 | Toast 通知 |
| `app/api/upload/route.ts` | 新增 | 图片上传 API |
| `lib/admin/upload.ts` | 新增 | 上传处理逻辑 |

### Step 3：成员管理

**产出**：完整的成员 CRUD + 头像上传

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/members/route.ts` | 新增 | GET 列表 / POST 新增 |
| `app/api/members/[id]/route.ts` | 新增 | GET/PUT/DELETE 单成员 |
| `app/admin/members/page.tsx` | 新增 | 成员管理页面 |

### Step 4：相册管理

**产出**：相册 CRUD + 批量照片上传 + 排序

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/albums/route.ts` | 新增 | GET/POST 相册 |
| `app/api/albums/[id]/route.ts` | 新增 | GET/PUT/DELETE 单相册 |
| `app/admin/albums/page.tsx` | 新增 | 相册管理页面 |

### Step 5：历史事件管理

**产出**：事件 CRUD + 配图上传

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/history/route.ts` | 新增 | GET/POST 事件 |
| `app/api/history/[id]/route.ts` | 新增 | PUT/DELETE 单事件 |
| `app/admin/history/page.tsx` | 新增 | 历史管理页面 |

### Step 6：站点设置

**产出**：站点配置编辑

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/api/settings/route.ts` | 新增 | GET/PUT 站点配置 |
| `app/admin/settings/page.tsx` | 新增 | 站点设置页面 |

---

## 6. 关键文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `.env.local` | 新增 | Admin 密码配置 |
| `lib/admin/auth.ts` | 新增 | 认证原子模块 |
| `lib/admin/json-store.ts` | 新增 | JSON 读写原子模块 |
| `lib/admin/upload.ts` | 新增 | 上传处理原子模块 |
| `app/admin/layout.tsx` | 新增 | Admin 布局（侧边栏 + 认证） |
| `app/admin/login/page.tsx` | 新增 | 登录页 |
| `app/admin/page.tsx` | 新增 | 仪表盘 |
| `app/admin/members/page.tsx` | 新增 | 成员管理 |
| `app/admin/albums/page.tsx` | 新增 | 相册管理 |
| `app/admin/history/page.tsx` | 新增 | 历史管理 |
| `app/admin/settings/page.tsx` | 新增 | 站点设置 |
| `app/api/auth/login/route.ts` | 新增 | 登录 API |
| `app/api/auth/logout/route.ts` | 新增 | 登出 API |
| `app/api/members/route.ts` | 新增 | 成员列表/新增 API |
| `app/api/members/[id]/route.ts` | 新增 | 成员详情/更新/删除 API |
| `app/api/albums/route.ts` | 新增 | 相册 API |
| `app/api/albums/[id]/route.ts` | 新增 | 单相册 API |
| `app/api/history/route.ts` | 新增 | 历史事件 API |
| `app/api/history/[id]/route.ts` | 新增 | 单事件 API |
| `app/api/settings/route.ts` | 新增 | 站点配置 API |
| `app/api/upload/route.ts` | 新增 | 图片上传 API |
| `components/admin/AdminSidebar.tsx` | 新增 | 侧边栏 |
| `components/admin/AdminHeader.tsx` | 新增 | 顶部栏 |
| `components/admin/DataTable.tsx` | 新增 | 数据表格 |
| `components/admin/FormDrawer.tsx` | 新增 | 表单抽屉 |
| `components/admin/ImageUploader.tsx` | 新增 | 图片上传 |
| `components/admin/StatsCard.tsx` | 新增 | 统计卡片 |
| `components/admin/ConfirmDialog.tsx` | 新增 | 确认弹窗 |
| `components/admin/Toast.tsx` | 新增 | Toast 提示 |

**总计**：~28 个新文件，**0 个现有文件修改**

---

## 7. 风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| 误删数据不可恢复 | 删除前强制确认弹窗 + 数据在 Git 中有版本历史 |
| 上传大文件导致仓库膨胀 | 前端限制文件大小（≤ 2MB）+ 图片压缩 |
| `.env.local` 密码泄漏 | 已在 `.gitignore` 中排除 |
| API Routes 在 static export 中不可用 | 这是特性而非 Bug — Admin 仅限本地 dev |
| 并发编辑冲突 | 家庭项目单人维护，风险极低 |

---

## 8. 任务类型

- [x] 前端 (→ Admin UI 组件 + 页面)
- [x] 后端 (→ API Routes + 文件操作)
- [x] 全栈

---

## 9. SESSION_ID（供 /ccg:execute 使用）

- CODEX_SESSION: 019c707e-1d42-7263-89c0-ca1842c7c577
- GEMINI_SESSION: 6bd36761-ebac-4c65-8fc3-676e7cf8094a
