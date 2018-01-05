const Layer = require('./layer')
const hooks = Symbol('hooks')

module.exports = class Hooks {
    constructor () {
        this[hooks] = {}
    }

    get (event) {
        this[hooks] = this[hooks] || {}
        this[hooks][event] = this[hooks][event] || new Layer()
        const hook = this[hooks][event]

        return hook.run.bind(hook)
    }

    add (event, fn) {
        this[hooks] = this[hooks] || {}
        this[hooks][event] = this[hooks][event] || new Layer()

        const hook = this[hooks][event]

        hook.use(fn)

        return this
    }

    async run (event, ...args) {
        const hook = this.get(event)

        return hook.apply(hook, args)
    }

}
