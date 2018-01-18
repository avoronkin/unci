module.exports = function (fn) {
    return async function (...args) {
        const ctx = this
        const last = args[args.length - 1]
        const done = typeof last == 'function' ? args.pop() : function () {}

        try {

            if (!fn) {
                return done.apply(ctx, [null, ...args])
            }

            if (fn.length > args.length) {
                return fn.apply(ctx, [...args, done])
            }

            const ret = await fn.apply(ctx, args)

            ret instanceof Error ? done(ret) : done(null, ret)
        }

        catch (err) {
            done(err)
        }
    }
}
