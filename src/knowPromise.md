
### 了解promise

#### promise的作用：
1、promise 可以解决多个异步执行，最终得到所有结果

2、异步嵌套问题 

#### promise的特点：

1、每个promise 都有三个状态 

待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。

已兑现（fulfilled）: 意味着操作成功完成。

已拒绝（rejected）: 意味着操作失败。

2、一旦状态改变，就不会再变，从pending变为fulfilled和从pending变为rejected。

3、Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。

> resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”

```js
let promise = new Promise((resolve,reject)=>{
    resolve('ok');
    reject('失败')
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
//success ok
```

```js
let promise = new Promise((resolve,reject)=>{
    reject('失败')
    resolve('ok');
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
//failed 失败
```
执行了resolve就不会执行reject，执行了reject就不会执行resolve

4、new promise会立即执行 
```js
let promise = new Promise((resolve,reject)=>{
    console.log(1)
})
console.log(2)
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
//1 2
```
5、每个promise实例生成以后，需要一个then方法，传入两个参数，一个是成功的回调另一个是失败的回调 promise.then(onFulfilled, onRejected)，分别指定resolved状态和rejected状态的回调函数
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
5、当promise抛出异常后 也会走失败状态
```js
let promise = new Promise((resolve,reject)=>{
    throw new Error('失败');
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
//failed Error: 失败
```
6、promise是支持链式调用的

调用then方法会产生一个全新的promise（不能返回this，因为状态不可逆，所以只能是新的promise）

- 无论成功还是失败都可以返回结果

  >（1）走onRejecte的情况：只要抛出了错误，都走then的错误方法（onRejected方法）
  
  >（2）返回一个普通值（不是promise的值），就会作为下一次then的成功结果

  > (3) 是promise的情况（会采用返回的promise的状态）用promise解析后的值传递个下一个then

  - 1、普通值  
    当then返回的是一个普通值,则走下一个then成功的方法
  - 2、抛出错误

    当then中抛出一个错误时，则不管此时那种状态，下个then都会走失败
  - 3、返回一个promise


 > 注意onRejecte的情况：
  - 只要抛出了错误，不管成功失败都走下一个then一个错误方法（onRejected方法）
  - 返回的是一个promise，promise里面调用了reject的情况   



    (1)例子：
 ```js
        let promise = new Promise((resolve,reject)=>{
            resolve('ok')
        }).then(data =>{
            throw new Error('xxx')
            console.log('成功1'+data)
        },err =>{
            console.log('失败了1'+err)
        })
        promise.then(data=>{
            console.log('成功2'+data)
        },err=>{
            console.log('失败了2----'+err)  //走了这个
        })
        //失败了2----Error: xxx
```
    （2）
      
```js
        let promise = new Promise((resolve,reject)=>{
            resolve('ok')
        }).then(data =>{
            return 1;
        },err =>{
            console.log('失败了1'+err)
        })
        promise.then(data=>{
            console.log('成功2---'+data)  //走了这个
        },err=>{
            console.log('失败了2----'+err)
        })
        //成功2---1
```
```js
let promise = new Promise((resolve,reject)=>{
    reject('fail')
}).then(data =>{
    return 1;
},err =>{
    console.log('失败了1--'+err)
    // 没有返回值 则默认返回undefined，下一个then走成功函数
})
promise.then(data=>{
    console.log('成功2---'+data) //走了这个
},err=>{
    console.log('失败了2----'+err)
})
//失败了1--fail
// 成功2---undefined
```
（3）
```js
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data =>{
   return new Promise((resolve,reject)=>{
       reject(100)
   })
},err =>{
    console.log('失败了1'+err)
})
promise.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//失败了2----100
```
```js
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data =>{
   return new Promise((resolve,reject)=>{
       resolve(100)
   })
},err =>{
    console.log('失败了1'+err)
    // 没有返回值 则默认返回undefined，下一个then走成功函数
})
promise.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//成功2---100
```
（4）调用then方法会返回一个全新的promise
```js
let promise2 = new Promise((resolve,reject)=>{
    throw new Error('xxx')
}).then(data =>{
   return new Promise((resolve,reject)=>{
       resolve(100)
   })
},err =>{
    return 1
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//成功2---1
```


