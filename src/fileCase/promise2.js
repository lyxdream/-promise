
// const Promise = require('./../../dist/bundle.js')

// Promise.resolve('ok').finally(()=>{
//     console.log("1")
//     return 100//finally返回的结果不会影响后续逻辑
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })
//1
//success ok

// --------------------------------------
// Promise.resolve('ok').finally(()=>{
//     console.log("1")
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             resolve('in')
//         },0)
//     })
//     //finally返回的结果不会影响后续逻辑
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })
//1
//success ok

//可以看出没有采用 resolve('in')这个结果

// -------------------reject的情况------------------------------
// （1）
// Promise.resolve('ok').finally(()=>{
//     console.log("1")
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             reject('in')
//         },0)
//     })
//     //finally返回的结果不会影响后续逻辑
// }).then(data=>{
//     console.log('success',data)
// }).catch(e=>{
//     console.log('error',e)
// })
//1
// error in

//可以看出采用 reject('in')这个结果

// （2）
Promise.reject('ok').finally(()=>{
    console.log("1")
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            reject('in')
        },0)
    })
    //finally返回的结果不会影响后续逻辑
}).then(data=>{
    console.log('success',data)
}).catch(e=>{
    console.log('error',e)
})
//1
// error in

//可以看出采用 reject('in')这个结果


// ----------------finally无论成功失败都要走某些逻辑