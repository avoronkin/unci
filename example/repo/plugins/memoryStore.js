module.exports = ({pmKey = 'id', collection = []}) => (repo) => {

    repo.hooks.add('create', create({collection, pmKey}))
}

function create ({collection, pmKey}) {
    return async attrs => {
        attrs[pmKey] = attrs[pmKey] || collection.length + 1

        collection.push(attrs)
    }
}
