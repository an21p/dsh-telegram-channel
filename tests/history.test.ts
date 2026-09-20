import assert from 'node:assert/strict'
import test from 'node:test'
import { extractLastTurn, formatLastTurn } from '../src/history.ts'

test('extractLastTurn pairs latest human user with following assistant', () => {
  const turn = extractLastTurn([
    {
      type: 'user/message',
      data: { source: { kind: 'plugin', plugin: 'x' }, content: [{ type: 'text', text: 'injected' }] },
    },
    {
      type: 'user/message',
      data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'first question' }] },
    },
    {
      type: 'assistant/message',
      data: { message: { content: [{ type: 'text', text: 'first answer' }] } },
    },
    {
      type: 'user/message',
      data: { source: { kind: 'user' }, content: [{ type: 'text', text: 'second question' }] },
    },
    {
      type: 'assistant/message',
      data: { message: { content: [{ type: 'text', text: 'second answer' }] } },
    },
  ])
  assert.equal(turn.userText, 'second question')
  assert.equal(turn.assistantText, 'second answer')
})

test('formatLastTurn renders sections', () => {
  const text = formatLastTurn({ userText: 'hi', assistantText: 'hello' })
  assert.match(text, /\[User\]/)
  assert.match(text, /hi/)
  assert.match(text, /\[Assistant\]/)
  assert.match(text, /hello/)
})
