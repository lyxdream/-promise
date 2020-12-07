const Promise = require('./../../dist/bundle.js')
// const Promise1 = require('./../../dist/11.js')
// const promise = new Promise((resolve,reject)=>{
//     resolve(new Promise((resolve,reject)=>{  //这里只是自己的promise，不兼容其他
//         setTimeout(()=>{
//             resolve('ok')
//         },0)
//     }))
// })

// promise.then(data=>{
//     console.log(data)
// })

//resolve如果是Promise的时候，因为规范里的规定，只考虑是自己的promise，不用考虑是第三方库的，只有then的时候需要考虑是第三方库的

// -----------------------------------------

// reject如果是Promise
//promise中resolve一个promise会有等待效果
//promise中reject一个值，直接走失败
// const promise = new Promise((resolve,reject)=>{
//     reject(new Promise((resolve,reject)=>{  //这里只是自己的promise，不兼容其他
//         setTimeout(()=>{
//             resolve('ok')
//         },0)
//     }))
// })

// promise.then(data=>{
//     console.log(data)
// }).catch((err)=>{
//     console.log('err',err)
// })
// -----------------------------------------
// function b(){
//     console.log(a)
// }
// let a =2;
// b();
// -----------------------------------------

// Promise.resolve('ok').then(data=>{
//     console.log(data)
// }).catch(e=>{
//     console.log(e)
// })
// -----------------------------------------
Promise.reject('fail').then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e)
})