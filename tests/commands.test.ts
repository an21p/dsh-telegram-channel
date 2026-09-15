import assert from 'node:assert/strict'
import test from 'node:test'
import { MSG, parseCommand } from '../src/commands.ts'

test('parse slash commands for remote control', () => {
  assert.equal(parseCommand('/start').type, 'start')
  assert.equal(parseCommand('/help').type, 'help')
  assert.equal(parseCommand('/sessions').type, 'sessions')
  assert.equal(parseCommand('/list').type, 'sessions')
  assert.equal(parseCommand('/status').type, 'status')
  assert.equal(parseCommand('/unbind').type, 'unbind')
  assert.equal(parseCommand('/disconnect').type, 'unbind')
  assert.equal(parseCommand('/model').type, 'model')
  assert.equal(parseCommand('/last').type, 'last')
  assert.equal(parseCommand('/context').type, 'last')
  assert.equal(parseCommand('/sessions@MyBot').type, 'sessions')
  assert.equal(parseCommand('/foo').type, 'unknown')
  assert.equal(parseCommand('hello').type, 'plain')
})

test('parse /rich with optional mode argument', () => {
  const bare = parseCommand('/rich')
  assert.equal(bare.type, 'rich')
  assert.equal(bare.type === 'rich' ? bare.arg : 'x', undefined)
  const on = parseCommand('/rich on')
  assert.equal(on.type, 'rich')
  assert.equal(on.type === 'rich' ? on.arg : 'x', 'on')
  assert.equal(parseCommand('/rich off').type === 'rich' && parseCommand('/rich off').arg, 'off')
  assert.equal(parseCommand('/rich ON').type === 'rich' && parseCommand('/rich ON').arg, 'on')
  assert.equal(parseCommand('/render auto').type === 'rich' && parseCommand('/render auto').arg, 'auto')
  assert.equal(parseCommand('/setting').type, 'rich')
  assert.equal(parseCommand('/setting html').type === 'rich' && parseCommand('/setting html').arg, 'html')
})

test('Chinese copy mentions sessions and bind', () => {
  assert.ok(MSG.DENIED.includes('权限') || MSG.DENIED.includes('授权'))
  assert.ok(MSG.HELP.includes('/sessions'))
  assert.ok(MSG.HELP.includes('/last'))
  assert.ok(MSG.HELP.includes('/model'))
  assert.ok(MSG.NEED_BIND.includes('/sessions'))
  assert.ok(MSG.WELCOME.includes('Web') || MSG.WELCOME.includes('遥控器'))
})

test('parse /compact', () => {
  assert.equal(parseCommand('/compact').type, 'compact')
  assert.equal(parseCommand('/compact@MyBot').type, 'compact')
  assert.equal(parseCommand('/compact now').type, 'compact')
})
