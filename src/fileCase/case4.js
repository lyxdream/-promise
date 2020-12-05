
//当then返回一个promise时,
// 判断x的值 和promise2的关系
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return promise2
},err=>{
    console.log(err)
})
promise2.then(data=>{
    console.log(data)
},err=>{
    console.log(err,'999')
})
// ----------------

//x.then中抛出的异常的结果e，就以e作为promise失败的reason
// const Promise = require('./bundle.js');
// let resultObj = {};
// Object.defineProperty(resultObj,'then',{
//     get(){
//         throw new Error('出错了');
//     }
// })
// let promise2 = new Promise((resolve,reject)=>{
//     resolve('ok')
// }).then(data=>{
//     return resultObj
// },err=>{
//     console.log(err,'')
// })

// promise2.then(data=>{
//     console.log(data)
// },err=>{
//     console.log(err,'999')
// })


///