#### promise缺点：

首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。

其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。

第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。





------------------------华丽的分割线-------------------



### 手写promise

promise构造函数的理解：

1、构造函数有个状态属性，有三种状态
```js
const enum STATUS{  //存放所需要的状态
    pending = 'PENDING',
    fulfilled = 'FULFILLED',
    rejected = 'REJECTED'
}
```

2、构造函数自己有resolve和reject两个方法
有 value和reason两个属性，分别表示成功原因和失败原因，传给回调函数then
```js
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
```

3、关于promise.then的理解：

>  onFulfilled 是Promise.then传入的第一个参数

>  onRejected是Promise.then传入的第二个参数

执行关于promise.then的时候根据status的变化，判断执行那个函数

如果状态是成功就执行onFulfilled函数，同时把resolve的value值传给onFulfilled函数

如果是失败就执行onejected函数，同时把reject的value值传给onRejected函数

```js
 then(onFulfilled,onRejected){
        if(this.status == STATUS.fulfilled){
            onFulfilled(this.value)
        }
        if(this.status == STATUS.rejected){
            onRejected(this.reason)
        }
  }
```
完整一点点的代码段

```js
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
                this.reason = reason;
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

```

调用自己手写的promise结果如下：

```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok');
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
// success ok
```
4、上面的情况在普通情况下显示正常，但是如果new Promise里面是一个延时器就会出现问题

如下：
```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('1')
    },1000)
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
```

会发现没打印出任何东西，因为promise的状态还没发生改变时，已经走了then,然后then里面没有对pending的状态做处理，所以没有任何反应。

解决办法：then方法里面获取当前的状态，如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用

代码如下：
```js

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
    constructor(executor){
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
        if(this.status == STATUS.fulfilled){
            onFulfilled(this.value)
        }
        if(this.status == STATUS.rejected){
            onRejected(this.reason)
        }
        //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
        if(this.status == STATUS.pending){
            this.onResolvedCallbacks.push(()=>{
                //可以增加额外的逻辑
                onFulfilled(this.value)  //订阅模式
            })
            this.onRejectedCallbacks.push(()=>{
                 //可以增加额外的逻辑
                 onRejected(this.reason)
            })
        }
    }
 }
 export default Promise
```
调用手写的promise，效果如下：
```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('成功')
    },1000)
})
promise.then((data)=>{
    console.log('success',data)
},(err)=>{
    console.log('failed',err)
})
//success 成功
```
5、链式调用

 调用then方法会产生一个全新的promise（不能返回this，因为状态不可逆，所以只能是新的promise）

1、普通值  
- 当then返回的是一个普通值,则走下一个then成功的方法

手写promise，
由于调用then方法会产生一个全新的promise，则假设then里面会产生一个全新的promise2，实现原理如下：
then方法里面获取当前的状态，不管是那种状态，当返回一个常量的时候都会走成功，把then的返回值，作为下一次成功结果，resolve出去

```js
    then(onFulfilled,onRejected){
        //每次调用then都产生一个全新的promise
        let promise2 = new Promise((resolve,reject)=>{
            if(this.status == STATUS.fulfilled){
                let x = onFulfilled(this.value);
                resolve(x)  //用then的返回值，作为下一次成功结果
            }
            if(this.status == STATUS.rejected){
                let x = onRejected(this.reason)
                resolve(x)  //用then的返回值，作为下一次成功结果
            }
            //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
            if(this.status == STATUS.pending){
                this.onResolvedCallbacks.push(()=>{
                    //可以增加额外的逻辑
                    let x =  onFulfilled(this.value)  //订阅模式
                    resolve(x)  //用then的返回值，作为下一次成功结果
                })
                this.onRejectedCallbacks.push(()=>{
                     //可以增加额外的逻辑
                     let x = onRejected(this.reason)
                     resolve(x)  //用then的返回值，作为下一次成功结果
                })
            }
        })
        return promise2
    }
```


```js
（1）
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    reject('ok')
}).then(data =>{
    return 100
},err =>{
    return 1
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//成功2---1
（2）
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data =>{
    return 100
},err =>{
    return 1
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//成功2---100

```
2、当then中抛出一个错误时，则不管此时那种状态，下个then都会走失败

