//promise.all

const Promise = require('./../../dist/bundle.js')
let fs = require('fs');

// 1、
function read(url){
   return new Promise((resolve,reject)=>{
       fs.readFile(url,'utf8',function(err,data){
           if(err) reject(err);
           resolve(data)
       })
   }) 
}