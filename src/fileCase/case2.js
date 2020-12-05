//promise是支持链式调用的

// 1、无论成功还是失败都可以返回结果
//   （1）出错了：- 只要抛出了错误，不管成功失败都走最后一个错误方法（onRejected方法），
        // - 返回的是一个promise，promise里面调用了reject的情况
//  （2）返回一个普通值（不是promise的值），就会作为下一次then的成功结果
//   (3) 是promise的情况（会采用返回的promise的状态）用promise解析后的结果传递个下一个then

//1、普通值  调用then方法会返回一个全新的promise（不能返回this，因为状态不可逆，所以只能是新的promise）
 

const Promise = require('./../../dist/bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data =>{
//    return new Promise((resolve,reject)=>{
//        resolve(100)
//    })
throw new Error('111')
    // return 100
},err =>{
    throw new Error('222')
    // return 1
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//成功2---1

