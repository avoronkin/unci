'use strict'

const cascade = require('./cascade')

module.exports = class Layer {
    constructor () {
        this.fns = []
    }

    use (fn) {
        this.fns = this.fns.concat(fn)

        return this
    }

    async run (...args) {
        return cascade(this.fns, this).apply(null, args)
    }
}
