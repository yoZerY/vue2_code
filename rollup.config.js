//rollup

import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',
        name: 'Vue', //global.Vue
        format: 'umd', //commonjs amd
        sourcemap: true, //调试源代码
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve()
    ]
}
