# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Current product direction: keep the birthday experience inside one viewport with no page scroll, provide a mobile-specific vertical composition, and favor a multi-step touch-friendly ritual over a single click and generic modal.

背景音乐偏好：使用轻柔、低音量循环的钢琴／八音盒纯音乐；右上角使用与花园主题一致的花朵图标，播放时缓慢旋转、暂停时静止，以动态图／静止图表示音乐状态，不显示音乐开关或开／关字样。手机端和生日信阶段均可操作，保留屏幕阅读器可读的按钮说明。点击“唤醒花园”开始播放，重新体验时保留本次手动暂停选择。使用 CSS 动画呈现 GIF 效果，以便同步播放状态。

交付流程：修改后先提供本地预览，交由用户确认；未经本轮确认，不自动推送或发布。

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