实现原理如下：
在新返回的promise2里面，做一个try..catch的处理，使成功的时候走resolve,抛错的时候走reject

```js
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
```

显示结果：

```js
(1)
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data =>{
throw new Error('111')
},err =>{
    throw new Error('222')
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//失败了2----Error: 111
(2)
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    reject('ok')
}).then(data =>{
throw new Error('111')
},err =>{
    throw new Error('222')
})
promise2.then(data=>{
    console.log('成功2---'+data)
},err=>{
    console.log('失败了2----'+err)
})
//失败了2----Error: 222
```
3、当then返回一个promise时
(1)
例子
```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('xxx')
        },1000)
    })
},err=>{

})
let promise2 = promise.then(data=>{
    console.log(data)
})
```
```js
// 打印的结果
Promise {
  status: 'PENDING',
  value: undefined,
  reason: undefined,
  onResolvedCallbacks: [ [Function] ],
  onRejectedCallbacks: [ [Function] ]
} Promise {
  status: 'PENDING',
  value: undefined,
  reason: undefined,
  onResolvedCallbacks: [],
  onRejectedCallbacks: []
} [Function: resolve] [Function: reject]
```
 核心手写代码

```js
//核心的逻辑 解析x的类型，决定promise2走成功还是失败
function resolvePromise(promise2,x,resolve,reject){
    console.log(promise2,x,resolve,reject)
      // 判断x的值 决定promise2的关系  来判断可能x是别人的promise 可能别人的promise会出现问题
}

 then(onFulfilled,onRejected){
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
```
(2)判断x的值 和promise2的关系
   -  如果x和promise2指向同一个对象，则抛错（If promise and x refer to the same object, reject promise with a TypeError as the reason.）
```js
//核心的逻辑 解析x的类型，决定promise2走成功还是失败
function resolvePromise(promise2,x,resolve,reject){
    // (如果x和promise2指向同一个对象，则抛错)
    if(x==promise2){
        return reject(new TypeError('出错了'))
    }
}
```
使用
```js
const Promise = require('./bundle.js')
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return promise2
},err=>{

})
promise2.then(data=>{
    console.log(data)
},err=>{
    console.log(err,'999')
})

//TypeError: 出错了
```

- 如果x是一个promise，则x可能是对象或者函数，否则x是一个普通值
  （是普通值就直接resolve,如果是函数或者对象，就获取x上面的then方法，或者x.then为undefined),则x为普通对象或者函数，就直接resolve，如果x上面的then存在，则以x作为this,第一个参数resolvePromise和第二个参数rejectPromise，其中：resolvePromise参数y，rejectPromise参数r，r作为reason
- x.then中抛出的异常的结果e，就以e作为promise失败的reason
- y可能是一个promise,递归解析y,直到y是一个普通值为止
- y可能是第三方的promise 可能第三方的promise会出现问题（执行了成功就不让其执行失败，执行了失败就不让执行成功）
- onFulfilled和onRejected是可选参数，需要做兼容处理
（ 判断onFulfilled是否传了，如果类型是一个函数，就不做操作，如果不是函数，则返回一个参数为val的函数，val为this.value
```js
    onFulfilled = typeof onFulfilled =='function'?onFulfilled : val=>val;
    onRejected = typeof onRejected =='function'?onRejected:err=>{throw err}）
```

 ```js
//  1、x.then中抛出的异常的结果e，就以e作为promise失败的reason
const Promise = require('./bundle.js');
let resultObj = {};
Object.defineProperty(resultObj,'then',{
    get(){
        throw new Error('出错了');
    }
})
let promise2 = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return resultObj
},err=>{
    console.log(err,'')
})

promise2.then(data=>{
    console.log(data)
},err=>{
    console.log(err,'999')
})
// 2、当x.then是一个普通函数的时候
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return function(){
        console.log(1)
    }
},err=>{

})
let promise2 = promise.then(data=>{
    console.log(data,'dayin')
})
//[Function] dayin
// 3、当x是一个promise的时候
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('成功----')
        },1000)
    })
},err=>{

})
let promise2 = promise.then(data=>{
    console.log(data)
})
//成功----
 ```
