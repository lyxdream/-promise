
const Promise = require('./../../dist/bundle.js')

const { resolve } = require("path")

Promise.prototype.finally = function(callback){
    return this.then((data)=>{
        //等待promise执行完毕 // 等待callback执行完毕之后
        // console.log(Promise.resolve(callback()))
       return Promise.resolve(callback()).then(()=>data);
    },(err)=>{
        console.log(Promise.resolve(callback()).then(()=>{console.log(err)}))
        return Promise.resolve(callback()).then(()=>{throw err})
    })
}

//finally 本身就是一个then，有个参数callback，通过then的状态判断当前是成功还是失败，
// 如下例子：romise.resolve('ok').finally()的时候，
// (1)如果callback走成功
// Promise.resolve('ok').finally(()=>{
//     // console.log("1")
//     //finally返回的结果不会影响后续逻辑
//     return new Promise((resolve,reject)=>{
//             setTimeout(()=>{
//                 resolve('in')
//             },0)
//         })  
//     // return 1
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })
//  success ok




// (1)如果callback走失败
// Promise.resolve('ok').finally(()=>{
//     // console.log("1")
//     //finally返回的结果不会影响后续逻辑
//     return new Promise((resolve,reject)=>{
//             setTimeout(()=>{
//                 reject('in')
//             },0)
//         })  
//     // return 1
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })
//error in

// 在成功的onFulfilled里，等待callback执行完毕，如果callback里面return 一个普通值，或者return一个成功状态的promise，则不采用，
// 源码中写：then(()=>data),这样就会返回前面的'ok',然后传给下个then接收，但是如果写为then((data)=>data),就会返回in,就采用了callback里面return出来的值，所以后者是不合理的
//如果如果callback里面抛出错误，则then(()=>data)只传了then一个回调函数（onFulfilled），并没有失败的回调函数，（如果有失败的回调函数，则会在这块捕获错误，）所以会被下个catch接收


// 如果走失败，如下例子：romise.reject('ok').finally()的时候，


// (1)如果如果callback里面抛出错误，则then(()=>data)只传了then一个回调函数（onFulfilled），并没有失败的回调函数，（如果有失败的回调函数，则会在这块捕获错误，）所以会被下个catch接收
// Promise.reject('ok').finally(()=>{
//     // console.log("1")
//     //finally返回的结果不会影响后续逻辑
//     return new Promise((resolve,reject)=>{
//             setTimeout(()=>{
//                 reject('in')
//             },0)
//         })  
//     // return 1
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })

//error in

// (2)如果callback里面return 一个普通值，或者return一个成功状态的promise，则不采用，则then(()=>throw err)抛出reason给下个catch
// Promise.reject('ok').finally(()=>{
//     // console.log("1")
//     //finally返回的结果不会影响后续逻辑
//     return new Promise((resolve,reject)=>{
//             setTimeout(()=>{
//                 resolve('in')
//             },0)
//         })  
//     // return 1
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })

//error ok

// 总结：（1）如果callback里面抛出错误，则then(()=>xxx)只传了then一个回调函数（onFulfilled），并没有失败的回调函数，（如果有失败的回调函数，则会在这块捕获错误，）所以会被下个catch接收
//       (2)如果callback里面return 一个普通值，或者return一个成功状态的promise，则走then(()=>throw err)抛出reason给下个catch,或者走then(()=>data),这样就会返回前面的'ok'




Promise.reject('ok').finally(()=>{
    // console.log("1")
    //finally返回的结果不会影响后续逻辑
    return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('in')
            },0)
        })  
    // return 1
}).then(data=>{
    console.log('success',data)
}).catch(e=>{
    console.log('error',e)
})

