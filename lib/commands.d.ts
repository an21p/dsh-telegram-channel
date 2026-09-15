export declare const MSG: {
    readonly DENIED: "无权限。";
    readonly WELCOME: string;
    readonly HELP: string;
    readonly NEED_BIND: "尚未绑定本机会话。请先发送 /sessions 选择一个。";
    readonly NO_SESSIONS: "当前没有可附着的本机会话（已排除归档与空白会话）。请先在 Web（dsh web）打开或继续一个对话，再发 /sessions。";
    readonly NO_SESSIONS_IN_WS: (title: string) => string;
    /** @deprecated use NO_SESSIONS */
    readonly NO_LIVE: "当前没有可附着的本机会话。请先在 Web（dsh web）打开或继续一个对话，再发 /sessions。";
    readonly PICKER_STALE: "列表已过期，请重新发送 /sessions。";
    readonly RESUME_FAILED: "无法附着该会话（resume 失败）。请确认会话存在于 Web，或先在电脑打开后再试。";
    readonly BOUND: (label: string) => string;
    readonly UNBOUND: "已断开绑定。本机会话仍在运行。";
    readonly STATUS_NONE: "当前未绑定任何本机会话。发送 /sessions 选择。";
    readonly STATUS_BOUND: (label: string) => string;
    readonly STATUS_BOUND_COLD: (label: string) => string;
    readonly COMPACT_USAGE: "用法：/compact（无参数，压缩当前绑定会话的历史，缩短上下文）";
    readonly COMPACT_UNAVAILABLE: "当前宿主不可用压缩：/compact 命令未注册（需宿主启用压缩插件 command-compact / compaction-basic 后重启 dsh web）。";
    readonly COMPACT_STARTED: "已开始压缩会话历史…\n压缩会占用一个模型回合，期间新消息排队；完成或失败后会在这里报告结果。";
    readonly COMPACT_BUSY: "当前会话有任务正在运行（或压缩锁被占用），无法压缩。请等本轮结束（或 /stop）后再试。";
    readonly COMPACT_INFLIGHT: "该会话已在进行压缩，请稍候（完成后会报告结果）。";
    readonly COMPACT_NOTHING: "压缩完成：暂无可压缩的有效历史（历史过短，或没有可安全汇总的区间）。";
    readonly COMPACT_DONE: (n: number, tokens: number) => string;
    readonly COMPACT_CANCELLED: "压缩已取消（会话未改变）。";
    readonly COMPACT_CHANGED: "压缩失败：待压缩的历史在过程中发生了变化（会话未改变），请重试。";
    readonly COMPACT_SUMMARY_FAILED: "压缩失败：未能生成有效的摘要（会话未改变），请重试。";
    readonly COMPACT_COMMIT_FAILED: "压缩未完整结束：部分历史可能已变化。请先检查会话状态再重试。";
    readonly COMPACT_PERSIST_FAILED: "压缩完成但保存失败。请检查本机存储与权限后重试。";
    readonly COMPACT_FAILED: (detail?: string) => string;
    readonly GONE: "绑定的会话已不可用。请重新 /sessions。";
    readonly MEDIA_UNSUPPORTED: "暂不支持该消息类型（支持文本与 png/jpeg/webp/gif 图片；语音/视频/其他文件请在 Web 端处理）。";
    readonly IMAGE_MODEL_UNSUPPORTED: "当前模型不支持图片输入，请在 Web 端或 /model 切换到多模态模型后重试。";
    readonly IMAGE_FAILED: (detail?: string) => string;
    readonly LAST_FAILED: "无法读取上次对话。请确认已绑定，且本机 dsh web / apiProxy 可用。";
    readonly MODEL_UNAVAILABLE: (detail?: string) => string;
    readonly MODEL_UNROUTABLE: (current: string) => string;
    readonly MODEL_EMPTY: (current: string) => string;
    readonly MODEL_SET: (selected: string) => string;
    readonly RICH_USAGE: "用法：/rich on（富文本渲染，需新版客户端）｜/rich off（HTML 兼容，默认）｜/rich（查看当前状态）";
    readonly RICH_STATE: (mode: "rich" | "html") => string;
    readonly RICH_SET: (mode: "rich" | "html") => string;
    readonly MODEL_FAILED: (detail?: string) => string;
    readonly unknown: (command: string) => string;
};
export type ParsedCommand = {
    type: 'start';
    text: string;
} | {
    type: 'help';
    text: string;
} | {
    type: 'sessions';
    text: string;
} | {
    type: 'last';
    text: string;
} | {
    type: 'model';
    text: string;
} | {
    type: 'status';
    text: string;
} | {
    type: 'compact';
    text: string;
} | {
    type: 'rich';
    text: string;
    arg?: string;
} | {
    type: 'unbind';
    text: string;
} | {
    type: 'stop';
    text: string;
} | {
    type: 'mission';
    text: string;
} | {
    type: 'new';
    text: string;
} | {
    type: 'cancel';
    text: string;
} | {
    type: 'unknown';
    command: string;
    text: string;
} | {
    type: 'plain';
    text: string;
};
export declare function parseCommand(text: string): ParsedCommand;
/** @deprecated Prefer short index callbacks (ws:/sid:); kept for old messages. */
export declare const BIND_CB_PREFIX = "bind:";
/** Inline button: fetch last Q/A for the bound session. */
export declare const LAST_CB = "last";
