export const MSG = {
    DENIED: 'Not authorized.',
    WELCOME: [
        'Hello — this is the DeepSeek Harness mobile remote.',
        'Your desktop session is the source of truth: open a conversation in the Web UI first, then use /sessions to pick a workspace → session and attach.',
        'Send /help to see the commands.',
    ].join('\n'),
    HELP: [
        '/sessions — list local sessions by workspace (Web-aligned, archived excluded) and attach',
        '/last — show the last Q/A of the bound session (to pick up context)',
        '/model — switch the bound session\'s model (takes effect next turn)',
        '/status — session status: binding/session ID/workspace/model/reasoning effort/context/ttft/rate/input-output tokens',
        '/compact — compact the current session history (shortens context; runs while the session is idle)',
        '/rich — rendering mode: on=rich text (needs a recent client) / off=HTML compatible (default); persists for this chat',
        '/unbind — detach the phone (does not close the desktop session)',
        '/help — show this help',
        '',
        'Once attached, just send text and it goes into that desktop session; Web and phone see the same trajectory.',
        'Sending an image directly (or an image with a caption) also enters that session, with the caption used as the message text.',
        'Allowlisted users only. With no sessions available, open a conversation in dsh web first or keep a past session.',
    ].join('\n'),
    NEED_BIND: 'No desktop session bound yet. Send /sessions to pick one.',
    NO_SESSIONS: 'No attachable desktop session right now (archived and empty sessions are excluded). Open or continue a conversation in the Web UI (dsh web) first, then send /sessions.',
    NO_SESSIONS_IN_WS(title) {
        return `No attachable sessions in workspace "${title}".`;
    },
    /** @deprecated use NO_SESSIONS */
    NO_LIVE: 'No attachable desktop session right now. Open or continue a conversation in the Web UI (dsh web) first, then send /sessions.',
    PICKER_STALE: 'That list has expired. Please send /sessions again.',
    RESUME_FAILED: 'Could not attach that session (resume failed). Check that the session exists in the Web UI, or open it on the desktop and try again.',
    BOUND(label) {
        return `Attached to desktop session: ${label}\nFrom now on messages go into that session (same trajectory as Web).\nTo pick up context, tap "Last conversation" or send /last.`;
    },
    UNBOUND: 'Detached. The desktop session is still running.',
    STATUS_NONE: 'No desktop session bound. Send /sessions to pick one.',
    STATUS_BOUND(label) {
        return `Currently bound: ${label}`;
    },
    STATUS_BOUND_COLD(label) {
        return `Currently bound: ${label}\n(That session is not in memory right now; sending a message resumes it automatically.)`;
    },
    COMPACT_USAGE: 'Usage: /compact (no arguments — compacts the bound session history to shorten context)',
    COMPACT_UNAVAILABLE: 'Compaction is unavailable on this host: the /compact command is not registered (the host must enable the command-compact / compaction-basic plugin, then restart dsh web).',
    COMPACT_STARTED: 'Started compacting the session history…\nCompaction consumes one model turn and new messages queue meanwhile; the result is reported here when it finishes or fails.',
    COMPACT_BUSY: 'This session has a task running (or the compaction lock is held), so it cannot compact. Wait for the current turn to finish (or /stop) and try again.',
    COMPACT_INFLIGHT: 'That session is already compacting. Please wait (the result is reported when it finishes).',
    COMPACT_NOTHING: 'Compaction finished: no compactable history yet (history is too short, or there is no range that can be safely summarized).',
    COMPACT_DONE(n, tokens) {
        return `Compaction finished: merged ${n} history entries (about ${tokens} tokens). Context shortened; the session can continue.`;
    },
    COMPACT_CANCELLED: 'Compaction cancelled (the session is unchanged).',
    COMPACT_CHANGED: 'Compaction failed: the history to compact changed in the meantime (the session is unchanged). Please retry.',
    COMPACT_SUMMARY_FAILED: 'Compaction failed: no valid summary could be produced (the session is unchanged). Please retry.',
    COMPACT_COMMIT_FAILED: 'Compaction did not finish cleanly: part of the history may have changed. Check the session state, then retry.',
    COMPACT_PERSIST_FAILED: 'Compaction finished but could not be saved. Check local storage and permissions, then retry.',
    COMPACT_FAILED(detail) {
        const tip = 'Compaction failed.';
        if (!detail)
            return tip;
        return `${tip}\nDetails: ${detail}`;
    },
    GONE: 'The bound session is no longer available. Please /sessions again.',
    MEDIA_UNSUPPORTED: 'That message type is not supported yet (text and png/jpeg/webp/gif images are supported; handle voice/video/other files on the Web side).',
    IMAGE_MODEL_UNSUPPORTED: 'The current model does not accept image input.\nSend /model to switch this session to a multimodal model (e.g. a streamlake-vision model), then resend the image.',
    IMAGE_FAILED(detail) {
        const tip = 'Sending the image failed.';
        if (!detail)
            return tip;
        return `${tip}\nDetails: ${detail}`;
    },
    LAST_FAILED: 'Could not read the last conversation. Check that a session is bound and that local dsh web / apiProxy is available.',
    MODEL_UNAVAILABLE(detail) {
        const tip = 'Could not read the model list. Check that a session is bound and that local dsh web has loaded host-apiproxy.';
        if (!detail)
            return tip;
        return `${tip}\nDetails: ${detail}`;
    },
    MODEL_UNROUTABLE(current) {
        return `The current model is not routable: ${current}\nConfigure an available provider in the Web UI or locally, then try /model again.`;
    },
    MODEL_EMPTY(current) {
        return `Current: ${current}\nThere are no alternative models to switch to.`;
    },
    MODEL_SET(selected) {
        return `Model switched: ${selected}\nTakes effect next turn.`;
    },
    RICH_USAGE: 'Usage: /rich on (rich text rendering, needs a recent client) | /rich off (HTML compatible, default) | /rich (show current state)',
    RICH_STATE(mode) {
        return mode === 'rich'
            ? 'Current rendering mode: rich text (on). If your client shows replies as "not supported", send /rich off to go back to compatible mode.'
            : 'Current rendering mode: HTML compatible (off). Recent clients can enable rich text with /rich on.';
    },
    RICH_SET(mode) {
        return mode === 'rich'
            ? 'Switched to rich text rendering (persists for this chat). Note: it needs a recent Telegram client; older clients show "not supported".'
            : 'Switched to HTML compatible rendering (persists for this chat); all client versions display it correctly.';
    },
    MODEL_FAILED(detail) {
        const tip = 'Switching the model failed. Try again shortly, or switch in the Web UI.';
        if (!detail)
            return tip;
        return `${tip}\nDetails: ${detail}`;
    },
    unknown(command) {
        return `Unknown command ${command}. Send /help for the available commands.`;
    },
};
export function parseCommand(text) {
    if (!text.startsWith('/'))
        return { type: 'plain', text };
    const raw = text.split(/\s+/)[0] ?? text;
    const command = raw.includes('@') ? raw.slice(0, raw.indexOf('@')) : raw;
    switch (command) {
        case '/start':
            return { type: 'start', text };
        case '/help':
            return { type: 'help', text };
        case '/sessions':
        case '/list':
            return { type: 'sessions', text };
        case '/last':
        case '/context':
            return { type: 'last', text };
        case '/model':
            return { type: 'model', text };
        case '/status':
            return { type: 'status', text };
        case '/compact':
            return { type: 'compact', text };
        case '/rich':
        case '/render':
        case '/setting': {
            const arg = text.split(/\s+/)[1]?.toLowerCase();
            return { type: 'rich', text, arg };
        }
        case '/unbind':
        case '/disconnect':
            return { type: 'unbind', text };
        case '/stop':
        case '/halt':
            return { type: 'stop', text };
        case '/mission':
        case '/todos':
            return { type: 'mission', text };
        case '/new':
        case '/create':
            return { type: 'new', text };
        case '/cancel':
            return { type: 'cancel', text };
        default:
            return { type: 'unknown', command, text };
    }
}
/** @deprecated Prefer short index callbacks (ws:/sid:); kept for old messages. */
export const BIND_CB_PREFIX = 'bind:';
/** Inline button: fetch last Q/A for the bound session. */
export const LAST_CB = 'last';
