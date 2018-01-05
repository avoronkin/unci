const wrap = require('wrap-fn')

module.exports = class Layer {
    constructor (fn) {
        this.fns = []

        if (fn) this.use(fn)
    }

    use (fn) {
        if(!Array.isArray(fn)) {
            fn = [fn]
        }

        fn.forEach(f => this.fns.push(f))

        return this
    }


    async run (...args) {

        return new Promise ((resolve, reject) => {
            let i = 0
            const fns = this.fns
            const ctx = this

            let __args = args

            function next (err, ..._args) {
                if (err) return reject(err)

                const fn = fns[i++]

                __args = (_args && _args.filter(n => n).length) ? _args : __args

                if (!fn) return resolve.call(ctx, __args)

                wrap(fn, next).apply(ctx, __args)
            }

            next.apply(null, [null].concat(__args))
        })
    }
}
