# 家族谱系图 + 成员详情页 - 实施计划

> 状态：✅ 已完成 | 创建时间：2026-02-18 | 完成时间：2026-02-18

---

## 1. 功能概述

### 功能 1：家族谱系图（Family Tree）
- /members 页面增加「家族树/列表」双视图切换
- 纯 SVG + Framer Motion 实现（无 D3 依赖）
- 纵向辈分、横向分支，节点（头像+姓名+称谓），连接线（亲子实线/婚姻虚线）
- 桌面端：缩放+拖拽；移动端：降级为按辈分折叠列表
- 点击节点跳转 /members/[id]

### 功能 2：成员详情页（/members/[id]）
- 面包屑导航
- Hero 区：大头像 + 基本信息
- 家族关系区：父母/配偶/子女关系卡片
- 关联相册区：该成员出现的相册照片
- 人物时间轴：里程碑事件
- 底部导航：上一位/下一位成员

---

## 2. 数据模型扩展

### members.json 新增字段
```json
{
  "parentId": null,              // 父亲ID (string | null)
  "spouseId": null,              // 配偶ID (string | null)
  "childrenIds": ["002", "003"], // 子女IDs (string[])
  "gender": "M",                 // 性别 ("M" | "F")
  "timeline": [                  // 个人里程碑
    { "year": 1965, "event": "从事教育事业" }
  ]
}
```

### albums.json 新增字段
```json
{
  "photos": [
    { "src": "...", "caption": "...", "memberIds": ["001", "002"] }
  ]
}
```

### lib/data.ts 新增函数
- `getMemberWithRelations(id)` → 成员 + 关联亲属
- `buildFamilyTree()` → 按辈分分组的树结构
- `getAlbumsByMemberId(id)` → 成员关联相册

---

## 3. 页面布局

### /members 页面（双视图）
```
┌─────────────────────────────────────────┐
│            家族成员                       │
│        每一位家人都是传承的力量           │
│       ─── [家族树] [列表视图] ───        │
├─────────────────────────────────────────┤
│ 树形视图 (桌面):                         │
│   [第一代]  张德厚                       │
│               ├── 张明远  ── 张婉清      │
│               └── 张志刚(二房)           │
│   [第三代]  张子轩  张思琪               │
│                                          │
│ 列表视图 (移动端):                       │
│   第一代 ▼                               │
│   ├── 张德厚                             │
│   第二代 ▼                               │
│   ├── 张明远                             │
│   └── ...                                │
└─────────────────────────────────────────┘
```

### /members/[id] 详情页
```
┌─────────────────────────────────────────┐
│ 首页 > 家族成员 > 张明远                 │
├─────────────────────────────────────────┤
│ [大头像]    姓名（宋体 bold）            │
│             称谓 / 第二代 / 主家         │
│             出生年: 1965                 │
│             简介...                      │
│             [亮点tag] [亮点tag]           │
├─────────────────────────────────────────┤
│ 家族关系                                 │
│ 父亲: [张德厚卡片→]                     │
│ 子女: [张子轩卡片→] [张思琪卡片→]       │
├─────────────────────────────────────────┤
│ 关联相册                                 │
│ [照片] [照片] [照片]                     │
├─────────────────────────────────────────┤
│ 人物里程碑                               │
│ 1965 ● 出生                             │
│ 1992 ● 完成学业                          │
├─────────────────────────────────────────┤
│ [← 上一位]         [下一位 →]            │
└─────────────────────────────────────────┘
```

---

## 4. 任务分解 (WBS)

### Phase 1：数据模型扩展 (T1.1 - T1.3)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T1.1 | 扩展 members.json | data/members.json (修改) | 无 | 低 |
| T1.2 | 扩展 albums.json | data/albums.json (修改) | T1.1 | 低 |
| T1.3 | 更新 lib/data.ts 类型 | lib/data.ts (修改) | T1.1, T1.2 | 低 |

### Phase 2：数据函数扩展 (T2.1 - T2.3)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T2.1 | getMemberWithRelations() | lib/data.ts (新增函数) | T1.3 | 中 |
| T2.2 | buildFamilyTree() | lib/data.ts (新增函数) | T1.3 | 中 |
| T2.3 | getAlbumsByMemberId() | lib/data.ts (新增函数) | T1.3 | 低 |

