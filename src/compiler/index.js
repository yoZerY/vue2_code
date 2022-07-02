//编译模板

import {parseHTML} from "./parse";

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(e => {
                let [key, value] = e.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

function gen(node) {
    const text = node.text
    if (node.type === 1) {
        return codeGen(node)
    } else {
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            let tokens = []
            let match
            defaultTagRE.lastIndex = 0
            let lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }


}

function genChildren(children) {
    return children && children.map(child => gen(child)).join(',')
}

function codeGen(ast) {
    let children = genChildren(ast.children)
    let code = (`_c('${ast.tag}', 
    ${ast.attrs.length ? genProps(ast.attrs) : 'null'}
    ${ast.children.length ? `, ${children}` : ''})`)

    return code
}

export function compileToFunction(template) {
    //template 转为ast语法树
    let ast = parseHTML(template)

    //生成render 方法  虚拟DOM
    let code = codeGen(ast)
    code = `with(this){return ${code}}`
    let render = new Function(code)
    return render

}
