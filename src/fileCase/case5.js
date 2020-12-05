
// const Promise = require('./../../dist/bundle.js')
// let promise = new Promise((resolve,reject)=>{
//     resolve('ok')
// }).then(data=>{
//     return function(){
//         console.log(1)
//     }
// },err=>{

// })
// let promise2 = promise.then(data=>{
//     console.log(data,'dayin')
// })


const Promise = require('./../../dist/bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(100)
                },1000)
            }))
            // resolve('成功----')
            // reject("shib")
        },1000)
    })
},err=>{
    console.log(err)
})
let promise2 = promise.then(data=>{
    console.log(data)
},err=>{
    console.log(err,'======')
})




