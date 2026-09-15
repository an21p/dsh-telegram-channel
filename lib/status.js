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
const EFFORT_NAMES = {
    off: '关闭（off）',
    low: '低（low）',
    medium: '中（medium）',
    high: '高（high）',
    max: '最高（max）',
};
export function effortLabel(effort) {
    if (!effort)
        return undefined;
    return EFFORT_NAMES[effort] ?? String(effort);
}
/**
 * 紧凑 token 数：517 / 12.2K / 517K / 1.2M（三位以内保留一位小数）——与前端同款。
 */
export function formatTokens(n) {
    const scaled = (v) => v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10);
    if (n < 1_000)
        return String(n);
    if (n < 1_000_000)
        return `${scaled(n / 1_000)}K`;
    return `${scaled(n / 1_000_000)}M`;
}
/**
 * 紧凑时长：45.2s 以内秒级一位小数，以上 m+s —— 与前端同款。
 */
export function formatDuration(ms) {
    const s = ms / 1_000;
    if (s < 60)
        return `${Math.round(s * 10) / 10}s`;
    const whole = Math.round(s);
    return `${Math.floor(whole / 60)}m${whole % 60}s`;
}
/** 输出速率：>=10 取整，否则保留一位小数 —— 与前端同款。 */
export function formatTokensPerSecond(tps) {
    const clamped = Math.max(0, tps);
    return clamped >= 10 ? String(Math.round(clamped)) : String(Math.round(clamped * 10) / 10);
}
/** 计费口径的输入侧总量：uncached + cacheRead + cacheWrite（同 StatsLine.billedInputTokens）。 */
export function billedInputTokens(runtime) {
    return (runtime.uncachedInputTokens ?? 0)
        + (runtime.cacheReadTokens ?? 0)
        + (runtime.cacheWriteTokens ?? 0);
}
/** 向下取整到 <100 的整数百分比（前端 roundedIntegerPercent 同算法）。 */
function roundedIntegerPercent(cacheReadTokens, denominator) {
    const denominatorQuotient = Math.floor(denominator / 200);
    const denominatorRemainder = denominator % 200;
    let lower = 0;
    let upper = 100;
    while (lower < upper) {
        const candidate = Math.floor((lower + upper + 1) / 2);
        const factor = candidate * 2 - 1;
        const threshold = factor * denominatorQuotient
            + Math.ceil(factor * denominatorRemainder / 200);
        if (cacheReadTokens >= threshold) {
            lower = candidate;
        }
        else {
            upper = candidate - 1;
        }
    }
    return lower;
}
/**
 * 缓存命中占比（计费输入中 cacheRead 的份额）；无计费输入返回 null。前端 cacheHitPercent 同算法。
 */
export function cacheHitPercent(runtime) {
    const denominator = billedInputTokens(runtime);
    if (denominator === 0)
        return null;
    const missed = (runtime.uncachedInputTokens ?? 0) + (runtime.cacheWriteTokens ?? 0);
    const read = runtime.cacheReadTokens ?? 0;
    if (missed === 0)
        return '100';
    const integerPercent = roundedIntegerPercent(read, denominator);
    if (integerPercent < 100)
        return String(integerPercent);
    // 命中率贴近 100% 时，逐位提高精度直到能区分出 <100 的小数。
    let decimalPlaces = 1;
    let scaledDoubleGap = missed * 200;
    const denominatorTens = Math.floor(denominator / 10);
    while (scaledDoubleGap <= denominatorTens) {
        scaledDoubleGap *= 10;
        decimalPlaces += 1;
    }
    const denominatorOnes = denominator % 10;
    let roundedLoss = 5;
    for (let loss = 1; loss < 5; loss += 1) {
        const factor = loss * 2 + 1;
        const threshold = factor * denominatorTens + Math.floor(factor * denominatorOnes / 10);
        if (scaledDoubleGap <= threshold) {
            roundedLoss = loss;
            break;
        }
    }
    return `99.${'9'.repeat(decimalPlaces - 1)}${10 - roundedLoss}`;
}
/**
 * 装配 /status 的完整回复文本。仅当某个数据组存在时才输出对应行；
 * 一组内同 Web 底部：无数据的子项整组省略。
 */
export function formatStatusText(info) {
    const lines = ['会话状态'];
    lines.push(`会话：${info.label || info.sessionId}`);
    lines.push(`会话 ID：${info.sessionId}`);
    const ws = info.workspace;
    if (ws?.title || ws?.path) {
        const primary = ws.title && ws.path
            ? `${ws.title}（${ws.path}）`
            : (ws.title ?? ws.path ?? '');
        lines.push(`工作区：${primary}`);
    }
    const model = info.model;
    if (model?.provider && model?.model) {
        lines.push(`模型：${model.provider}/${model.model}`);
        lines.push(`思考强度：${effortLabel(model.reasoningEffort) ?? '默认（未指定）'}`);
    }
    const runtime = info.runtime;
    if (runtime !== undefined) {
        const contextUsed = runtime.contextUsed;
        const window = runtime.contextWindow;
        if (contextUsed !== undefined && window !== undefined && window > 0) {
            const percent = Math.min(100, Math.round(contextUsed / window * 100));
            lines.push(`上下文：${formatTokens(contextUsed)} / ${formatTokens(window)} tokens（${percent}%）`);
        }
        else if (contextUsed !== undefined) {
            lines.push(`上下文：${formatTokens(contextUsed)} tokens（窗口大小未知）`);
        }
        const stats = [];
        if ((runtime.steps ?? 0) > 0) {
            stats.push(`${runtime.turns ?? 0} 轮 · ${runtime.steps ?? 0} 步`);
            const durations = [];
            if ((runtime.llmMs ?? 0) > 0)
                durations.push(`LLM ${formatDuration(runtime.llmMs)}`);
            if ((runtime.toolMs ?? 0) > 0)
                durations.push(`工具调用 ${formatDuration(runtime.toolMs)}`);
            if (durations.length > 0)
                stats.push(durations.join(' · '));
            const speeds = [];
            if ((runtime.ttftSteps ?? 0) > 0) {
                speeds.push(`首 token 平均 ${formatDuration((runtime.ttftMs ?? 0) / runtime.ttftSteps)}`);
            }
            if ((runtime.decodeMs ?? 0) > 0) {
                speeds.push(`${formatTokensPerSecond((runtime.decodeTokens ?? 0) / (runtime.decodeMs / 1_000))} tok/s`);
            }
            if (speeds.length > 0)
                stats.push(speeds.join(' · '));
        }
        if (billedInputTokens(runtime) > 0 || (runtime.outputTokens ?? 0) > 0) {
            const hit = cacheHitPercent(runtime);
            const billing = [
                hit === null ? '' : `缓存命中 ${hit}%`,
                `输入 ${formatTokens(billedInputTokens(runtime))} tok · 输出 ${formatTokens(runtime.outputTokens ?? 0)} tok`,
            ].filter(Boolean).join(' · ');
            stats.push(billing);
        }
        if (stats.length > 0) {
            lines.push('');
            lines.push('统计（与 Web 底部一致）');
            lines.push(...stats.map((s) => `  ${s}`));
        }
    }
    if (info.live === false) {
        lines.push('');
        lines.push('（会话当前不在内存中；直接发消息会自动 resume。）');
    }
    return lines.join('\n');
}
