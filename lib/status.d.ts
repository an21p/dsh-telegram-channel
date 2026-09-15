/**
 * /status 的纯文本装配：把 /status 变成“通用状态显示”。
 *
 * 数据语义与 Web 底部统计条（dsh-client-ui-conversation 的 StatsLine）逐项对齐：
 * - sessionStats 投影：轮次/步数、LLM 与工具耗时、首 token 平均、输出速率（解码 tokens/解码墙钟）
 * - tokenUsage 投影：输入（uncached + cacheRead + cacheWrite）与输出 tokens、缓存命中率
 * - contextPressure 投影：上下文占用（projectedTokens ?? pressureTokens / contextWindow）
 * 数字取整/缩写规则与前端同款（formatTokens / formatDuration / formatTokensPerSecond /
 * cacheHitPercent 与 roundedIntegerPercent 同算法），保证 /status 与 Web 底部看到的完全一致。
 */
export interface StatusWorkspace {
    /** 工作区名（basename 或 Web 工作区标题）。 */
    title?: string;
    /** 完整目录/路径。 */
    path?: string;
}
export interface StatusModel {
    provider?: string;
    model?: string;
    /** reasoning effort id（如 off/low/high/max）；缺省表示 provider 默认行为。 */
    reasoningEffort?: string;
}
export interface StatusRuntime {
    turns?: number;
    steps?: number;
    llmMs?: number;
    toolMs?: number;
    ttftMs?: number;
    ttftSteps?: number;
    decodeMs?: number;
    decodeTokens?: number;
    uncachedInputTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
    outputTokens?: number;
    contextUsed?: number;
    contextWindow?: number;
}
export interface StatusInfo {
    /** 绑定时保存的会话展示名。 */
    label: string;
    /** 完整 SessionId 字符串。 */
    sessionId: string;
    workspace?: StatusWorkspace;
    model?: StatusModel;
    runtime?: StatusRuntime;
    /** false = 会话不在内存中（冷），仅能显示绑定与工作区信息。 */
    live?: boolean;
}
export declare function effortLabel(effort?: string): string | undefined;
/**
 * 紧凑 token 数：517 / 12.2K / 517K / 1.2M（三位以内保留一位小数）——与前端同款。
 */
export declare function formatTokens(n: number): string;
/**
 * 紧凑时长：45.2s 以内秒级一位小数，以上 m+s —— 与前端同款。
 */
export declare function formatDuration(ms: number): string;
/** 输出速率：>=10 取整，否则保留一位小数 —— 与前端同款。 */
export declare function formatTokensPerSecond(tps: number): string;
/** 计费口径的输入侧总量：uncached + cacheRead + cacheWrite（同 StatsLine.billedInputTokens）。 */
export declare function billedInputTokens(runtime: StatusRuntime): number;
/**
 * 缓存命中占比（计费输入中 cacheRead 的份额）；无计费输入返回 null。前端 cacheHitPercent 同算法。
 */
export declare function cacheHitPercent(runtime: StatusRuntime): string | null;
/**
 * 装配 /status 的完整回复文本。仅当某个数据组存在时才输出对应行；
 * 一组内同 Web 底部：无数据的子项整组省略。
 */
export declare function formatStatusText(info: StatusInfo): string;
