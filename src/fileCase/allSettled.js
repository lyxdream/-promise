// es2020引入

// const Promise = require('./../../dist/bundle.js')
let p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(1)
    },1000)
})

let p2 = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        reject('fail')
    },500)
})

//只有等到所有这些参数实例都返回结果(不管是fulfilled还是rejected)，才会结束

//可以看出，只走then的成功回调函数onFulfilled，不会走onRejected

//[
//     { status: 'fulfilled', value: 1 },
//     { status: 'rejected', reason: 'fail' }
//   ]


function isPromise(x){
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        if(typeof x.then =='function'){
            return true;
        }
    }
    return false;
}
//
Promise.allSettled = function(values){
    return new Promise((resolve,reject)=>{
        let arr = [];//收集传入的项运行结果
        let times =0;//调用的次数和传入的参数个数一致的时候，resolve
        function collectResult(val,key,obj){
            arr[key] = obj;
         //注意这里不能用arr.length计数，因为先成功的会是不是promise的项，这个例子中先成功的是0,0成功之后，arr的length已经为3，就会直接resolve
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
                    let obj = {
                        status:"fulfilled",
                        value:y
                    }
                    // console.log(y)
                    collectResult(y,i,obj)
                },(err)=>{
                    let obj = {
                        status:"rejected",
                        reason:err
                    }
                    collectResult(err,i,obj)
                })
            }else{
                //value i
                let obj = {
                    status:"fulfilled",
                    value:value
                }
                collectResult(value,i,obj)
            }
        }
    })
}

Promise.allSettled([p1,p2]).then((data)=>{
    console.log(data)
},(err)=>{
    console.log(err)
}
)