import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
export interface WorkspaceRow {
    id: string;
    title: string;
    path: string;
    sessionIds: string[];
}
export interface SessionRow {
    sessionId: string;
    title: string;
    cwd?: string;
    blank: boolean;
    running: boolean;
    origin?: string;
    updatedAt: number;
}
export interface CatalogSnapshot {
    workspaces: WorkspaceRow[];
    sessionsById: Map<string, SessionRow>;
    archivedIds: Set<string>;
    /** true when loaded from apiProxy (Web-aligned); false for live-agent fallback. */
    complete: boolean;
}
/** Explicit marker for a session that has no generated title yet. */
export declare const UNTITLED_SESSION = "untitled session";
/** Short, stable, human-scannable id tail (last 12 chars, prefixed with …). */
export declare function sessionIdTail(sessionId: string): string;
/**
 * Load workspaces + sessions aligned with Web UI (via apiProxy when available).
 *
 * `liveAgents` is consulted for real titles: the sessions.list projection is a
 * zero-I/O cache read that yields undefined until a session has a durable
 * checkpoint, so a freshly booted host reports no title for most sessions and
 * the picker would fall back to id tails. The sessionTitle service derives the
 * title from the session log, so prefer it whenever the agent is live.
 */
export declare function loadCatalog(ctx: Context, liveAgents?: readonly Agent[]): Promise<CatalogSnapshot | undefined>;
/** Sessions visible under one workspace (Web-like filters). */
export declare function visibleSessionsForWorkspace(catalog: CatalogSnapshot, workspace: WorkspaceRow): SessionRow[];
export declare function workspacesWithVisibleSessions(catalog: CatalogSnapshot): WorkspaceRow[];
export declare function truncateButton(text: string, max?: number): string;
/** Fallback when apiProxy is unavailable: group live agents by cwd. */
export declare function catalogFromLiveAgents(agents: Agent[], ctx?: Context): CatalogSnapshot;
