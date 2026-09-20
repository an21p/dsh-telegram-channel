export declare const MSG: {
    readonly DENIED: "Not authorized.";
    readonly WELCOME: string;
    readonly HELP: string;
    readonly NEED_BIND: "No desktop session bound yet. Send /sessions to pick one.";
    readonly NO_SESSIONS: "No attachable desktop session right now (archived and empty sessions are excluded). Open or continue a conversation in the Web UI (dsh web) first, then send /sessions.";
    readonly NO_SESSIONS_IN_WS: (title: string) => string;
    /** @deprecated use NO_SESSIONS */
    readonly NO_LIVE: "No attachable desktop session right now. Open or continue a conversation in the Web UI (dsh web) first, then send /sessions.";
    readonly PICKER_STALE: "That list has expired. Please send /sessions again.";
    readonly RESUME_FAILED: "Could not attach that session (resume failed). Check that the session exists in the Web UI, or open it on the desktop and try again.";
    readonly BOUND: (label: string) => string;
    readonly UNBOUND: "Detached. The desktop session is still running.";
    readonly STATUS_NONE: "No desktop session bound. Send /sessions to pick one.";
    readonly STATUS_BOUND: (label: string) => string;
    readonly STATUS_BOUND_COLD: (label: string) => string;
    readonly COMPACT_USAGE: "Usage: /compact (no arguments — compacts the bound session history to shorten context)";
    readonly COMPACT_UNAVAILABLE: "Compaction is unavailable on this host: the /compact command is not registered (the host must enable the command-compact / compaction-basic plugin, then restart dsh web).";
    readonly COMPACT_STARTED: "Started compacting the session history…\nCompaction consumes one model turn and new messages queue meanwhile; the result is reported here when it finishes or fails.";
    readonly COMPACT_BUSY: "This session has a task running (or the compaction lock is held), so it cannot compact. Wait for the current turn to finish (or /stop) and try again.";
    readonly COMPACT_INFLIGHT: "That session is already compacting. Please wait (the result is reported when it finishes).";
    readonly COMPACT_NOTHING: "Compaction finished: no compactable history yet (history is too short, or there is no range that can be safely summarized).";
    readonly COMPACT_DONE: (n: number, tokens: number) => string;
    readonly COMPACT_CANCELLED: "Compaction cancelled (the session is unchanged).";
    readonly COMPACT_CHANGED: "Compaction failed: the history to compact changed in the meantime (the session is unchanged). Please retry.";
    readonly COMPACT_SUMMARY_FAILED: "Compaction failed: no valid summary could be produced (the session is unchanged). Please retry.";
    readonly COMPACT_COMMIT_FAILED: "Compaction did not finish cleanly: part of the history may have changed. Check the session state, then retry.";
    readonly COMPACT_PERSIST_FAILED: "Compaction finished but could not be saved. Check local storage and permissions, then retry.";
    readonly COMPACT_FAILED: (detail?: string) => string;
    readonly GONE: "The bound session is no longer available. Please /sessions again.";
    readonly MEDIA_UNSUPPORTED: "That message type is not supported yet (text and png/jpeg/webp/gif images are supported; handle voice/video/other files on the Web side).";
    readonly IMAGE_MODEL_UNSUPPORTED: "The current model does not accept image input.\nSend /model to switch this session to a multimodal model (e.g. a streamlake-vision model), then resend the image.";
    readonly IMAGE_FAILED: (detail?: string) => string;
    readonly LAST_FAILED: "Could not read the last conversation. Check that a session is bound and that local dsh web / apiProxy is available.";
    readonly MODEL_UNAVAILABLE: (detail?: string) => string;
    readonly MODEL_UNROUTABLE: (current: string) => string;
    readonly MODEL_EMPTY: (current: string) => string;
    readonly MODEL_SET: (selected: string) => string;
    readonly RICH_USAGE: "Usage: /rich on (rich text rendering, needs a recent client) | /rich off (HTML compatible, default) | /rich (show current state)";
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
