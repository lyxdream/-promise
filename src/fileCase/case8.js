//promise.all

// const Promise = require('./../../dist/bundle.js')
// let fs = require('fs').promises; //返回一个promise
let fs = require('fs');

// 自己实现node的promises
//怎么让一个node的api => promise的api
// function promisify(fn){
//     return function(...args){  //等价于read
//         return new Promise((resolve,reject)=>{
//              fn(...args,(err,data)=>{
//                 if(err) reject(err);
//                 resolve(data)
//             })
//         })
//     }
// }
// let read = promisify(fs.readFile);

// read('/Users/yinxia/promise/src/name.txt','utf8').then((data)=>{
//     console.log(data)
// })

// ---------------------------------------------------------

// function promisify(fn){
//     return function(...args){  //等价于read
//         return new Promise((resolve,reject)=>{
//              fn(...args,(err,data)=>{
//                 if(err) reject(err);
//                 resolve(data)
//             })
//         })
//     }
// }
// let read = promisify(fs.readFile);

// //全部成功才算成功，一个失败就失败
// Promise.all([read('/Users/yinxia/promise/src/name1.txt','utf8'),read('/Users/yinxia/promise/src/age.txt','utf8')]).then((data)=>{
//     console.log(data)
// }).catch(err=>{
//     console.log(err)
// })

// ----------------------------------------------


function promisify(fn){
    return function(...args){  //等价于read
        return new Promise((resolve,reject)=>{
             fn(...args,(err,data)=>{
                if(err) reject(err);
                resolve(data)
            })
        })
    }
}
let read = promisify(fs.readFile);
// //判断一个值是不是promise
function isPromise(x){
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        if(typeof x.then =='function'){
            return true;
        }
    }
    return false;
}
//
Promise.all = function(values){
    return new Promise((resolve,reject)=>{
        let arr = [];//收集传入的项运行结果
        let times =0;//调用的次数和传入的参数个数一致的时候，resolve
        function collectResult(val,key){
            arr[key] = val;
            // console.log(key,val)
         //注意这里不能用arr.length计数，因为先成功的会是不是promise的项，这个例子中先成功的是0,0成功之后，arr的length已经为3，就会直接resolve
            // if(arr.length === values.length){
            //     resolve(arr)
            // }
            if(++times === values.length){
                resolve(arr)
            }
        }
        for(let i=0;i<values.length;i++){
            let value = values[i];
            if(value&&isPromise(value)){
                value.then((y)=>{
                    //y是promise返回的值
                    //y i
                    collectResult(y,i)
                },(err)=>{
                    reject(err)
                })
            }else{
                //value i
                collectResult(value,i)
            }
        }
    })
}

//全部成功才算成功，一个失败就失败

Promise.all([read('/Users/yinxia/promise/src/name.txt','utf8'),read('/Users/yinxia/promise/src/age.txt','utf8'),0]).then((data)=>{
    console.log(data)
}).catch(err=>{
    console.log(err)
})


