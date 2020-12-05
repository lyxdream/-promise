// debugger;
// Promise.resolve(1)
//     .then((x) => x+1)
//     .then((x) => {throw new Error('my error')})
//     .catch(() => 2)
//     .then((x) => x+1)
//     .then((x) => console.log(x))
//     .catch(console.error)
//当then返回一个promise时
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('xxx')
        },1000)
    })
},err=>{

})
let promise2 = promise.then(data=>{
    console.log(data)
})