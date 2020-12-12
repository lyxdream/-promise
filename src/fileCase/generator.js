// 浏览器最早解决异步 回调 =》 promise =》 generator =》 async + await

// Generator
// Generator函数，又称生成器函数
//    原理是：利用Generator函数暂停执行的作用，可以将异步操作的语句写到yield后面，通过执行next方法进行回调。
// - 特点：可以控制函数的执行

/* Generator函数和普通函数区别
- 普通函数用function来声明，Generator函数用function*声明
- Generator函数内部有新的关键字：yield，普通函数没有。

yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。
**Generator函数运行结果：**
*/

/*
function *hello(){
   yield '你好，'
   return '欢迎来到前端成长指引！'
}
let ite = hello()  //iterator 迭代器 迭代器中有next方法
console.log(ite)  //Object [Generator] {}
console.log(ite.next())  //{ value: '你好，', done: false }
console.log(ite.next())  //{ value: '欢迎来到前端成长指引！', done: true }
*/


/*
    函数执行后，返回了一个：[Object [Generator] {}生成器对象，
    第1次调用生成器对象ite的next( )方法，返回了一个对象：{ value: '你好，', done: false }
    第2次调用生成器对象ite的next( )方法，同样返回一个对象{ value: '欢迎来到前端成长指引！', done: true }

    **Generator函数的执行过程：**
    Generator函数被调用后并不会一直执行到最后，它是先回返回一个生成器对象，然后hold住不动，等到生成器对象的next( )方法被调用后，函数才会继续执行，直到遇到关键字yield后，又会停止执行，并返回一个Object对象，然后继续等待，直到next( )再一次被调用的时候，才会继续接着往下执行，直到done的值为true。

    **yield和teturn的区别**
    yield有点像普通函数的return的作用，但不同的是普通函数只能return一次，但是Generator函数可以有很多个yield。
    而return代表的是终止执行，yield代表的是暂停执行，后续通过调用生成器的next( )方法，可以恢复执行。

    **next()方法传递参数**
     -  next()方法还可以接受一个参数，它的参数会作为上一个yield的返回值

     -  第一次next中传递参数是没有意义的
    ```js
        function *hello(){
            let res = yield '你好，'
            console.log(a)  //undefined
        }
        let ite = hello()  //iterator 迭代器 迭代器中有next方法
        console.log(ite.next('hello'))  //{ value: '你好，', done: false }
        console.log(ite.next())  //{ value: undefined, done: true }
    ```

    ```js
     function *hello(){
      let res = yield '你好，'
     console.log(res)  //欢迎来到前端成长指引！
     let b =  yield res
      console.log(b)//undefined
    }
    let ite = hello()  //iterator 迭代器 迭代器中有next方法
    console.log(ite.next())  //{ value: '你好，', done: false }
    console.log(ite.next('欢迎来到前端成长指引！'))  //{ value: '欢迎来到前端成长指引！', done: true }
    console.log(ite.next())//{ value: undefined, done: true }
    ```





    */

   function *hello(){
      let a = yield 1
     let b =  yield 2
      console.log(b)//undefined
    }
    let ite = hello()  //iterator 迭代器 迭代器中有next方法
    let {value,done} = ite.next();
    value = ite.next(value).value;

    console.log(ite.next(value))  
   


