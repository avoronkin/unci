const Hooks = require('../../src/hooks')

module.exports = class IRepo {
    constructor (schema = {}, options = {}) {
        this.schema = schema
        this.options = options

        this.hooks = new Hooks()
    }

    plugin (fn) {
        if (!Array.isArray(fn)) fn = [fn]

        fn.forEach(f => f(this))

        return this
    }

    async create (document) {
        const [beforeResult] = await this.hooks.run('before:create', document)
        const [mainResult] = await this.hooks.run('create', beforeResult)
        const [afterResult] = await this.hooks.run('after:create', mainResult)

        return afterResult
    }
}
