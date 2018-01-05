```js
const hooks = require('unci')

const ctrl = {
    async test(data){
        await hooks.run('before', data)
        //main code
    }
}

hooks.add('before', data => Promise.resolve(data))
hooks.add('before', data => console.log(data))

ctrl.test({key: 'value'})

```
