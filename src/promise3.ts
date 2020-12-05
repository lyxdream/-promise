
const enum STATUS{  //存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
 class Promise{
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
    then(onFulfilled,onRejected){
        //每次调用then都产生一个全新的promise
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status == STATUS.fulfilled){
                try{
                    //是个常量的时候
                    let x = onFulfilled(this.value);
                    resolve(x)  //用then的返回值，作为下一次成功结果
                }catch(e){
                    // 抛错的时候
                    reject(e)
                }
              
            }
            if(this.status == STATUS.rejected){
                try{
                    let x = onRejected(this.reason)
                    resolve(x)  //用then的返回值，作为下一次成功结果
                }catch(e){
                     // 抛错的时候
                     reject(e)
                }
                
            }
            //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
            if(this.status == STATUS.pending){
                this.onResolvedCallbacks.push(()=>{
                      //可以增加额外的逻辑
                    try{
                        let x =  onFulfilled(this.value)  //订阅模式
                        resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                         // 抛错的时候
                         reject(e)
                    }
                  
                })
                this.onRejectedCallbacks.push(()=>{
                     //可以增加额外的逻辑
                    try{
                        let x = onRejected(this.reason)
                        resolve(x)  //用then的返回值，作为下一次成功结果
                    }catch(e){
                        // 抛错的时候
                        reject(e)
                    }        
                     
                })
            }
        })
        return promise2
    }


 }
 export default Promise