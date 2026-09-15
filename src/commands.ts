export const MSG = {
  DENIED: '无权限。',
  WELCOME: [
    '你好，这是 DeepSeek Harness 的手机遥控器。',
    '本机会话是真相源：请先在 Web 打开对话，再用 /sessions 选择工作区 → 会话并附着。',
    '发送 /help 查看命令。',
  ].join('\n'),
  HELP: [
    '/sessions — 按工作区列出本机会话（与 Web 对齐，排除归档）并附着',
    '/last — 查看绑定会话的上次问答（便于续接）',
    '/model — 切换当前绑定会话的模型（下一回合生效）',
    '/status — 会话状态：绑定/会话ID/工作区/模型/思考强度/上下文/首token/速率/输入输出tokens',
    '/compact — 压缩当前会话历史（缩短上下文，会话空闲时执行）',
    '/rich — 渲染模式：on=富文本(需新版客户端) / off=HTML兼容(默认)；本聊天永久生效',
    '/unbind — 断开绑定（不关闭本机会话）',
    '/help — 显示帮助',
    '',
    '绑定后直接发文字，消息会进入该本机会话；Web 与手机看到同一条轨迹。',
    '直接发送图片（或带文字说明的图片）也会进入该会话，说明文字会一并作为消息文本。',
    '仅白名单用户可用。无会话时请先在 dsh web 开对话或保留历史会话。',
  ].join('\n'),
  NEED_BIND: '尚未绑定本机会话。请先发送 /sessions 选择一个。',
  NO_SESSIONS: '当前没有可附着的本机会话（已排除归档与空白会话）。请先在 Web（dsh web）打开或继续一个对话，再发 /sessions。',
  NO_SESSIONS_IN_WS(title: string): string {
    return `工作区「${title}」下没有可附着的会话。`
  },
  /** @deprecated use NO_SESSIONS */
  NO_LIVE: '当前没有可附着的本机会话。请先在 Web（dsh web）打开或继续一个对话，再发 /sessions。',
  PICKER_STALE: '列表已过期，请重新发送 /sessions。',
  RESUME_FAILED: '无法附着该会话（resume 失败）。请确认会话存在于 Web，或先在电脑打开后再试。',
  BOUND(label: string): string {
    return `已附着本机会话：${label}\n此后消息将进入该会话（与 Web 同轨迹）。\n需要续接时可点「查看上次对话」，或发送 /last。`
  },
  UNBOUND: '已断开绑定。本机会话仍在运行。',
  STATUS_NONE: '当前未绑定任何本机会话。发送 /sessions 选择。',
  STATUS_BOUND(label: string): string {
    return `当前绑定：${label}`
  },
  STATUS_BOUND_COLD(label: string): string {
    return `当前绑定：${label}\n（会话当前未在内存中运行；发消息时会自动 resume。）`
  },
  COMPACT_USAGE: '用法：/compact（无参数，压缩当前绑定会话的历史，缩短上下文）',
  COMPACT_UNAVAILABLE: '当前宿主不可用压缩：/compact 命令未注册（需宿主启用压缩插件 command-compact / compaction-basic 后重启 dsh web）。',
  COMPACT_STARTED: '已开始压缩会话历史…\n压缩会占用一个模型回合，期间新消息排队；完成或失败后会在这里报告结果。',
  COMPACT_BUSY: '当前会话有任务正在运行（或压缩锁被占用），无法压缩。请等本轮结束（或 /stop）后再试。',
  COMPACT_INFLIGHT: '该会话已在进行压缩，请稍候（完成后会报告结果）。',
  COMPACT_NOTHING: '压缩完成：暂无可压缩的有效历史（历史过短，或没有可安全汇总的区间）。',
  COMPACT_DONE(n: number, tokens: number): string {
    return `压缩完成：合并 ${n} 条历史记录（约 ${tokens} tokens）。上下文已缩短，会话可继续。`
  },
  COMPACT_CANCELLED: '压缩已取消（会话未改变）。',
  COMPACT_CHANGED: '压缩失败：待压缩的历史在过程中发生了变化（会话未改变），请重试。',
  COMPACT_SUMMARY_FAILED: '压缩失败：未能生成有效的摘要（会话未改变），请重试。',
  COMPACT_COMMIT_FAILED: '压缩未完整结束：部分历史可能已变化。请先检查会话状态再重试。',
  COMPACT_PERSIST_FAILED: '压缩完成但保存失败。请检查本机存储与权限后重试。',
  COMPACT_FAILED(detail?: string): string {
    const tip = '压缩失败。'
    if (!detail) return tip
    return `${tip}\n详情：${detail}`
  },
  GONE: '绑定的会话已不可用。请重新 /sessions。',
  MEDIA_UNSUPPORTED: '暂不支持该消息类型（支持文本与 png/jpeg/webp/gif 图片；语音/视频/其他文件请在 Web 端处理）。',
  IMAGE_MODEL_UNSUPPORTED: '当前模型不支持图片输入，请在 Web 端或 /model 切换到多模态模型后重试。',
  IMAGE_FAILED(detail?: string): string {
    const tip = '图片发送失败。'
    if (!detail) return tip
    return `${tip}\n详情：${detail}`
  },
  LAST_FAILED: '无法读取上次对话。请确认已绑定，且本机 dsh web / apiProxy 可用。',
  MODEL_UNAVAILABLE(detail?: string): string {
    const tip = '无法读取模型列表。请确认已绑定会话，且本机 dsh web 已加载 host-apiproxy。'
    if (!detail) return tip
    return `${tip}\n详情：${detail}`
  },
  MODEL_UNROUTABLE(current: string): string {
    return `当前模型不可路由：${current}\n请在 Web 或本机配置可用 provider 后再试 /model。`
  },
  MODEL_EMPTY(current: string): string {
    return `当前：${current}\n没有可切换的模型选项。`
  },
  MODEL_SET(selected: string): string {
    return `已切换模型：${selected}\n下一回合生效。`
  },
  RICH_USAGE: '用法：/rich on（富文本渲染，需新版客户端）｜/rich off（HTML 兼容，默认）｜/rich（查看当前状态）',
  RICH_STATE(mode: 'rich' | 'html'): string {
    return mode === 'rich'
      ? '当前渲染模式：富文本（on）。若你的客户端把回复显示为“不支持”，请发 /rich off 切回兼容。'
      : '当前渲染模式：HTML 兼容（off）。新版客户端可用 /rich on 开启富文本渲染。'
  },
  RICH_SET(mode: 'rich' | 'html'): string {
    return mode === 'rich'
      ? '已切换为富文本渲染（本聊天永久生效）。注意：需新版 Telegram 客户端才能显示，旧客户端会显示“不支持”。'
      : '已切换为 HTML 兼容渲染（本聊天永久生效），所有客户端版本均可正常显示。'
  },
  MODEL_FAILED(detail?: string): string {
    const tip = '切换模型失败。请稍后重试或在 Web 中切换。'
    if (!detail) return tip
    return `${tip}\n详情：${detail}`
  },
  unknown(command: string): string {
    return `未知命令 ${command}。发送 /help 查看可用命令。`
  },
} as const

