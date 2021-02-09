import { isDate, isPlainObject } from './utils';

function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':') // 大小写都不用区分
        .replace(/$24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']')
}
export function buildURL(url: string, params?: any): string {
    if (!params) {
        return url
    }
    const parts: string[] = []
    Object.keys(params).forEach((key) => {
        const val = params[key]
        if (val === null || typeof val === 'undefined') {
            return;
        }
        let values = []
        if (Array.isArray(val)) {
            values = val
            key += '[]'
        } else {
            values = [val]
        }
        values.forEach(val => {
            // 日期类型 对象类型
            if (isDate(val)) {
                val = val.toISOString()
            } else if (isPlainObject(val)) {
                val = JSON.stringify(val)
            }
            parts.push(`${encode(key)}=${encode(val)}`)
        })
    })
    let serializedParams = parts.join('&')
    if (serializedParams) {
        const marIndex = url.indexOf('#') // hash 标示
        if (marIndex !== -1) { // 说明有hash
            console.log(url);
            url = url.slice(0, marIndex)
            console.log(url);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }
    return url;
}