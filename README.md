# Flutter 题库测验

基于 React + TypeScript + Vite 构建的 Flutter 知识测验 Web 应用。支持单选题、多选题，答题过程中不提示对错，交卷后可查看得分、错题与 Markdown 解析。

## 功能特性

- **混合模式答题**：做题时不提示对错，交卷后统一查看结果
- **单选 / 多选**：支持单选与多选题类型
- **限时作答**：默认 90 分钟答题时长
- **答案解析**：支持 Markdown 格式的题目解析
- **答题卡**：可快速跳转到指定题目
- **响应式布局**：适配桌面与移动端

## 技术栈

- **框架**：React 19 + TypeScript
- **构建**：Vite 8
- **UI**：shadcn/ui + Base UI + Tailwind CSS
- **路由**：React Router v7
- **内容渲染**：react-markdown + remark-gfm

## 项目结构

```
flutter-exam/
├── web/                    # 前端应用
│   ├── src/
│   │   ├── assets/         # 题库数据 (question_bank.json)
│   │   ├── components/     # UI 组件
│   │   ├── lib/            # 业务逻辑与状态
│   │   └── pages/          # 页面：开始、答题、结果
│   └── ...
├── .github/workflows/      # GitHub Actions 部署配置
└── README.md
```

## 快速开始

### 环境要求

- Node.js 20+
- pnpm（推荐）或 npm

### 安装依赖

```bash
cd web
pnpm install
# 或
npm install
```

### 本地开发

```bash
cd web
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建与预览

```bash
cd web
pnpm build      # 构建生产版本
pnpm preview    # 本地预览构建结果
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。推送到 `main` 分支或手动触发工作流即可完成构建与部署。

- 仓库根路径需设置为：`/flutter-exam/`（已在 `vite.config.ts` 中配置）
- 构建产物输出到 `web/dist`

## 题库格式

题库数据位于 `web/src/assets/question_bank.json`，格式示例：

```json
{
  "version": 1,
  "questions": [
    {
      "id": 1,
      "type": "single",
      "stem": "题目内容",
      "options": [
        { "key": "A", "text": "选项 A" },
        { "key": "B", "text": "选项 B" },
        ...
      ],
      "answerKeys": ["D"],
      "explanationMd": "可选：Markdown 解析"
    }
  ]
}
```

- `type`: `"single"` 单选 / `"multi"` 多选
- `answerKeys`: 正确答案键，如 `["D"]` 或 `["A", "C"]`

## 许可证

MIT
