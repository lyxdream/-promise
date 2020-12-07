
const Promise = require('./../../dist/bundle.js')

const { resolve } = require("path")

Promise.prototype.finally = function(callback){
    return this.then((data)=>{
        //等待promise执行完毕
        Promise.resolve(callback())
    },(reason)=>{
        Promise.resolve(callback())
    })
}





Promise.resolve('ok').finally(()=>{
    console.log("1")
    //finally返回的结果不会影响后续逻辑
    return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('in')
            },0)
        })  
}).then(data=>{
    console.log('success',data)
}).catch(e=>{
    console.log('error',e)
})

