const wrap = require('./wrap')

module.exports = function (fns, ctx) {
    return function (...args) {
        return new Promise ((resolve, reject) => {
            let i = 0

            function next (err, ..._args) {
                if (err) return reject(err)

                args = (_args && _args.filter(n => n).length) ? _args : args

                const fn = fns[i++]

                if (!fn) return resolve.call(ctx, args)

                wrap(fn).apply(ctx, args.concat(next))
            }

            next.apply(null, [null].concat(args))
        })
    }
}
