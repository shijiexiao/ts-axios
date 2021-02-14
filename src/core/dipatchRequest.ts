import { AxiosRequestConfig } from '../types'
import xhr from './xhr';
import { buildURL } from '../helpers/url';
import { transformRequest, transformResponse } from '../helpers/data';
import { processHeaders, flattenHeaders } from '../helpers/headers';
import { AxiosPromise, AxiosResponse } from '../types/index';
import transform from './transform';
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config)
    processConfig(config)
    return xhr(config).then(res => {
        // 拿到响应对象  对数据进行 处理
        return transformResponseData(res)
        // return res
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
function transformURL(config: AxiosRequestConfig): string {
    const { url, params ,paramsSerializer} = config
    return buildURL(url!, params,paramsSerializer); // 判断不为空直接后main加个感叹号
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