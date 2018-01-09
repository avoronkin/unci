const IRepo = require('./IRepo')
const cast = require('./plugins/cast')
const defaults = require('./plugins/defaults')

module.exports = class Repo extends IRepo {
    constructor (schema = {}, options = {}) {
        super(schema, options)

        this
            .plugin(cast)
            .plugin(defaults)
    }
}
