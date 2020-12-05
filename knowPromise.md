
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



