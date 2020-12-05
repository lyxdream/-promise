//1、promise 可以解决多个异步执行，最终得到所有结果
//2、异步嵌套问题 
//1、每个promise 都有三个状态 pending等待状态 resolve 标识变成成功状态(fulfiled) reject标识变成失败态（rejected)
//2、每个promise 需要一个then方法，传入两个参数，一个是成功的回调另一个是失败的回调 promise.then(onFulfilled, onRejected)
//3、new promise会立即执行 
//4、一旦状态改变就不能再改变，一旦失败就不能成功，一旦成功就不能失败
//5、当promise抛出异常后 也会走失败状态

// 一个 Promise 必然处于以下几种状态之一：
// 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
// 已兑现（fulfilled）: 意味着操作成功完成。
// 已拒绝（rejected）: 意味着操作失败。


//执行.then的时候根据tatus的变化，判断执行那个函数，
// 如果状态是成功就执行onFulfilled函数，同时把resolve的value值传给onFulfilled函数，如果是失败就执行onRejected函数，同时把reject的value值传给onRejected函数
//onFulfilled 是Promise.then传入的第一个参数
//onRejected是Promise.then传入的第二个参数

const enum STATUS{  //存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
 class Promise{
     status:STATUS;
     value:any;
     reason:any;
    constructor(executor){
        this.status = STATUS.pending; //当前默认状态
        this.value = undefined;//成功原因
        this.reason = undefined;//失败原因
        const resolve = (value?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.fulfilled;
                this.value = value;
            }
        }
        const reject = (reason?:any)=>{
            if(this.status==STATUS.pending){
                this.status = STATUS.rejected;
                this.value = reason;
            }    
        }
        try{
            executor(resolve,reject);
        }catch(e){
            reject(e)     
        }
       
    }
    then(onFulfilled,onRejected){
        if(this.status == STATUS.fulfilled){
            onFulfilled(this.value)
        }
        if(this.status == STATUS.rejected){
            onRejected(this.reason)
        }
    }



 }
 export default Promise