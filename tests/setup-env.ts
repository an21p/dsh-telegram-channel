/**
 * Test-run environment guard — loaded before any test module.
 *
 * `TelegramBridge` persists chat bindings to
 * `<DSH_HOME>/telegram-channel-bindings.json`, overridable with
 * `DSH_TELEGRAM_BINDINGS_FILE`. Several tests bind a chat, and only two of them
 * set that override themselves, so running the suite used to write the FAKE test
 * bindings (e.g. sessionId `live-img-dl`) over the operator's real
 * `~/.dsh/telegram-channel-bindings.json`.
 *
 * That is destructive and not recoverable: the plugin writes in place with
 * `writeFileSync` (no temp-and-rename), so the previous contents are gone. It
 * also silently breaks a live bot, whose next message fails to resume a session
 * id that only ever existed in a test.
 *
 * Redirecting the path here keeps every test isolated by default, including
 * tests added later, so the suite is safe to run against a live install.
 */
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

process.env.DSH_TELEGRAM_BINDINGS_FILE ??= join(
  mkdtempSync(join(tmpdir(), 'dsh-tg-test-bindings-')),
  'bindings.json',
)
