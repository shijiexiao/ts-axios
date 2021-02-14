import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config).then(res => {
        // 拿到响应对象  对数据进行 处理
        return transformResponseData(res)
        // return res
    }, e => {
        if (e && e.response) {
            e.response = transformResponseData(e.response)
        }
        return Promise.reject(e)
    })
}
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    // config.headers = transformHeaders(config)
    // // console.log(config.headers);
    // config.data = transformRequestData(config);
    config.data = transform(config.data, config.headers, config.transformRequest)

    config.headers = flattenHeaders(config.headers, config.method!);// 保证运行时肯定存在即可
}
export function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config
    // 首先看有没有配置baseurl
    // 然后再看传过来的是不是相对地址
    // 再拼接baseurl和相对地址成为绝对地址
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramsSerializer); // 判断不为空直接后main加个感叹号
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}


function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}