### Phase 3：原子组件 L4 (T3.1 - T3.5)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T3.1 | Breadcrumb 面包屑 | components/ui/Breadcrumb.tsx | 无 | 低 |
| T3.2 | RelationCard 关系卡片 | components/ui/RelationCard.tsx | 无 | 中 |
| T3.3 | TimelineEvent 时间轴项 | components/ui/TimelineEvent.tsx | 无 | 低 |
| T3.4 | FamilyTreeNode 树节点 | components/ui/FamilyTreeNode.tsx | 无 | 低 |
| T3.5 | RelatedPhoto 关联照片 | components/ui/RelatedPhoto.tsx | 无 | 低 |

### Phase 4：分子组件 L3 (T4.1 - T4.4)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T4.1 | FamilyTree 桌面端树形图 | components/sections/FamilyTree.tsx | T2.2, T3.4 | 高 |
| T4.2 | FamilyTreeList 移动端列表 | components/sections/FamilyTreeList.tsx | T2.2, T3.4 | 中 |
| T4.3 | MemberDetailHero 成员 Hero | components/sections/MemberDetailHero.tsx | T2.1 | 中 |
| T4.4 | 详情页 Section 组件 | FamilyRelationsGrid / RelatedAlbumSection / TimelineSection / MemberNav | T2.1-T2.3, T3.1-T3.5 | 中 |

### Phase 5：页面实现 L1 (T5.1 - T5.2)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T5.1 | /members 添加树/列表切换 | app/members/page.tsx (修改) | T4.1, T4.2 | 中 |
| T5.2 | /members/[id] 详情页 | app/members/[id]/page.tsx (新增) | T4.3, T4.4 | 中 |

### Phase 6：Admin 后台适配 (T6.1)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T6.1 | API Routes + Admin UI 新字段 | api/members/ + api/albums/ (修改) | T1.1, T1.2 | 中 |

### Phase 7：测试优化 (T7.1)

| # | 任务 | 产出 | 依赖 | 复杂度 |
|---|------|------|------|--------|
| T7.1 | 跨端测试、性能优化 | 优化现有代码 | T5.1, T5.2 | 中 |

---

## 5. 文件清单

### 新增文件 (13 个)
| 文件 | 层级 | 说明 |
|------|------|------|
| components/ui/Breadcrumb.tsx | L4 | 面包屑导航 |
| components/ui/RelationCard.tsx | L4 | 关系卡片 |
| components/ui/TimelineEvent.tsx | L4 | 时间轴事件项 |
| components/ui/FamilyTreeNode.tsx | L4 | 树节点 |
| components/ui/RelatedPhoto.tsx | L4 | 关联照片缩略图 |
| components/sections/FamilyTree.tsx | L3 | 家族树 SVG (桌面) |
| components/sections/FamilyTreeList.tsx | L3 | 家族树列表 (移动端) |
| components/sections/MemberDetailHero.tsx | L3 | 成员详情 Hero |
| components/sections/FamilyRelationsGrid.tsx | L3 | 关系网格 |
| components/sections/RelatedAlbumSection.tsx | L3 | 关联相册 |
| components/sections/TimelineSection.tsx | L3 | 时间轴 |
| components/sections/MemberNav.tsx | L3 | 上/下一位导航 |
| app/members/[id]/page.tsx | L1 | 成员详情页路由 |

### 修改文件 (7 个)
| 文件 | 修改内容 |
|------|---------|
| data/members.json | +parentId, spouseId, childrenIds, gender, timeline |
| data/albums.json | +photos[].memberIds |
| lib/data.ts | +类型定义, +3 个新函数 |
| app/members/page.tsx | +树/列表视图切换 |
| app/api/members/route.ts | 支持新字段 |
| app/api/members/[id]/route.ts | 支持新字段 |
| app/api/albums/route.ts | 支持 memberIds |

---

## 6. 技术决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 树形图 | 纯 SVG + React + Framer Motion | 无重依赖，兼容现有架构 |
| 坐标计算 | 纯 JS 递归 | 中小规模足够，灵活可维护 |
| 拖拽缩放 | Framer Motion gesture | 已有依赖 |
| 移动端树 | 降级为折叠列表 | UX 简洁、性能好 |
| 数据存储 | 仍用 JSON | 无数据库依赖 |

---

## 7. 依赖关系

```
T1.1 → T1.2 → T1.3
                 ↓
         T2.1 / T2.2 / T2.3 (可并行)
                 ↓
    T3.1-T3.5 (可并行) ← 无依赖，与 T2 可并行
                 ↓
    T4.1 / T4.2 (可并行)  T4.3 / T4.4 (可并行)
                 ↓
         T5.1 / T5.2 (可并行)
                 ↓
              T6.1
                 ↓
              T7.1
```
