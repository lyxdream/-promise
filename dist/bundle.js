'use strict';

//核心的逻辑 解析x的类型，决定promise2走成功还是失败
function resolvePromise(promise2, x, resolve, reject) {
    // 判断x的值 和promise2的关系  可能是第三方的promise 可能第三方的promise会出现问题
    // console.log(promise2,x,resolve,reject)
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    // (如果x和promise2指向同一个对象，则抛错)
    if (x == promise2) {
        return reject(new TypeError('出错了')); //下一个then抛出错误
    }
    if ((typeof x === 'object' && x != null) || typeof x === 'function') {
        //只有x是对象或者函数才可能是promise
        // console.log(x)
        var called_1 = false; //表示没调用过成功和失败
        try {
            var then = x.then; //取x上的then方法
            if (typeof then == 'function') { //这x.then是当前的then链式的下个接收
                // 如果then是函数，则把x作为this，第一个参数resolvePromise和第二个参数rejectPromise，其中：
                // resolvePromise参数y，rejectPromise参数r，r作为reason
                then.call(x, function (y) {
                    if (called_1)
                        return; //如果已经成功就不能再调失败
                    called_1 = true;
                    //y可能是一个promise,递归解析y,直到y是一个普通值为止
                    resolvePromise(promise2, y, resolve, reject);
                    // resolve(y);//y是x成功返回的结果
                }, function (r) {
                    if (called_1)
                        return;
                    called_1 = true;
                    reject(r);
                });
            }
            else {
                resolve(x); //x是普通函数或者对象
            }
        }
        catch (e) {
            //x.then中抛出的异常的结果e，就以e作为promise失败的reason
            // console.log(e)
            if (called_1)
                return;
            called_1 = true;
            reject(e); //走失败逻辑
        }
    }
    else {
        //如果不是promise则是一个普通值
        resolve(x);
    }
}
var Promise = /** @class */ (function () {
    function Promise(executor) {
        var _this = this;
        this.status = "PENDING" /* pending */; //当前默认状态
        this.value = undefined; //成功原因
        this.reason = undefined; //失败原因
        this.onResolvedCallbacks = []; //成功回调的函数集合
        this.onRejectedCallbacks = []; //失败回调的函数集合
        var resolve = function (value) {
            if (_this.status == "PENDING" /* pending */) {
                _this.status = "FULFILLED" /* fulfilled */;
                _this.value = value;
                //发布模式
                _this.onResolvedCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        var reject = function (reason) {
            if (_this.status == "PENDING" /* pending */) {
                _this.status = "REJECTED" /* rejected */;
                _this.reason = reason;
                _this.onRejectedCallbacks.forEach(function (fn) { return fn(); });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (e) {
            reject(e);
        }
    }
    Promise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        //判断onFulfilled是否传了，如果类型是一个函数，就不做操作，如果不是函数，则返回一个参数为val的函数，val为this.value
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : function (val) { return val; };
        onRejected = typeof onRejected == 'function' ? onRejected : function (err) { throw err; };
        //每次调用then都产生一个全新的promise
        var promise2 = new Promise(function (resolve, reject) {
            if (_this.status == "FULFILLED" /* fulfilled */) {
                setTimeout(function () {
                    //添加setTimeout是为了模拟微任务，在调用的那一轮事件循环之后的新执行栈中执行resolvePromise(promise2,x,resolve,reject)，
                    //如果不加setTimeout则获取不到promise2
                    try {
                        //是个普通值的时候
                        var x = onFulfilled(_this.value);
                        // console.log(promise2)  
                        resolvePromise(promise2, x, resolve, reject);
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }
                    catch (e) {
                        // 抛错的时候
                        console.log(e);
                        reject(e);
                    }
                }, 0);
            }
            if (_this.status == "REJECTED" /* rejected */) {
                setTimeout(function () {
                    try {
                        var x = onRejected(_this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                        // resolve(x)  //用then的返回值，作为下一次成功结果
                    }
                    catch (e) {
                        // 抛错的时候
                        reject(e);
                    }
                }, 0);
            }
            //如果当前是等待状态，则先把成功回调和失败的回调暂存起来，等状态不是pending的时候调用
            if (_this.status == "PENDING" /* pending */) {
                _this.onResolvedCallbacks.push(function () {
                    //可以增加额外的逻辑
                    setTimeout(function () {
                        try {
                            var x = onFulfilled(_this.value); //订阅模式
                            resolvePromise(promise2, x, resolve, reject);
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }
                        catch (e) {
                            // 抛错的时候
                            reject(e);
                        }
                    }, 0);
                });
                _this.onRejectedCallbacks.push(function () {
                    //可以增加额外的逻辑
                    setTimeout(function () {
                        try {
                            var x = onRejected(_this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                            // resolve(x)  //用then的返回值，作为下一次成功结果
                        }
                        catch (e) {
                            // 抛错的时候
                            reject(e);
                        }
                    });
                });
            }
        });
        return promise2;
    };
    //实现catch
    Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };
    return Promise;
}());
//---------测试是否符合Promise/A+规范
Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

module.exports = Promise;
