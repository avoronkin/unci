module.exports = (repo) => {
    repo.hooks.add('before:create', defaults.bind(null, repo.schema))
}

function defaults (schema, obj) {
    Object.keys(schema).forEach(key => {
        if (schema[key].hasOwnProperty('default') && obj[key] === undefined) {
            obj[key] = (typeof schema[key].default === 'function') ? schema[key].default() : schema[key].default
        }
    })
}
