module.exports = (repo) => {
    repo.hooks.add('before:create', defaults.bind(null, repo.schema))
}

function defaults (schema, obj) {
    Object.keys(schema).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(schema[key], 'default') && obj[key] === undefined) {
            obj[key] = (typeof schema[key].default === 'function') ? schema[key].default() : schema[key].default
        }
    })
}