export type ParsedCommand =
  | { type: 'start'; text: string }
  | { type: 'help'; text: string }
  | { type: 'sessions'; text: string }
  | { type: 'last'; text: string }
  | { type: 'model'; text: string }
  | { type: 'status'; text: string }
  | { type: 'compact'; text: string }
  | { type: 'rich'; text: string; arg?: string }
  | { type: 'unbind'; text: string }
  | { type: 'stop'; text: string }
  | { type: 'mission'; text: string }
  | { type: 'new'; text: string }
  | { type: 'cancel'; text: string }
  | { type: 'unknown'; command: string; text: string }
  | { type: 'plain'; text: string }

export function parseCommand(text: string): ParsedCommand {
  if (!text.startsWith('/')) return { type: 'plain', text }
  const raw = text.split(/\s+/)[0] ?? text
  const command = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw
  switch (command) {
    case '/start':
      return { type: 'start', text }
    case '/help':
      return { type: 'help', text }
    case '/sessions':
    case '/list':
      return { type: 'sessions', text }
    case '/last':
    case '/context':
      return { type: 'last', text }
    case '/model':
      return { type: 'model', text }
    case '/status':
      return { type: 'status', text }
    case '/compact':
      return { type: 'compact', text }
    case '/rich':
    case '/render':
    case '/setting': {
      const arg = text.split(/\s+/)[1]?.toLowerCase()
      return { type: 'rich', text, arg }
    }
    case '/unbind':
    case '/disconnect':
      return { type: 'unbind', text }
    case '/stop':
    case '/halt':
      return { type: 'stop', text }
    case '/mission':
    case '/todos':
      return { type: 'mission', text }
    case '/new':
    case '/create':
      return { type: 'new', text }
    case '/cancel':
      return { type: 'cancel', text }
    default:
      return { type: 'unknown', command, text }
  }
}

/** @deprecated Prefer short index callbacks (ws:/sid:); kept for old messages. */
export const BIND_CB_PREFIX = 'bind:'

/** Inline button: fetch last Q/A for the bound session. */
export const LAST_CB = 'last'
