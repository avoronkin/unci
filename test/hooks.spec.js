'use strict'

const sinon = require('sinon')
const assert = require('assert')
const Hooks = require('../src/hooks')

describe('hooks', () => {
    it ('add hooks', async () => {
        const hooks = new Hooks()
        const spy1 = sinon.spy()
        const spy2 = sinon.spy((data, cb) => cb())
        const spy3 = sinon.spy(() =>  Promise.resolve())

        hooks.add('test', spy1)
        hooks.add('test', spy2)
        hooks.add('test', spy3)

        const data = {key: 'value'}

        await hooks.run('test', data)

        assert.equal(spy1.calledOnce, true)
        assert.deepEqual(spy1.firstCall.args[0], data)
        assert.equal(spy2.calledOnce, true)
        assert.deepEqual(spy2.firstCall.args[0], data)
        assert.equal(spy3.calledOnce, true)
        assert.deepEqual(spy3.firstCall.args[0], data)

        assert.equal(spy1.calledBefore(spy2), true)
        assert.equal(spy2.calledBefore(spy3), true)
    })
})
