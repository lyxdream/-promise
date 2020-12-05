const Promise = require('./../../dist/bundle.js')
let fs = require('fs');

// 1、
// function read(url){
//    return new Promise((resolve,reject)=>{
//        fs.readFile(url,'utf8',function(err,data){
//            if(err) reject(err);
//            resolve(data)
//        })
//    }) 
// }

// read('/Users/yinxia/promise/src/name.txt').then((data=>{
//     return read('/Users/yinxia/promise/src/'+data)
// })).then(data=>{
//     console.log(data)
// })
// --------------------------------

// 2、deferred 
// Promise.deferred = function () {
//     let dfd = {} as any;
//     dfd.promise = new Promise((resolve,reject)=>{
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     })
//     return dfd;
// }
// function read(url){
//     let dfd = Promise.deferred();//延迟对象
//     fs.readFile(url,'utf8',function(err,data){
//         if(err) dfd.reject(err);
//         dfd.resolve(data)
//     })
//    return dfd.promise;
//  }
 
//  read('/Users/yinxia/promise/src/name.txt').then((data=>{
//      return read('/Users/yinxia/promise/src/'+data)
//  })).then(data=>{
//      console.log(data)
//  })

// ----------------------------------------------

// 3、catch
function read(url){
    let dfd = Promise.deferred();//延迟对象
    fs.readFile(url,'utf8',function(err,data){
        if(err) dfd.reject(err);
        dfd.resolve(data)
    })
   return dfd.promise;
 }
 
 read('/Users/yinxia/promise/src/name.txt').then((data=>{
     return read('/Users/yinxia/promise/src/'+data+1)
 })).then(data=>{
     console.log(data)
 }).catch(err=>{
     console.log(err,'失败')
 }).then(data=>{
     console.log(data)
 })