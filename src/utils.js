
const strats = {}
const LIFECYCLE = [
    'beforecreate', 'created'
]
LIFECYCLE.forEach(hook => {
    strats[hook] = function (parent, child) {
        if (child) {
            if (parent) {
                return parent.concat(child)
            } else {
                return [child]
            }
        } else {
            return parent
        }
    }
})


export function mergeOptions(parent, child) {
    const options = {}
    for (const parentKey in parent) {
        mergeField(parentKey)
    }
    for (const childKey in child) {
        if (!parent.hasOwnProperty(childKey)) {
            mergeField(childKey)
        }
    }

    function mergeField(key) {
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            options[key] = child[key] || parent[key]
        }
    }

    return options
}
