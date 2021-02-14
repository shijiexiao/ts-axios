
const toString = Object.prototype.toString
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}
// export function isObject(val: any): val is Object {
//     return val !== null && typeof val === 'object'
// }
export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]'
}

export function extend<T, U>(to: T, from: U): T & U {
    // from 全部拷贝到to中
    for (const key in from) {
        ; (to as T & U)[key] = from[key] as any
    }
    return to as T & U
}
export function deepMerge(...objs: any[]): any {
    // 普通对象的深拷贝
    const result = Object.create(null)
    objs.forEach(obj => {
        // val1 val2 
        if (obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key]
                // 遍历对象拿到值
                if (isPlainObject(val)) {
                    // 如果还是一个dui x
                    if (isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val)
                    }
                    result[key] = deepMerge(val)
                } else {
                    result[key] = val
                }
            })
        }
    })
    return result
}

export function isFormData(val: any): val is FormData {
    return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams {
    return typeof val !== 'undefined' && val instanceof URLSearchParams
}
