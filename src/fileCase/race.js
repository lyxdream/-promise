

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

//谁先执行完毕就用谁的结果，那个率先改变的 Promise 实例的返回值，就传递那个给p的回调函数。
Promise.race([p1,p2]).then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e)
})

//Promise.race能解决什么问题，不要这个promise的返回结果了，超时，中断

// let abort;
// let promise = new Promise((resolve,reject)=>{
//     abort = reject;
//     setTimeout(()=>{
//         resolve('ok')
//     },3000)
// })

// setTimeout(()=>{
//     abort('超时')
// },2000)

// promise.catch(err=>{
//     console.log(err)
// })

//////////////////////////////////////
Promise.race = function(values){
    // console.log(values)
    function isPromise(x){
        if((typeof x==='object' && x!=null) || typeof x==='function'){
            if(typeof x.then =='function'){
                return true;
            }
        }
        return false;
    }
    return new Promise((resolve,reject)=>{
        for(let i=0;i<values.length;i++){
            let value = values[i];
            if(value&&isPromise(value)){
                value.then((y)=>{
                    //y是promise返回的值
                    //y i
                    resolve(y)
                },(err)=>{
                    reject(err)
                })
            }else{
                resolve(value)
            }
        }
    })
}



// let promise = new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//         // console.log('111111')
//         resolve('ok')
//     },1000)
// })
// function wrap(p){
//     let abort;
//     let p2 = new Promise((resolve,reject)=>{
//        abort = reject;
//     })
//     let p3 = Promise.race([p,p2]);//能控制p的状态，主要是利用p2的reject
//     //谁先执行完毕就采用谁的结果，p3就采用谁的结果，虽然没采用p的结果，但是p还是会执行
//     p3.abort = abort;
//     return p3;
// }

// let p = wrap(promise);
// setTimeout(()=>{
//     p.abort('超时')  //如果超时，就会走p2的reject，则就不会采用wrap(p)的p的结果
// },500)

// p.then((data)=>{
//     console.log(data)
// }).catch(err=>{
//     console.log(err,'fail')
// })