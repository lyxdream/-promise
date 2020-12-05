
const Promise = require('./bundle.js')
let p = new Promise((resolve,reject)=>{
    resolve('ok')
})

p.then((data)=>{
    return data;
}).then((data)=>{
    return data;
}).then((data)=>{
     console.log(data)
})

//穿透
p.then().then().then((data)=>{
     console.log(data)
})