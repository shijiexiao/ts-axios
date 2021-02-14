import { isDate, isPlainObject, isURLSearchParams } from './utils';

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
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) {
        return url
    }
    let serializedParams
    if (paramsSerializer) {
        // 自定义序列化规则
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString()
    }
    else {
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
        serializedParams = parts.join('&')

    }


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

// 同源的url 是否同源
export function isURLSameOrigin(requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL)
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

interface URLOrigin {
    protocol: string
    host: string
}

const urlParsingNode = document.createElement('a')
// 解析手段
// 当前页面的protocol host

const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { protocol, host } = urlParsingNode
    return {
        protocol,
        host
    }
}