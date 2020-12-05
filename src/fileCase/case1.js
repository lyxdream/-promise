
//1、promise 可以解决多个异步执行，最终得到所有结果
//2、异步嵌套问题 
//1、每个promise 都有三个状态 pending等待状态 resolve 标识变成成功状态(fulfiled) reject标识变成失败态（rejected)
//2、每个promise 需要一个then方法，传入两个参数，一个是成功的回调另一个是失败的回调 promise.then(onFulfilled, onRejected)
//3、new promise会立即执行 
//4、一旦状态改变就不能改变，一旦失败就不能成功，一旦成功就不能失败
//5、当promise抛出异常后 也会走失败状态

// 一个 Promise 必然处于以下几种状态之一：
// 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
// 已兑现（fulfilled）: 意味着操作成功完成。
// 已拒绝（rejected）: 意味着操作失败。



const Promise = require('./../../dist/bundle.js')
let promise = new Promise((resolve,reject)=>{
    // console.log(1)
    // reject('失败')
    // throw new Error('失败');
    resolve('ok');
    // setTimeout(()=>{
    //     resolve('成功')
    // },1000)
})
// console.log(2)
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
