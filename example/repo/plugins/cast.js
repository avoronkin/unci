const cast = {
    boolean (value) {
        if (value === undefined || value === '' || value === null) return null

        const falsey = [ false, 0, '0', 'false', 'off', 'no' ]

        return falsey.indexOf(value) === -1
    }
}

module.exports = repo => {
    const schema = repo.schema

    repo.hooks.add('before:create', obj => {
        Object.keys(obj).forEach(key => {
            const type = (schema[key] && schema[key].type.toLowerCase())

            if(cast[type]) {
                obj[key] = cast[type](obj[key])
            }
        })
    })
}
