// 相关面试题
/* 
1、怎么让一个node的api => promise的api
  自己实现node的promises
*/
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
read('./name.txt','utf8').then((data)=>{
    console.log(data)
})

//2、判断一个值是不是promise
function isPromise(){
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        let then = x.then;//取x上的then方法
        if(typeof then =='function'){
            return true;
        }
    }
    return false;
}

