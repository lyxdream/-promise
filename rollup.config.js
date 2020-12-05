
import path from 'path'
import ts from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve'
export default{
    input:'src/index.ts',
    output:{
        exports:'auto',
        format:'cjs',//common.js规范 umd esm life
        file:path.resolve(`dist/bundle.js`)
    },
    plugins:[  //解析的时候用的ts插件
        ts({
            tsconfig:path.resolve(`tsconfig.json`)
        }),
        nodeResolve({
            extensions:['.js','.ts']  //扩展名
        })
    ]
}