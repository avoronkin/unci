
const assert = require('assert')
const Hooks = require('../src/hooks')


describe('examples', () => {
    it('work', ()=> {
        const hooks = new Hooks()

        const ctrl = {
            async method (data) {
                const [before] = await hooks.run('before', data)
                assert.deepEqual(before, data)
                //main code
            }
        }

        hooks.add('before', data => Promise.resolve(data))
        // eslint-disable-next-line
        hooks.add('before', data => console.log(data))

        ctrl.method({key: 'value'})
    })

    describe('mongoose-killer', () => {
        const Repo = require('../example/repo/Repo')
        const memoryStore = require('../example/repo/plugins/memoryStore')
        function timestamp (event, fieldName) {
            return async ctx => {
                ctx.hooks.add(event, document => {
                    document[fieldName] = new Date()
                })
            }
        }

        it('add document to collection', async () => {

            const repo = new Repo({
                test: {type: 'String'},
                flag: {type: 'Boolean', default: false},
                created: {type: 'Date'},
                updated: {type: 'Date', default: new Date()}
            })

            const collection = []

            repo
                .plugin(timestamp('before:create', 'created'))
                .plugin(memoryStore({pmKey: 'id', collection}))

            assert.equal(collection.length, 0)

            const document = await repo.create({id: 3, test: 'test', flag: 'false'})

            assert.equal(document.flag, false)
            assert.equal(document.id, 3)
            assert.equal(document.created instanceof Date, true)
            assert.equal(document.updated instanceof Date, true)
            assert.equal(collection.length, 1)
        })
    })
})
