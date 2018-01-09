```js
const Hooks = require('unci')

const hooks = new Hooks()

const ctrl = {
    async method(data){
        data = await hooks.run('before', data)
        //main code
    }
}

hooks.add('before', data => Promise.resolve(data))
hooks.add('before', data => console.log(data))

ctrl.method({key: 'value'})

```
