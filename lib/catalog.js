import { randomUUID } from 'node:crypto';
import { resolveApiProxy } from './apiproxy.js';
import { describeAgent, readSessionTitle, workspaceName } from './label.js';
function rpcCall(fn, payload) {
    if (typeof fn !== 'function')
        return undefined;
    return fn({ rpcId: randomUUID(), payload });
}
function unwrap(res) {
    const r = res;
    if (r?.result && r.result.ok === true) {
        return r.result.value;
    }
    // Some wrappers may return value directly
    if (res && typeof res === 'object' && 'items' in res)
        return res;
    return undefined;
}
/** Explicit marker for a session that has no generated title yet. */
export const UNTITLED_SESSION = 'untitled session';
/** Short, stable, human-scannable id tail (last 12 chars, prefixed with …). */
export function sessionIdTail(sessionId) {
    const id = String(sessionId);
    return id.length > 12 ? `…${id.slice(-12)}` : id;
}
/**
 * Resolve a session's display title.
 *
 * Deliberately NEVER falls back to the workspace name: a workspace usually holds
 * several sessions, so a workspace-name fallback makes every untitled session in
 * that workspace render identically. Prefer the host's generated title (title
 * projection, or a session/title event), and otherwise show a short id tail so
 * sessions stay distinguishable.
 */
function titleOf(summary) {
    const projected = summary.projections?.values?.title;
    if (typeof projected === 'string' && projected.trim())
        return projected.trim();
    const events = summary.events;
    if (Array.isArray(events)) {
        for (let i = events.length - 1; i >= 0; i -= 1) {
            const ev = events[i];
            if (ev?.type === 'session/title' && typeof ev.data?.title === 'string') {
                const t = ev.data.title.trim();
                if (t)
                    return t;
            }
        }
    }
    return sessionIdTail(summary.sessionId);
}
/**
 * Load workspaces + sessions aligned with Web UI (via apiProxy when available).
 *
 * `liveAgents` is consulted for real titles: the sessions.list projection is a
 * zero-I/O cache read that yields undefined until a session has a durable
 * checkpoint, so a freshly booted host reports no title for most sessions and
 * the picker would fall back to id tails. The sessionTitle service derives the
 * title from the session log, so prefer it whenever the agent is live.
 */
export async function loadCatalog(ctx, liveAgents = []) {
    const api = resolveApiProxy(ctx);
    const runtimeTitles = new Map();
    for (const agent of liveAgents) {
        const title = readSessionTitle(ctx, agent.session);
        if (title)
            runtimeTitles.set(String(agent.id), title);
    }
    const wsPromise = rpcCall(api?.workspace?.list, {});
    const sessPromise = rpcCall(api?.sessions?.list, {});
    if (!wsPromise || !sessPromise)
        return undefined;
    const [wsRaw, sessRaw] = await Promise.all([wsPromise, sessPromise]);
    const wsVal = unwrap(wsRaw);
    const sessVal = unwrap(sessRaw);
    if (!wsVal || !sessVal)
        return undefined;
    const archivedIds = new Set((wsVal.archivedSessionIds ?? []).map(String));
    const sessionsById = new Map();
    for (const item of sessVal.items ?? []) {
        const sessionId = String(item.sessionId);
        sessionsById.set(sessionId, {
            sessionId,
            // Real title (sessionTitle service) wins over the cache-derived
            // projection; an id tail is the last resort, never the workspace name.
            title: runtimeTitles.get(sessionId) ?? titleOf({ ...item, sessionId }),
            cwd: item.cwd,
            blank: Boolean(item.blank),
            running: Boolean(item.running),
            origin: item.origin,
            updatedAt: Number(item.updatedAt) || 0,
        });
    }
    const workspaces = (wsVal.items ?? []).map((w) => ({
        id: String(w.workspaceId),
        title: w.title || workspaceName(w.path) || String(w.workspaceId),
        path: w.path,
        sessionIds: (w.sessionIds ?? []).map(String),
    }));
    return { workspaces, sessionsById, archivedIds, complete: true };
}
/** Sessions visible under one workspace (Web-like filters). */
export function visibleSessionsForWorkspace(catalog, workspace) {
    const rows = [];
    for (const id of workspace.sessionIds) {
        if (catalog.archivedIds.has(id))
            continue;
        const row = catalog.sessionsById.get(id);
        if (!row)
            continue;
        if (row.origin === 'subagent')
            continue;
        if (row.blank)
            continue;
        rows.push(row);
    }
    return rows;
}
export function workspacesWithVisibleSessions(catalog) {
    return catalog.workspaces.filter((w) => visibleSessionsForWorkspace(catalog, w).length > 0);
}
export function truncateButton(text, max = 64) {
    const chars = [...text];
    if (chars.length <= max)
        return text;
    return `${chars.slice(0, max - 1).join('')}…`;
}
/** Fallback when apiProxy is unavailable: group live agents by cwd. */
export function catalogFromLiveAgents(agents, ctx) {
    const sessionsById = new Map();
    const byPath = new Map();
    agents.forEach((agent, index) => {
        const parts = describeAgent(agent, index, ctx);
        const sessionId = parts.sessionId;
        const cwd = parts.cwd ?? '(unknown)';
        sessionsById.set(sessionId, {
            sessionId,
            // parts.title is the host's real session title (sessionTitle service /
            // title projection). Never substitute the workspace name here — that makes
            // every untitled session in a workspace look the same.
            title: parts.title || sessionIdTail(sessionId),
            cwd: parts.cwd,
            blank: false,
            running: true,
            updatedAt: Date.now() - index,
        });
        const bucket = byPath.get(cwd) ?? {
            title: parts.workspace || cwd,
            path: cwd,
            sessionIds: [],
        };
        bucket.sessionIds.push(sessionId);
        byPath.set(cwd, bucket);
    });
    const workspaces = [...byPath.entries()].map(([path, bucket], i) => ({
        id: `live:${i}`,
        title: bucket.title,
        path,
        sessionIds: bucket.sessionIds,
    }));
    return { workspaces, sessionsById, archivedIds: new Set(), complete: false };
}