手写实现

```js
//核心的逻辑 解析x的类型，决定promise2走成功还是失败
// x就是then的返回值
function resolvePromise(promise2,x,resolve,reject){
    // 判断x的值 和promise2的关系  来判断可能x是第三方的promise 可能第三方的promise会出现问题
    // (如果x和promise2指向同一个对象，则抛错)
    if(x==promise2){
        return reject(new TypeError('出错了'))
    }
    if((typeof x==='object' && x!=null) || typeof x==='function'){
        //只有x是对象或者函数才可能是promise
        // console.log(x)
        try{    
            let then = x.then;//取x上的then方法
            console.log(then)
             if(typeof then =='function'){   //这x.then是当前的then链式的下个接收
                then.call(x,y=>{
                    resolve(y);//y是x成功返回的结果
                },r=>{
                    reject(r)
                })
            }else{
                resolve(x);//x是普通函数或者对象
            }
        }catch(e){
            //x.then中抛出的异常的结果e，就以e作为promise失败的reason
            reject(e)//走失败逻辑
        }
    }else{
        //如果不是promise则是一个普通值
        resolve(x)
    }
}
```
4、如果y也是一个promise的时候，如果还是像上面那样解析就会直接放回如下：

```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok');
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            //下面的resolve就是指的y
            resolve(new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(100)
                },1000)
            }))
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
```

```js
Promise {
  status: 'PENDING',
  value: undefined,
  reason: undefined,
  onResolvedCallbacks: [],
  onRejectedCallbacks: []
}
```
但是如果改成这样递归调用resolvePromise，则返回正常的100
```js
 then.call(x,y=>{
    //y可能是一个promise,递归解析y,直到y是一个普通值为止
    resolvePromise(promise2,y,resolve,reject)
    // resolve(y);//y是x成功返回的结果
},r=>{
    reject(r)
})
```
如果rejectPromise被调用，则reject(r)
```js
const Promise = require('./bundle.js')
let promise = new Promise((resolve,reject)=>{
    resolve('ok')
}).then(data=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            reject(new Promise((resolve,reject)=>{
                setTimeout(()=>{
                     console.log('失败了-----')
                    resolve(100)
                },1000)
            }))
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
//运行结果如下：
Promise {
  status: 'PENDING',
  value: undefined,
  reason: undefined,
  onResolvedCallbacks: [],
  onRejectedCallbacks: []
} ======
失败了-----
```
y可能是第三方的promise 可能第三方的promise会出现问题（执行了成功就不让其执行失败，执行了失败就不让执行成功）
```js
 if((typeof x==='object' && x!=null) || typeof x==='function'){
        let called = false;//表示没调用过成功和失败
        try{    
            let then = x.then;
            if(typeof then =='function'){   
            
                then.call(x,y=>{
                    if(called) return; //如果已经成功就不能再调失败
                    called = true;
                    resolvePromise(promise2,y,resolve,reject)
                },r=>{
                    if(called) return; //如果已经失败就不能再调成功
                    called = true;
                    reject(r)
                })
            }else{
                resolve(x);
            }
        }catch(e){
            if(called) return;//如果已经失败就不能再调成功
            called = true;
            reject(e)
        }
    }
```
如果没传onFulfilled或者onRejected的，则做兼容处理

```js
// 核心代码
 then(onFulfilled?,onRejected?){
        //判断onFulfilled是否传了，如果类型是一个函数，就不做操作，如果不是函数，则返回一个参数为val的函数，val为this.value
        onFulfilled = typeof onFulfilled =='function'?onFulfilled : val=>val;
        onRejected = typeof onRejected =='function'?onRejected:err=>{throw err}
        //......
 }

```

例子
```js
//穿透
const Promise = require('./bundle.js')
let p = new Promise((resolve,reject)=>{
    resolve('ok')
})

p.then().then().then((data)=>{
     console.log(data)
})
```

#### promises-aplus-tests (测试promise是否符合Promises/A+规范)

安装
```bash
npm install promises-aplus-tests -g
```
测试：
promises-aplus-tests bundle.js


















