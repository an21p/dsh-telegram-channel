import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buttonLabel,
  describeAgent,
  detailLines,
  displayLabel,
  readSessionCwd,
  readSessionTitle,
  workspaceName,
} from '../src/label.ts'
import { SessionId } from '@deepseek-ai/dsh-session/types'

test('workspaceName takes last path segment', () => {
  assert.equal(workspaceName('D:\\gitData\\dsh-telegram-channel'), 'dsh-telegram-channel')
  assert.equal(workspaceName('/home/me/proj/app'), 'app')
})

test('readSessionCwd prefers header.cwd over meta.cwd', () => {
  assert.equal(readSessionCwd({ header: { cwd: '/real' }, meta: { cwd: '/old' } }), '/real')
  assert.equal(readSessionCwd({ meta: { cwd: '/legacy' } }), '/legacy')
})

test('readSessionTitle uses service, then events', () => {
  const session = {
    header: { cwd: '/w' },
    events: [
      { type: 'user/message', data: {} },
      { type: 'session/title', data: { title: '  Fix login  ' } },
    ],
  }
  assert.equal(readSessionTitle(undefined, session), 'Fix login')
  const ctx = {
    sessionTitle: { get: () => ({ title: 'from service' }) },
  }
  assert.equal(readSessionTitle(ctx as any, session), 'from service')
})

test('describeAgent builds title + workspace + id tail', () => {
  const agent = {
    id: SessionId('0123456789abcdef-live'),
    session: {
      header: { cwd: 'D:/gitData/my-app' },
      events: [{ type: 'session/title', data: { title: 'Refactor payments' } }],
    },
  }
  const parts = describeAgent(agent as any, 0)
  assert.equal(parts.title, 'Refactor payments')
  assert.equal(parts.workspace, 'my-app')
  assert.match(detailLines(parts), /Refactor payments/)
  assert.match(detailLines(parts), /D:\/gitData\/my-app/)
  assert.match(buttonLabel(parts), /^1\. Refactor payments/)
  assert.match(displayLabel(parts), /Refactor payments · …9abcdef-live/)
})

test('buttonLabel stays within 64 chars', () => {
  const longTitle = 'a'.repeat(80)
  const label = buttonLabel({
    index: 0,
    title: longTitle,
    workspace: 'ws',
    idTail: 'abc',
    sessionId: 'x',
  })
  assert.ok([...label].length <= 64)
})
