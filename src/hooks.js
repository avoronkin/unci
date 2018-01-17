const Layer = require('./layer')
const hooks = Symbol('hooks')

module.exports = class Hooks {
    constructor () {
        this[hooks] = {}
    }

    _getHook (event) {
        this[hooks] = this[hooks] || {}
        this[hooks][event] = this[hooks][event] || new Layer()

        return this[hooks][event]
    }

    add (event, fn) {
        const hook = this._getHook(event)

        hook.use(fn)

        return this
    }

    async run (event, ...args) {
        const hook = this._getHook(event)

        return hook.run.apply(hook, args)
    }

}
