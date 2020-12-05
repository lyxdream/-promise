import { type } from "os";

const enum STATUS{  //存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
//核心的逻辑 解析x的类型，决定promise2走成功还是失败
function resolvePromise(promise2,x,resolve,reject){
    // 判断x的值 和promise2的关系  可能是第三方的promise 可能第三方的promise会出现问题
    // console.log(promise2,x,resolve,reject)
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    // (如果x和promise2指向同一个对象，则抛错)
    if(x==promise2){
        return reject(new TypeError('出错了'))  //下一个then抛出错误
    }
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        //只有x是对象或者函数才可能是promise
        // console.log(x)
        let called = false;//表示没调用过成功和失败
        try{    
            let then = x.then;//取x上的then方法
            if(typeof then =='function'){   //这x.then是当前的then链式的下个接收
                // 如果then是函数，则把x作为this，第一个参数resolvePromise和第二个参数rejectPromise，其中：
                // resolvePromise参数y，rejectPromise参数r，r作为reason
                then.call(x,y=>{
                    if(called) return; //如果已经成功就不能再调失败
                    called = true;
                    //y可能是一个promise,递归解析y,直到y是一个普通值为止
                    resolvePromise(promise2,y,resolve,reject)
                    // resolve(y);//y是x成功返回的结果
                },r=>{
                    if(called) return;
                    called = true;
                    reject(r)
                })
            }else{
                resolve(x);//x是普通函数或者对象
            }
        }catch(e){
            //x.then中抛出的异常的结果e，就以e作为promise失败的reason
            // console.log(e)
            if(called) return;
            called = true;
            reject(e)//走失败逻辑
        }
    }else{
        //如果不是promise则是一个普通值
        resolve(x)
    }
}
 class Promise{
     static deferred;
     status:STATUS;
     value:any;
     reason:any;
     onResolvedCallbacks:Function[];
     onRejectedCallbacks:Function[];
    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void){
        this.status = STATUS.pending; //当前默认状态
        this.value = undefined;//成功原因
        this.reason = undefined;//失败原因
        this.onResolvedCallbacks = [];//成功回调的函数集合
        this.onRejectedCallbacks = [];//失败回调的函数集合
        const resolve = (value?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.fulfilled;
                this.value = value;
                //发布模式
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        }
        const reject = (reason?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.rejected;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn=>fn())
            }    
        }
        try{
            executor(resolve,reject);
        }catch(e){
            reject(e)     
        }
       
    }
    then(onFulfilled?,onRejected?){
        //判断onFulfilled是否传了，如果类型是一个函数，就不做操作，如果不是函数，则返回一个参数为val的函数，val为this.value
        onFulfilled = typeof onFulfilled =='function'?onFulfilled : val=>val;
        onRejected = typeof onRejected =='function'?onRejected : err => { throw err }
        //每次调用then都产生一个全新的promise
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status == STATUS.fulfilled){
                setTimeout(() => {
                    try{
                        //是个常量的时候
                        let x = onFulfilled(this.value); 
                        // console.log(promise2)
                        resolvePromise(promise2,x,resolve,reject)
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                        // 抛错的时候
                        console.log(e)
                        reject(e)
                    } 
                }, 0);
            }
            if(this.status == STATUS.rejected){
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                         // 抛错的时候
                         reject(e)
                    }  
                }, 0);  
            }
            //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
            if(this.status == STATUS.pending){
                this.onResolvedCallbacks.push(()=>{
                      //可以增加额外的逻辑
                      setTimeout(() => {
                        try{
                            let x =  onFulfilled(this.value)  //订阅模式
                            resolvePromise(promise2,x,resolve,reject)
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }catch(e){
                             // 抛错的时候
                             reject(e)
                        }
                      },0)
                   
                  
                })
                this.onRejectedCallbacks.push(()=>{
                     //可以增加额外的逻辑
                     setTimeout(() => {
                        try{
                            let x = onRejected(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }catch(e){
                            // 抛错的时候
                            reject(e)
                        }  
                     })
                         
                     
                })
            }
        })
        return promise2
    }
 }
 //---------测试是否符合Promise/A+规范
Promise.deferred = function () {
    let dfd = {} as any;
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
 export default Promise