'use strict'

const sinon = require('sinon')
const assert = require('assert')
const Layer = require('../src/layer')

describe('layer', () => {
    it ('run middlewares', async () => {
        const layer = new Layer()
        const spy1 = sinon.spy(function () {})
        const spy2 = sinon.spy((data, cb) => {
            cb()
        })
        const spy3 = sinon.spy(async (data, next) =>  {
            await Promise.resolve()
            next(null, 5)
        })

        layer
            .use(spy1)
            .use(spy2)
            .use(spy3)

        const data = {key: 'value'}

        const [result] = await layer.run(data)

        assert.equal(result, 5)
        assert.equal(spy1.calledOnce, true)
        assert.deepEqual(spy1.firstCall.args[0], data)
        assert.equal(spy2.calledOnce, true)
        assert.deepEqual(spy2.firstCall.args[0], data)
        assert.equal(spy3.calledOnce, true)
        assert.deepEqual(spy3.firstCall.args[0], data)

        assert.equal(spy1.calledBefore(spy2), true)
        assert.equal(spy2.calledBefore(spy3), true)
    })

    it ('can mutate middleware arguments', async () => {
        const layer = new Layer()
        const spy1 = sinon.spy(function (value1, value2, next) {
            next(null, value1 * 2, value2 * 2)
        })
        const spy2 = sinon.spy(function (value1, value2, next) {
            next(null, value1 * value2)
        })

        layer
            .use(spy1)
            .use(spy2)

        const [result] = await layer.run(2, 5)

        assert.equal(spy1.calledOnce, true)
        assert.deepEqual(spy1.firstCall.args[0], 2)
        assert.deepEqual(spy1.firstCall.args[1], 5)
        assert.equal(spy2.calledOnce, true)
        assert.deepEqual(spy2.firstCall.args[0], 4)
        assert.deepEqual(spy2.firstCall.args[1], 10)
        assert.equal(result, 40)

        assert.equal(spy1.calledBefore(spy2), true)
    })

    it ('throw error in sync fn', async () => {
        const layer = new Layer()
        const spy1 = sinon.spy(function () {
            throw new Error()
        })
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        const data = {key: 'value'}

        try {
            layer
                .use(spy1)
                .use(spy2)
                .use(spy3)

            await layer.run(data)

        } catch (err) {
            assert.equal(spy1.calledOnce, true)
            assert.deepEqual(spy1.firstCall.args[0], data)
            assert(spy1.firstCall.exception)
            assert.equal(spy2.called, false)
            assert.equal(spy3.called, false)
        }
    })

    it ('throw error from callback', async () => {
        const layer = new Layer()
        const spy1 = sinon.spy(function (data, cb) {
            cb(new Error())
        })
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        const data = {key: 'value'}

        try {
            layer
                .use(spy1)
                .use(spy2)
                .use(spy3)

            await layer.run(data)

            assert(true)
        }
        catch (err) {
            assert.equal(spy1.calledOnce, true)
            assert.deepEqual(spy1.firstCall.args[0], data)
            assert.equal(spy2.called, false)
            assert.equal(spy3.called, false)
        }
    })

    it ('throw error from promise', async () => {
        const layer = new Layer()
        const spy1 = sinon.spy(function () {
            return Promise.reject(new Error())
        })
        const spy2 = sinon.spy()
        const spy3 = sinon.spy()
        const data = {key: 'value'}

        try {
            layer
                .use(spy1)
                .use(spy2)
                .use(spy3)

            await layer.run(data)

            assert(true)
        }
        catch (err) {
            assert.equal(spy1.calledOnce, true)
            assert.deepEqual(spy1.firstCall.args[0], data)
            assert.equal(spy2.called, false)
            assert.equal(spy3.called, false)
        }
    })
})
