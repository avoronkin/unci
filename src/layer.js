const cascade = require('./cascade')

module.exports = class Layer {
    constructor (fn) {
        this.fns = []

        if (fn) this.use(fn)
    }

    use (fn) {
        this.fns = this.fns.concat(fn)

        return this
    }

    async run (...args) {
        return cascade(this.fns, this).apply(null, args)
    }
}
